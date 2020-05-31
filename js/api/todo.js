export async function fetchTodos() {
  const config = window.config;
  return fetch(`${config.api}/todos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  });
}


export async function fetchTodo(id) {
  const config = window.config;
  return fetch(`${config.api}/todos/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  });
}

export async function createTodo(data) {
  const config = window.config;
  return fetch(`${config.api}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  }); 
}

export async function deleteTodo(id) {
  const config = window.config;
  return fetch(`${config.api}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  }); 
}

export async function updateTodo(data) {
  const config = window.config;
  return fetch(`${config.api}/todos/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  }); 
}
