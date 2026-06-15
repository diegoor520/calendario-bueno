import { Copy, Edit3, GripVertical, Trash2 } from "lucide-react";
import { Task } from "../types";
import { minutesToLabel } from "../utils/dateUtils";

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStatus: (status: Task["status"]) => void;
  onPostpone: () => void;
}

export default function TaskCard({ task, onEdit, onDelete, onDuplicate, onStatus, onPostpone }: Props) {
  return (
    <article className={`task-card status-${task.status.replace(" ", "-")}`} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}>
      <div className="task-head">
        <span className={`subject-pill subject-${task.subject}`}>{task.subject}</span>
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        <GripVertical size={17} className="drag-icon" />
      </div>
      <h3>{task.objective}</h3>
      <p><strong>Producto:</strong> {task.product}</p>
      <p><strong>Duración:</strong> {minutesToLabel(task.duration)}</p>
      <ul>{task.actions.map((action) => <li key={action}>{action}</li>)}</ul>
      {(task.notes || task.done || task.missing || task.nextAction) && (
        <div className="task-notes">
          {task.notes && <p><strong>Notas:</strong> {task.notes}</p>}
          {task.done && <p><strong>Terminado:</strong> {task.done}</p>}
          {task.missing && <p><strong>Falta:</strong> {task.missing}</p>}
          {task.nextAction && <p><strong>Siguiente:</strong> {task.nextAction}</p>}
        </div>
      )}
      <div className="task-actions">
        <select value={task.status} onChange={(event) => onStatus(event.target.value as Task["status"])} aria-label="Estado">
          <option value="pendiente">pendiente</option>
          <option value="en progreso">en progreso</option>
          <option value="completada">completada</option>
          <option value="pospuesta">pospuesta</option>
        </select>
        <button onClick={onPostpone}>Posponer</button>
        <button className="icon-action" title="Editar" onClick={onEdit}><Edit3 size={16} /></button>
        <button className="icon-action" title="Duplicar" onClick={onDuplicate}><Copy size={16} /></button>
        <button className="icon-action danger" title="Eliminar" onClick={onDelete}><Trash2 size={16} /></button>
      </div>
    </article>
  );
}
