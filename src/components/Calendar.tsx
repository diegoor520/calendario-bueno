import { Task } from "../types";
import { getDailyLoad, getMonthDays, minutesToLabel, MONTHS } from "../utils/dateUtils";

interface Props {
  tasks: Task[];
  onOpenDay: (date: string) => void;
  onMoveTask: (taskId: string, date: string) => void;
}

export default function Calendar({ tasks, onOpenDay, onMoveTask }: Props) {
  const byDate = (date: string) => tasks.filter((task) => task.date === date);

  return (
    <div className="months">
      {MONTHS.map(({ month, label }) => (
        <section className="month" key={label}>
          <h2>{label}</h2>
          <div className="weekdays">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {getMonthDays(2026, month).map((date, index) => {
              const dayTasks = date ? byDate(date) : [];
              const load = date ? getDailyLoad(tasks, date) : 0;
              return (
                <button
                  type="button"
                  key={`${label}-${index}`}
                  className={`day-cell ${dayTasks.length ? "has-work" : ""} ${load > 90 ? "overload" : ""}`}
                  disabled={!date}
                  onClick={() => date && onOpenDay(date)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    const taskId = event.dataTransfer.getData("text/plain");
                    if (date && taskId) onMoveTask(taskId, date);
                  }}
                >
                  {date && <>
                    <strong>{Number(date.slice(-2))}</strong>
                    {dayTasks.slice(0, 3).map((task) => <span className={`dot subject-${task.subject}`} key={task.id} title={task.subject} />)}
                    {dayTasks.length > 0 && <small>{dayTasks.length} tarea(s)</small>}
                    {load > 0 && <em>{minutesToLabel(load)}</em>}
                  </>}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
