import { Task } from "../types";
import { formatDate, getDailyLoad, minutesToLabel, weekDates } from "../utils/dateUtils";

interface Props {
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenDay: (date: string) => void;
}

export default function WeeklyView({ tasks, selectedDate, onSelectDate, onOpenDay }: Props) {
  const dates = weekDates(selectedDate);
  return (
    <section>
      <div className="week-toolbar">
        <input type="date" min="2026-06-01" max="2026-08-31" value={selectedDate} onChange={(event) => onSelectDate(event.target.value)} />
      </div>
      <div className="weekly-grid">
        {dates.map((date) => {
          const dayTasks = tasks.filter((task) => task.date === date);
          const main = dayTasks[0]?.subject ?? "Sin asignatura";
          const load = getDailyLoad(tasks, date);
          return (
            <article className={`week-day ${load > 90 ? "overload" : ""}`} key={date} onClick={() => onOpenDay(date)}>
              <h3>{formatDate(date)}</h3>
              <p><strong>Carga:</strong> {minutesToLabel(load)}</p>
              <p><strong>Principal:</strong> {main}</p>
              {dayTasks.map((task) => (
                <div className="mini-task" key={task.id}>
                  <span className={`subject-pill subject-${task.subject}`}>{task.subject}</span>
                  <p>{task.product}</p>
                </div>
              ))}
            </article>
          );
        })}
      </div>
    </section>
  );
}
