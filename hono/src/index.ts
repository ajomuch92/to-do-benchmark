import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ToDo, sequelize } from './database'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

sequelize.sync().then(() => {
  console.log('Base de datos sincronizada');
});

// Obtener todos los ToDos
app.get('/api/todos', async (c) => {
  try {
    const todos = await ToDo.findAll();
    return c.json(todos, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error al obtener ToDos' }, 500);
  }
});

// Obtener un ToDo por su ID
app.get('/api/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  try {
    const todo = await ToDo.findByPk(id);

    if (todo) {
      return c.json(todo, 200);
    } else {
      return c.json({ message: 'ToDo no encontrado' }, 404);
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error al obtener el ToDo' }, 500);
  }
});

// Crear un nuevo ToDo
app.post('/api/todos', async (c) => {
  const { title, description, status, creationDate } = await c.req.json();

  try {
    const newToDo = await ToDo.create({
      title,
      description,
      status,
      creationDate,
    });

    return c.json(newToDo, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error al crear el ToDo' }, 500);
  }
});

// Actualizar un ToDo existente
app.put('/api/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const { title, description, status } = await c.req.json();

  try {
    const todo = await ToDo.findByPk(id);

    if (!todo) {
      return c.json({ message: 'ToDo no encontrado' }, 404);
    }

    todo.title = title;
    todo.description = description;
    todo.status = status;
    await todo.save();

    return c.json(todo, 204); // NoContent
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error al actualizar el ToDo' }, 500);
  }
});

// Eliminar un ToDo por su ID
app.delete('/api/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  try {
    const todo = await ToDo.findByPk(id);

    if (!todo) {
      return c.json({ message: 'ToDo no encontrado' }, 404);
    }

    await todo.destroy();
    return c.json({ message: 'ToDo eliminado exitosamente' }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error al eliminar el ToDo' }, 500);
  }
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
