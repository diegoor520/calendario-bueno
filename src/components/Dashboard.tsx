import { subjectGoals } from "../data/initialTasks";
import { Subject, SubjectStats, Task } from "../types";

const subjects: Subject[] = ["Matemáticas", "Business", "Monografía", "Química", "TOK", "Literatura", "Inglés", "Física"];

export default function Dashboard({ tasks }: { tasks: Task[] }) {
  const stats: SubjectStats[] = subjects.map((subject) => {
    const own = tasks.filter((task) => task.subject === subject);
    const completed = own.filter((task) => task.status === "completada").length;
    const postponed = own.filter((task) => task.status === "pospuesta").length;
    const pending = own.filter((task) => task.status !== "completada").length;
    const percent = own.length ? Math.round((completed / own.length) * 100) : 0;
    const risk = postponed >= 3 || percent < 20 ? "rojo" : pending >= 4 || percent < 45 ? "amarillo" : "verde";
    return { subject, total: own.length, completed, pending, postponed, percent, risk };
  });

  return (
    <aside className="dashboard">
      <h2>Progreso por asignatura</h2>
      {stats.map((item) => {
        const goal = subjectGoals.find((entry) => entry.subject === item.subject);
        return (
          <article className="progress-row" key={item.subject}>
            <div className="progress-title">
              <span className={`subject-pill subject-${item.subject}`}>{item.subject}</span>
              <span className={`risk ${item.risk}`}>{item.risk}</span>
            </div>
            <div className="bar"><span style={{ width: `${item.percent}%` }} /></div>
            <p>{item.percent}% completado · {item.pending} pendientes · {item.postponed} pospuestas</p>
            <small>{goal?.target}</small>
          </article>
        );
      })}
    </aside>
  );
}
