# Planificador verano IB

Aplicación web interactiva para organizar junio, julio y agosto de 2026 con tareas concretas, productos finales, progreso por asignatura y guardado automático en el navegador.

## Instalación

1. Instala Node.js si no lo tienes.
2. Abre una terminal en esta carpeta.
3. Ejecuta:

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

Después abre la dirección que muestre la terminal, normalmente:

```text
http://127.0.0.1:5173
```

## Uso

- En la vista Mes, pulsa cualquier día para ver o editar sus tareas.
- Arrastra una tarea desde su tarjeta y suéltala sobre otro día del calendario para moverla.
- Usa Posponer para elegir una fecha concreta y ver avisos si el nuevo día supera 1 h 30 min.
- Edita los campos “Hoy voy a producir”, “Terminado”, “Falta” y “Siguiente acción exacta” desde cada tarea.
- El panel lateral muestra progreso, pendientes, pospuestas, estado objetivo e indicador de riesgo.
- Todo se guarda automáticamente en localStorage.

## Comprobación de producción Actualización de despliegue.

```bash
npm run build
```
