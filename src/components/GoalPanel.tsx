import { subjectGoals } from "../data/initialTasks";

export default function GoalPanel() {
  return (
    <section className="goals">
      <h2>Estado ideal antes de septiembre</h2>
      <div className="goal-grid">
        {subjectGoals.map((goal) => (
          <article className="goal-card" key={goal.subject}>
            <span className={`subject-pill subject-${goal.subject}`}>{goal.subject}</span>
            <ul>{goal.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>{goal.target}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
