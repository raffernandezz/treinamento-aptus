"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { POINT, STAGE_POINT_IDS } from "@/data/mission";
import {
  ACHIEVEMENTS,
  EMPTY_SKILLS,
  LESSONS,
  type AchievementId,
  type LessonId,
  type SkillId,
} from "@/data/lessons";
import { clearScorm } from "@/lib/scorm";

export type AnswerState = {
  resolved: boolean;
  awarded: boolean;
  missed: boolean;
};

type AnswerResult = {
  ok: boolean;
  locked: boolean;
  awarded: boolean;
};

type MissionState = {
  hydrated: boolean;
  rawScore: number;
  completedStages: string[];
  foundErrors: string[];
  checklist: string[];
  answers: Record<string, AnswerState>;
  lessonsRead: string[];
  skills: Record<SkillId, number>;
  achievements: string[];
  lastReward: { achievementId?: AchievementId; skill?: SkillId; skillGain?: number; xp: number } | null;
  registerAnswer: (id: string, isCorrect: boolean) => AnswerResult;
  markFound: (id: string) => boolean;
  toggleCheck: (id: string) => void;
  markLessonRead: (id: LessonId) => void;
  unlockAchievement: (id: AchievementId) => boolean;
  applySkillGain: (skill: SkillId, amount: number) => void;
  completeStage: (id: string) => void;
  clearLastReward: () => void;
  reset: () => void;
};

const empty = {
  rawScore: 0,
  completedStages: [] as string[],
  foundErrors: [] as string[],
  checklist: [] as string[],
  answers: {} as Record<string, AnswerState>,
  lessonsRead: [] as string[],
  skills: { ...EMPTY_SKILLS },
  achievements: [] as string[],
  lastReward: null as MissionState["lastReward"],
};

function bumpSkill(skills: Record<SkillId, number>, skill: SkillId, amount: number) {
  return {
    ...skills,
    [skill]: Math.min(100, (skills[skill] ?? 0) + amount),
  };
}

