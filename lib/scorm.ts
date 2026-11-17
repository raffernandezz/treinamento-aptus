type ScormApi = {
  SetValue?: (key: string, value: string) => string;
  Commit?: (value: string) => string;
  LMSSetValue?: (key: string, value: string) => string;
  LMSCommit?: (value: string) => string;
};

function apis(): { modern?: ScormApi; legacy?: ScormApi } {
  if (typeof window === "undefined") return {};
  const host = window as Window & { API_1484_11?: ScormApi; API?: ScormApi };
  return { modern: host.API_1484_11, legacy: host.API };
}

function remember(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function saveScore(score: number) {
  remember("missao-sem-glosa-scorm-score", String(score));
  const { modern, legacy } = apis();
  modern?.SetValue?.("cmi.score.raw", String(score));
  modern?.SetValue?.("cmi.score.min", "0");
  modern?.SetValue?.("cmi.score.max", "100");
  modern?.SetValue?.("cmi.score.scaled", String(score / 100));
  legacy?.LMSSetValue?.("cmi.core.score.raw", String(score));
  legacy?.LMSSetValue?.("cmi.core.score.min", "0");
  legacy?.LMSSetValue?.("cmi.core.score.max", "100");
  modern?.Commit?.("");
  legacy?.LMSCommit?.("");
}

export function saveProgress(progress: number) {
  remember("missao-sem-glosa-scorm-progress", String(progress));
  const { modern, legacy } = apis();
  modern?.SetValue?.("cmi.progress_measure", String(progress / 100));
  legacy?.LMSSetValue?.("cmi.core.lesson_location", String(progress));
  modern?.Commit?.("");
  legacy?.LMSCommit?.("");
}

export function completeLesson() {
  const { modern, legacy } = apis();
  modern?.SetValue?.("cmi.completion_status", "completed");
  modern?.SetValue?.("cmi.success_status", "unknown");
  legacy?.LMSSetValue?.("cmi.core.lesson_status", "completed");
  modern?.Commit?.("");
  legacy?.LMSCommit?.("");
  remember("missao-sem-glosa-scorm-status", "completed");
}

export function clearScorm() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("missao-sem-glosa-scorm-score");
  window.localStorage.removeItem("missao-sem-glosa-scorm-progress");
  window.localStorage.removeItem("missao-sem-glosa-scorm-status");
}
