import { html, render } from 'lit-html';
export default function TodoCard(todo) {
  function deleteItem() {
    const event = new CustomEvent('delete-todo', { detail: todo });
    document.dispatchEvent(event);
  }

  function updateItem() {
    todo.done = todo.done === 'true'  ? 'false' : 'true';
    const event = new CustomEvent('update-todo', { detail: todo });
    document.dispatchEvent(event);
  }

  return html`
    <style>
      input:checked + svg {
        display: block;
      }
    </style> 
    <section class="toto-card mt-4 px-4 py-3 bg-gray-300 rounded-lg flex items-center shadow-sm">
      <aside>
        <label class="flex justify-start items-start" tabindex="0" aria-label="Check todo">
          <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center focus:border-blue-500">
            <input type="checkbox" name="todo[]" class="opacity-0 absolute" tabindex="0"  ?checked="${todo.done === 'true'}" @change=${updateItem}>
            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
          </div>
        </label>
      </aside>
      <main class="flex-1 ml-2 truncate">
        <a class="block font-bold text-gray-900 truncate" href="${`/todos/${todo.id}`}">${todo.title}</a>
        <p class="text-gray-300">${todo.description}</p>
      </main>
      ${ todo.synced === 'false' ? html`<lit-icon icon="cloud-off"></lit-icon>` : '' }
      <button @click="${deleteItem}" class="ml-2 text-red-600" aria-label="Delete">
        <lit-icon icon="delete"></lit-icon>
      </button>
    </section>
  `;
}
