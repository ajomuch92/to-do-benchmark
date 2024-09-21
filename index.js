const axios = require('axios');
const now = require('performance-now');

const baseURL = 'http://localhost:5128/api/ToDo';
const totalRequests = 250;
const todoModel = {
    id: 0,
    title: "string",
    description: "string",
    status: "string",
    creationDate: new Date().toISOString(),
};

// Almacenar los IDs creados
let createdIds = [];

// Función para crear un ToDo
const createTodo = async () => {
    try {
        const response = await axios.post(baseURL, todoModel);
        return response.data;
    } catch (error) {
        console.error('Error creando ToDo:', error.message);
    }
};

// Función para obtener todos los ToDos
const getTodos = async () => {
    try {
        const response = await axios.get(baseURL);
        return response.data;
    } catch (error) {
        console.error('Error leyendo ToDos:', error.message);
    }
};

// Función para obtener un ToDo por su ID
const getTodoById = async (id) => {
    try {
        const response = await axios.get(`${baseURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error leyendo ToDo con ID ${id}:`, error.message);
    }
};

// Función para eliminar un ToDo por su ID
const deleteTodo = async (id) => {
    try {
        await axios.delete(`${baseURL}/${id}`);
    } catch (error) {
        console.error(`Error eliminando ToDo con ID ${id}:`, error.message);
    }
};

// Función para medir el tiempo de creación de ToDos
const measureCreationTime = async () => {
    const start = now();
    for (let i = 0; i < totalRequests; i++) {
        const createdTodo = await createTodo();
        if (createdTodo && createdTodo.id) {
            createdIds.push(createdTodo.id);
        }
    }
    const end = now();
    console.log(`Tiempo de creación de ${totalRequests} ToDos: ${(end - start).toFixed(2)} ms`);
};

// Función para medir el tiempo de lectura de todos los ToDos
const measureReadAllTime = async () => {
    const start = now();
    const todos = await getTodos();
    const end = now();
    console.log(`Tiempo de lectura de todos los ToDos: ${(end - start).toFixed(2)} ms`);
};

// Función para medir el tiempo de lectura de ToDos individualmente
const measureReadIndividualTime = async () => {
    const start = now();
    for (const id of createdIds) {
        await getTodoById(id);
    }
    const end = now();
    console.log(`Tiempo de lectura individual de ${createdIds.length} ToDos: ${(end - start).toFixed(2)} ms`);
};

// Función para medir el tiempo de eliminación de ToDos
const measureDeleteTime = async () => {
    const start = now();
    for (const id of createdIds) {
        await deleteTodo(id);
    }
    const end = now();
    console.log(`Tiempo de eliminación de ${createdIds.length} ToDos: ${(end - start).toFixed(2)} ms`);
};

// Función principal para ejecutar el test
const runPerformanceTest = async () => {
    await measureCreationTime();
    await measureReadAllTime();
    await measureReadIndividualTime();
    await measureDeleteTime();
};

// Ejecuta el test
runPerformanceTest().catch(console.error);
