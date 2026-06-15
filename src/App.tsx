import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardList, Flag, Goal, RotateCcw } from "lucide-react";
import Calendar from "./components/Calendar";
import Dashboard from "./components/Dashboard";
import DayModal from "./components/DayModal";
import WeeklyView from "./components/WeeklyView";
import PriorityView from "./components/PriorityView";
import GoalPanel from "./components/GoalPanel";
import { initialTasks } from "./data/initialTasks";
import { Task, ViewMode } from "./types";
import { getDailyLoad } from "./utils/dateUtils";
import { clearPlannerStorage, loadTasks, loadView, saveTasks, saveView } from "./utils/storage";

const today = "2026-06-15";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(initialTasks));
  const [view, setView] = useState<ViewMode>(() => loadView());
  const [selectedDate, setSelectedDate] = useState(today);
  const [modalDate, setModalDate] = useState<string | null>(null);

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveView(view), [view]);

  const alerts = useMemo(() => {
    const messages: string[] = [];
    const prioritySubjects = ["Matemáticas", "Business", "Química", "Monografía"];
    const postponed = tasks.filter((task) => task.status === "pospuesta").length;
    const criticalPending = tasks.filter(
      (task) => prioritySubjects.includes(task.subject) && task.priority === "Alta" && task.status !== "completada"
    );
    const lowProgress = prioritySubjects.filter((subject) => {
      const subjectTasks = tasks.filter((task) => task.subject === subject);
      const completed = subjectTasks.filter((task) => task.status === "completada").length;
      return subjectTasks.length > 0 && completed / subjectTasks.length < 0.35;
    });
    const overloadedDays = [...new Set(tasks.map((task) => task.date))].filter((date) => getDailyLoad(tasks, date) > 90);

    if (criticalPending.length >= 8) messages.push("Hay muchas tareas críticas pendientes en asignaturas prioritarias.");
    if (postponed >= 3) messages.push("Se están acumulando tareas pospuestas.");
    if (overloadedDays.length) messages.push(`${overloadedDays.length} día(s) superan 1 h 30 min de carga.`);
    if (lowProgress.length) messages.push(`Progreso bajo en: ${lowProgress.join(", ")}.`);
    const currentDate = new Date().toISOString().slice(0, 10);
    const lastWeekPending =
      currentDate >= "2026-08-25" &&
      tasks.some((task) => task.date >= "2026-08-25" && task.priority === "Alta" && task.status !== "completada");
    if (lastWeekPending) messages.push("Quedan menos de 7 días para septiembre con tareas críticas pendientes.");
    return messages;
  }, [tasks]);

  const updateTask = (updated: Task) => setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
  const deleteTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id));
  const addTask = (task: Task) => setTasks((current) => [...current, task]);
  const duplicateTask = (task: Task) =>
    setTasks((current) => [...current, { ...task, id: `${task.id}-copy-${Date.now()}`, status: "pendiente" }]);
  const moveTask = (taskId: string, date: string, status: Task["status"] = "pendiente") => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, date, status } : task)));
  };
  const reset = () => {
    clearPlannerStorage();
    setTasks(initialTasks);
    setView("mes");
    setSelectedDate(today);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Verano IB 2026</p>
          <h1>Planificador de entregables</h1>
        </div>
        <nav className="tabs" aria-label="Vistas">
          <button className={view === "mes" ? "active" : ""} onClick={() => setView("mes")}><CalendarDays size={18} /> Mes</button>
          <button className={view === "semana" ? "active" : ""} onClick={() => setView("semana")}><ClipboardList size={18} /> Semana</button>
          <button className={view === "prioridades" ? "active" : ""} onClick={() => setView("prioridades")}><Flag size={18} /> Prioridades</button>
          <button className={view === "objetivos" ? "active" : ""} onClick={() => setView("objetivos")}><Goal size={18} /> Objetivos</button>
        </nav>
        <button className="icon-action" title="Restablecer planificación inicial" onClick={reset}><RotateCcw size={18} /></button>
      </header>

      <main className="layout">
        <section className="main-panel">
          {alerts.length > 0 && (
            <div className="alerts">
              {alerts.map((alert) => <p key={alert}>{alert}</p>)}
            </div>
          )}
          {view === "mes" && (
            <Calendar
              tasks={tasks}
              onOpenDay={setModalDate}
              onMoveTask={moveTask}
            />
          )}
          {view === "semana" && (
            <WeeklyView
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenDay={setModalDate}
            />
          )}
          {view === "prioridades" && <PriorityView />}
          {view === "objetivos" && <GoalPanel />}
        </section>
        <Dashboard tasks={tasks} />
      </main>

      {modalDate && (
        <DayModal
          date={modalDate}
          tasks={tasks.filter((task) => task.date === modalDate)}
          allTasks={tasks}
          onClose={() => setModalDate(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAdd={addTask}
          onDuplicate={duplicateTask}
          onMove={moveTask}
        />
      )}
    </div>
  );
}