export const useMission = create<MissionState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...empty,
      registerAnswer: (id, isCorrect) => {
        const current = get().answers[id];
        if (current?.resolved) return { ok: true, locked: true, awarded: current.awarded };
        if (!isCorrect) {
          set((state) => ({
            answers: {
              ...state.answers,
              [id]: { resolved: false, awarded: false, missed: true },
            },
          }));
          return { ok: false, locked: false, awarded: false };
        }
        const awarded = !current?.missed;
        set((state) => {
          const nextAchievements = [...state.achievements];
          let skills = state.skills;
          if (awarded && !nextAchievements.includes("first_correct")) {
            nextAchievements.push("first_correct");
          }
          if (awarded) {
            // micro skill nudge on first-try correct answers
            const soft: SkillId =
              id.startsWith("r") || id === "c1"
                ? "relatorios"
                : id.startsWith("m") && id.length <= 2
                  ? "aprovacao"
                  : id.includes("meal") ||
                      id.includes("fuel") ||
                      id.includes("ticket") ||
                      id.includes("lodging") ||
                      id.startsWith("not-") ||
                      id === "c8"
                    ? "politicas"
                    : id === "cupom" || id === "comanda" || id === "pix" || id === "pos"
                      ? "documentos"
                      : "aprovacao";
            skills = bumpSkill(skills, soft, 2);
          }
          return {
            answers: {
              ...state.answers,
              [id]: { resolved: true, awarded, missed: Boolean(current?.missed) },
            },
            rawScore: state.rawScore + (awarded ? POINT.correct : 0),
            achievements: nextAchievements,
            skills,
          };
        });
        return { ok: true, locked: true, awarded };
      },
      markFound: (id) => {
        if (get().foundErrors.includes(id)) return false;
        set((state) => {
          const foundErrors = [...state.foundErrors, id];
          const achievements = [...state.achievements];
          let skills = bumpSkill(state.skills, "auditoria", 4);
          if (foundErrors.filter((item) => ["date", "value", "category"].includes(item)).length >= 3) {
            if (!achievements.includes("error_hunter")) achievements.push("error_hunter");
            skills = bumpSkill(skills, "auditoria", 8);
          }
          return {
            foundErrors,
            rawScore: state.rawScore + POINT.found,
            achievements,
            skills,
          };
        });
        return true;
      },
      toggleCheck: (id) => {
        set((state) => {
          if (state.checklist.includes(id)) return state;
          return { checklist: [...state.checklist, id] };
        });
      },
      markLessonRead: (id) => {
        set((state) => {
          if (state.lessonsRead.includes(id)) return state;
          return { lessonsRead: [...state.lessonsRead, id] };
        });
      },
      unlockAchievement: (id) => {
        if (get().achievements.includes(id)) return false;
        if (!ACHIEVEMENTS.some((item) => item.id === id)) return false;
        set((state) => ({ achievements: [...state.achievements, id] }));
        return true;
      },
      applySkillGain: (skill, amount) => {
        set((state) => ({ skills: bumpSkill(state.skills, skill, amount) }));
      },
      completeStage: (id) => {
        set((state) => {
          if (state.completedStages.includes(id)) return state;
          const points = (STAGE_POINT_IDS as readonly string[]).includes(id) ? POINT.stage : 0;
          const lesson = LESSONS[id as LessonId];
          let skills = state.skills;
          const achievements = [...state.achievements];
          let skillGain = 0;
          let achievementId: AchievementId | undefined;

          if (lesson) {
            skillGain = lesson.skillGain;
            skills = bumpSkill(skills, lesson.skill, lesson.skillGain);
            if (lesson.stageAchievement && !achievements.includes(lesson.stageAchievement)) {
              achievements.push(lesson.stageAchievement);
              achievementId = lesson.stageAchievement;
            }
          }

          // perfect stage: no missed answers tied to known decision sets for that stage
          if (id === "reports" || id === "finance" || id === "meals" || id === "manager") {
            const related = Object.entries(state.answers).filter(([key, value]) => {
              if (!value.resolved) return false;
              if (id === "reports") return key.startsWith("r");
              if (id === "finance") return ["cupom", "comanda", "pix", "pos"].includes(key);
              if (id === "meals") return key.startsWith("meal");
              if (id === "manager") return key.startsWith("m") && key.length <= 2;
              return false;
            });
            if (related.length > 0 && related.every(([, value]) => value.awarded && !value.missed)) {
              if (!achievements.includes("perfect_stage")) {
                achievements.push("perfect_stage");
                if (!achievementId) achievementId = "perfect_stage";
              }
            }
          }

          if (id === "special" && !achievements.includes("policy_pro")) {
            // policy_pro also requires meals ideally; award if meals already done
            if (state.completedStages.includes("meals") && lesson?.stageAchievement) {
              /* already handled via lesson.stageAchievement */
            }
          }

          return {
            completedStages: [...state.completedStages, id],
            rawScore: state.rawScore + points,
            skills,
            achievements,
            lastReward: {
              achievementId,
              skill: lesson?.skill,
              skillGain,
              xp: points,
            },
          };
        });
      },
      clearLastReward: () => set({ lastReward: null }),
      reset: () => {
        clearScorm();
        set({ ...empty, skills: { ...EMPTY_SKILLS } });
      },
    }),
    {
      name: "missao-sem-glosa",
      partialize: (state) => ({
        rawScore: state.rawScore,
        completedStages: state.completedStages,
        foundErrors: state.foundErrors,
        checklist: state.checklist,
        answers: state.answers,
        lessonsRead: state.lessonsRead,
        skills: state.skills,
        achievements: state.achievements,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<MissionState>;
        return {
          ...current,
          ...p,
          skills: { ...EMPTY_SKILLS, ...(p.skills ?? {}) },
          lessonsRead: p.lessonsRead ?? [],
          achievements: p.achievements ?? [],
        };
      },
    },
  ),
);
