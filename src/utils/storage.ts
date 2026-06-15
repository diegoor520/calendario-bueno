import { Task, ViewMode } from "../types";

const TASK_KEY = "ib-summer-planner-tasks";
const VIEW_KEY = "ib-summer-planner-view";

export const loadTasks = (fallback: Task[]) => {
  try {
    const raw = localStorage.getItem(TASK_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : fallback;
  } catch {
    return fallback;
  }
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export const loadView = (): ViewMode => {
  const value = localStorage.getItem(VIEW_KEY);
  return value === "semana" || value === "prioridades" || value === "objetivos" ? value : "mes";
};

export const saveView = (view: ViewMode) => {
  localStorage.setItem(VIEW_KEY, view);
};

export const clearPlannerStorage = () => {
  localStorage.removeItem(TASK_KEY);
  localStorage.removeItem(VIEW_KEY);
};
