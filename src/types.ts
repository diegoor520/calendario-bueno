export type Subject =
  | "Matemáticas"
  | "Business"
  | "Química"
  | "Monografía"
  | "Literatura"
  | "TOK"
  | "Inglés"
  | "Física";

export type Priority = "Alta" | "Media" | "Baja";
export type TaskStatus = "pendiente" | "en progreso" | "completada" | "pospuesta";
export type ViewMode = "mes" | "semana" | "prioridades" | "objetivos";

export interface Task {
  id: string;
  date: string;
  subject: Subject;
  objective: string;
  actions: string[];
  product: string;
  duration: number;
  priority: Priority;
  status: TaskStatus;
  notes: string;
  produceToday: string;
  done: string;
  missing: string;
  nextAction: string;
}

export interface SubjectGoal {
  subject: Subject;
  target: string;
  checklist: string[];
}

export interface SubjectStats {
  subject: Subject;
  total: number;
  completed: number;
  pending: number;
  postponed: number;
  percent: number;
  risk: "verde" | "amarillo" | "rojo";
}
