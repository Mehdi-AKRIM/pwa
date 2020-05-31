import page from 'page';
import checkConnectivity from './network.js';
import { fetchTodos, fetchTodo, createTodo, deleteTodo, updateTodo } from './api/todo.js';
import { setTodos, setTodo, getTodos, getTodo, unsetTodo, getTodoToCreate, getTodoToUpdate, getTodoToDelete } from './idb.js';
// Loading config

checkConnectivity({});
document.addEventListener('connection-changed', e => {
  let root = document.documentElement;
  document.offline = !e.detail;
  if (!document.offline) {
    syncData();
  }
});

const app = document.querySelector('#app .outlet');

fetch('/config.json')
  .then((result) => result.json())
  .then(async (config) => {
    console.log('[todo] Config loaded !!!');
    window.config = config;

    page('/', async () => {      
      const module = await import('/js/views/Home.js');
      const Home = module.default;
      
      const base = document.head.querySelector('base');
      document.title = `${base.dataset.base} - Todo list`;

      let todos = [];
      if (!document.offline) {
        const data = await fetchTodos();
        todos = await setTodos(data);
      } else {
        todos = await getTodos() || [];
      }
      
      Home(app.querySelector('[page=Home]'), todos);
      displayPage('Home');

      document.addEventListener('create-todo', async ({ detail }) => {
        await setTodo(detail);
        if (!document.offline && navigator.onLine === true) {
          const result = await createTodo(detail);
          if (result !== false) {
            // If we successfuly get a result from API
            // Get the updated todo list
            const todo = await getTodos();
            // Rerender the template
            return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
          }
        }
        // In case of an error
        // Update the synced flag of the new todo
        detail.synced = 'false';
        const todo = await setTodo(detail);
        // Rerender the template
        return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
      });

      document.addEventListener('delete-todo', async ({ detail }) => {
        if (!document.offline && navigator.onLine === true) {
          const result = await deleteTodo(detail.id);
          if (result !== false) {
            // If we successfuly get a result from API
            // Get the updated todo list
            const todo = await unsetTodo(detail.id);
            // Rerender the template
            return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
          }
        }
        // In case of an error
        detail.deleted = 'true';
        const todo = await setTodo(detail);
        // Rerender the template
        return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
      });

      document.addEventListener('update-todo', async ({ detail }) => {
        await setTodo(detail);
        if (!document.offline && navigator.onLine === true) {
          const result = await updateTodo(detail);
          if (result !== false) {
            // If we successfuly get a result from API
            // Get the updated todo list
            const todo = await getTodos();
            // Rerender the template
            return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
          }
        }
        // In case of an error
        if (detail.synced === 'true') detail.updated = 'true';
        const todo = await setTodo(detail);
        // Rerender the template
        return document.dispatchEvent(new CustomEvent('render-view', { detail: todo }));
      });
    });

    page('/todos/:id', async (ctx) => {
      const module = await import('/js/views/Edit.js');
      const Edit = module.default;

      const base = document.head.querySelector('base');
      document.title = `${base.dataset.base} - `;

      let todo = {};
      if (!document.offline) {
        const data = await fetchTodo(ctx.params.id);
        await setTodo(data);
        todo = await getTodo(ctx.params.id) || {};
      } else {
        todo = await getTodo(ctx.params.id) || {};
      }

      Edit(app.querySelector('[page=Edit]'), todo);
      displayPage('Edit');
    });

    page('*', () => {
      page.redirect('/');
    });

    page();
  });

async function syncData() {
  const toCreate = await getTodoToCreate();
  if (toCreate.length) {
    for (let todo of toCreate) {
      todo.synced = 'true';
      const result = await createTodo(todo);
      if (result !== false) {
        await setTodo(todo);
      } else {
        todo.synced = 'false';
        await setTodo(todo);
      }
    }

    const todos = await getTodos() || [];
    document.dispatchEvent(new CustomEvent('render-view', { detail: todos }));
  }

  const toUpdate = await getTodoToUpdate();
  if (toUpdate.length) {
    for (let todo of toUpdate) {
      todo.synced = 'true';
      todo.updated = 'false';
      const result = await updateTodo(todo);
      if (result !== false) {
        await setTodo(todo);
      } else {
        todo.synced = 'false';
        todo.updated = 'true';
        await setTodo(todo);
      }
    }

    const todos = await getTodos() || [];
    document.dispatchEvent(new CustomEvent('render-view', { detail: todos }));
  }

  const toDelete = await getTodoToDelete();
  if (toDelete.length) {
    for (let todo of toDelete) {
      todo.synced = 'true';
      const result = await deleteTodo(todo.id);
      if (result !== false) {
        await setTodo(todo);
      } else {
        todo.synced = 'false';
        await setTodo(todo);
      }
    }
  }
}

function displayPage(name) {
  const skeleton = document.querySelector('#app .skeleton');
  skeleton.removeAttribute('hidden');
  const pages = app.querySelectorAll('[page]');
  pages.forEach(page => page.removeAttribute('active'));
  skeleton.setAttribute('hidden', 'true');
  const p = app.querySelector(`[page="${name}"]`);
  p.setAttribute('active', true);
}