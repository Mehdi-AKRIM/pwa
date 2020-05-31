import { openDB } from 'idb';

export async function initDB() {
  const config = window.config;
  const db = await openDB('awesome-todo', config.version || 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('todos', {
      // The 'id' property of the object will be the key.
        keyPath: 'id',
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex('id', 'id');
      store.createIndex('synced', 'synced');
      store.createIndex('updated', 'updated');
      store.createIndex('deleted', 'deleted');
      store.createIndex('done', 'done');
      store.createIndex('date', 'date');
    },
  });
  return db;
}

export async function setTodos(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return await db.getAllFromIndex('todos', 'deleted', 'false');
}

export async function setTodo(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  await tx.store.put(data);
  return await db.getAllFromIndex('todos', 'deleted', 'false');
}

export async function getTodos() {
  const db = await initDB();
  return await db.getAllFromIndex('todos', 'deleted', 'false');
}

export async function getTodo(id) {
  const db = await initDB();
  return await db.getFromIndex('todos', 'id', Number(id));
} 

export async function unsetTodo(id) {
  const db = await initDB();
  await db.delete('todos', id);
  return await db.getAllFromIndex('todos', 'deleted', 'false');
}

export async function getTodoToCreate() {
  const db = await initDB();
  return (await db.getAllFromIndex('todos', 'synced', 'false'))
    .filter(todo => todo.deleted === 'false')
    .filter(todo => todo.updated === 'false');
}

export async function getTodoToUpdate() {
  const db = await initDB();
  return (await db.getAllFromIndex('todos', 'synced', 'true'))
    .filter(todo => todo.deleted === 'false')
    .filter(todo => todo.updated === 'true');
}

export async function getTodoToDelete() {
  const db = await initDB();
  return (await db.getAllFromIndex('todos', 'synced', 'true'))
    .filter(todo => todo.deleted === 'true')
    .filter(todo => todo.updated === 'false');
}
