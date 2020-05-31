import { html, render } from 'lit-html';
import 'lit-icon';

export default function Edit(page, data) {
  const properties = {};
  function deleteItem() {
    const event = new CustomEvent('delete-todo', { detail: data });
    document.dispatchEvent(event);
  }

  function updateItem() {
    data.done = data.done === 'true'  ? 'false' : 'true';
    const event = new CustomEvent('update-todo', { detail: data });
    document.dispatchEvent(event);
  }

  const template = ({ data, properties }) => html`
    <style>
      input:checked + svg {
        display: block;
      }
    </style> 
    <section class="rounder-lg bg-white mt-4 mx-4 px-4 py-4 shadow-sm">
      <header class="flex items-center">
        <label class="flex justify-start items-start" tabindex="0" aria-label="Check todo">
          <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center focus:border-blue-500">
            <input type="checkbox" name="todo[]" class="opacity-0 absolute" tabindex="0"  ?checked="${data.done === 'true'}" @change=${updateItem}>
            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
          </div>
        </label>
        <h1 class="ml-2 text-2xl flex-1">${data.title}</h1>
        ${ data.synced === 'false' ? html`<lit-icon icon="cloud-off"></lit-icon>` : '' }
        <button @click="${deleteItem}" class="ml-2 text-red-600" aria-label="Delete">
          <lit-icon icon="delete"></lit-icon>
        </button>
      </header>
      <main></main>
    </section>
    <lit-iconset>
      <svg><defs>
        <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
        <g id="cloud-off"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"></path></g>
        <g id="send"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></g>
      </defs></svg>
    </lit-iconset>
  `;

  function renderView(data) {
    const view = template({ data, properties });
    render(view, page);
  }

  renderView(data);

  document.addEventListener('render-view', ({ detail }) => {
    renderView(detail);
  });
}
