import { Task } from "../types";

export const MONTHS = [
  { month: 5, label: "Junio 2026" },
  { month: 6, label: "Julio 2026" },
  { month: 7, label: "Agosto 2026" }
];

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00`)
  );

export const shortDate = (date: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));

export const isoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getMonthDays = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const days: Array<string | null> = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= last.getDate(); day += 1) days.push(isoDate(year, month, day));
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

export const minutesToLabel = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
};

export const getDailyLoad = (tasks: Task[], date: string) =>
  tasks.filter((task) => task.date === date && task.status !== "completada").reduce((sum, task) => sum + task.duration, 0);

export const weekStart = (date: string) => {
  const d = new Date(`${date}T12:00:00`);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
};

export const weekDates = (anchor: string) => {
  const start = weekStart(anchor);
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(start);
    d.setDate(start.getDate() + index);
    return d.toISOString().slice(0, 10);
  });
};
