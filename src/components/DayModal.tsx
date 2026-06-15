import { FormEvent, useMemo, useState } from "react";
import { X } from "lucide-react";
import TaskCard from "./TaskCard";
import { Task } from "../types";
import { formatDate, getDailyLoad, minutesToLabel } from "../utils/dateUtils";

const subjects: Task["subject"][] = ["Matemáticas", "Business", "Química", "Monografía", "Literatura", "TOK", "Inglés", "Física"];
const blankTask = (date: string): Task => ({
  id: `task-${Date.now()}`,
  date,
  subject: "Matemáticas",
  objective: "",
  actions: [""],
  product: "",
  duration: 45,
  priority: "Media",
  status: "pendiente",
  notes: "",
  produceToday: "",
  done: "",
  missing: "",
  nextAction: ""
});

interface Props {
  date: string;
  tasks: Task[];
  allTasks: Task[];
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onMove: (taskId: string, date: string, status?: Task["status"]) => void;
}

export default function DayModal({ date, tasks, allTasks, onClose, onUpdate, onDelete, onAdd, onDuplicate, onMove }: Props) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [postponing, setPostponing] = useState<Task | null>(null);
  const [targetDate, setTargetDate] = useState(date);
  const total = useMemo(() => getDailyLoad(allTasks, date), [allTasks, date]);
  const targetLoad = useMemo(() => (targetDate ? getDailyLoad(allTasks, targetDate) + (postponing?.duration ?? 0) : 0), [allTasks, targetDate, postponing]);

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const cleaned = { ...editing, actions: editing.actions.map((action) => action.trim()).filter(Boolean) };
    if (tasks.some((task) => task.id === cleaned.id)) onUpdate(cleaned);
    else onAdd(cleaned);
    setEditing(null);
  };

  return (
    <div className="modal-backdrop">
      <section className="day-modal">
        <header className="modal-head">
          <div>
            <p className="eyebrow">{formatDate(date)}</p>
            <h2>{tasks.length ? `${tasks.length} tarea(s)` : "Día libre"}</h2>
            <span className={total > 90 ? "load-warning" : "load-ok"}>{minutesToLabel(total)} de carga</span>
          </div>
          <button className="icon-action" title="Cerrar" onClick={onClose}><X size={20} /></button>
        </header>
        {total > 90 && <p className="warning">Carga excesiva para una sesión corta</p>}

        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditing(task)}
              onDelete={() => onDelete(task.id)}
              onDuplicate={() => onDuplicate(task)}
              onStatus={(status) => onUpdate({ ...task, status })}
              onPostpone={() => {
                setPostponing(task);
                setTargetDate(task.date);
              }}
            />
          ))}
        </div>

        <button className="primary" onClick={() => setEditing(blankTask(date))}>Añadir tarea</button>

        {postponing && (
          <div className="submodal">
            <h3>Posponer tarea</h3>
            <label>Nuevo día<input type="date" value={targetDate} min="2026-06-01" max="2026-08-31" onChange={(event) => setTargetDate(event.target.value)} /></label>
            {targetLoad > 90 && <p className="warning">Carga excesiva para una sesión corta</p>}
            <div className="form-actions">
              <button onClick={() => setPostponing(null)}>Cancelar</button>
              <button className="primary" onClick={() => {
                onUpdate({ ...postponing, status: "pospuesta" });
                onMove(postponing.id, targetDate, "pendiente");
                setPostponing(null);
              }}>Mover</button>
            </div>
          </div>
        )}

        {editing && (
          <form className="editor" onSubmit={save}>
            <h3>{tasks.some((task) => task.id === editing.id) ? "Editar tarea" : "Nueva tarea"}</h3>
            <div className="form-grid">
              <label>Asignatura<select value={editing.subject} onChange={(event) => setEditing({ ...editing, subject: event.target.value as Task["subject"] })}>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
              <label>Fecha<input type="date" min="2026-06-01" max="2026-08-31" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} /></label>
              <label>Duración<input type="number" min="5" step="5" value={editing.duration} onChange={(event) => setEditing({ ...editing, duration: Number(event.target.value) })} /></label>
              <label>Prioridad<select value={editing.priority} onChange={(event) => setEditing({ ...editing, priority: event.target.value as Task["priority"] })}><option>Alta</option><option>Media</option><option>Baja</option></select></label>
              <label>Estado<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as Task["status"] })}><option>pendiente</option><option>en progreso</option><option>completada</option><option>pospuesta</option></select></label>
            </div>
            <label>Objetivo concreto<input value={editing.objective} onChange={(event) => setEditing({ ...editing, objective: event.target.value })} required /></label>
            <label>Acciones específicas<textarea value={editing.actions.join("\n")} onChange={(event) => setEditing({ ...editing, actions: event.target.value.split("\n") })} /></label>
            <label>Producto final esperado<input value={editing.product} onChange={(event) => setEditing({ ...editing, product: event.target.value, produceToday: event.target.value })} required /></label>
            <div className="form-grid">
              <label>Hoy voy a producir<textarea value={editing.produceToday} onChange={(event) => setEditing({ ...editing, produceToday: event.target.value })} /></label>
              <label>Terminado<textarea value={editing.done} onChange={(event) => setEditing({ ...editing, done: event.target.value })} /></label>
              <label>Falta<textarea value={editing.missing} onChange={(event) => setEditing({ ...editing, missing: event.target.value })} /></label>
              <label>Siguiente acción exacta<textarea value={editing.nextAction} onChange={(event) => setEditing({ ...editing, nextAction: event.target.value })} /></label>
            </div>
            <label>Notas personales<textarea value={editing.notes} onChange={(event) => setEditing({ ...editing, notes: event.target.value })} /></label>
            <div className="form-actions">
              <button type="button" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="primary" type="submit">Guardar</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
