const priorities = ["Matemáticas", "Business", "Monografía", "Química", "TOK", "Literatura", "Inglés", "Física"];

export default function PriorityView() {
  return (
    <section className="priority-view">
      <h2>Prioridades reales</h2>
      <p className="warning">No repartas el tiempo igual entre asignaturas. Prioriza lo que tiene fecha temprana, más peso o más incertidumbre.</p>
      <ol>
        {priorities.map((subject) => <li key={subject}>{subject}</li>)}
      </ol>
    </section>
  );
}
