import { openDb, fetchTodos, createTodo, deleteTodo } from './db.js'

window.onload = function() {
  // Display the todo items.
  openDb(refreshTodos)

  // Get references to the form elements.
  const newTodoForm = document.getElementById('new-todo-form')
  const newTodoInput = document.getElementById('new-todo')

  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    const text = newTodoInput.value

    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g, '') !== '') {
      // Create the todo item.
      createTodo(text, function(todo) {
        refreshTodos()
      })
    }

    // Reset the input field.
    newTodoInput.value = ''

    // Don't send the form.
    return false
  }
}

// Update the list of todo items.
function refreshTodos() {
  fetchTodos(function(todos) {
    const todoList = document.getElementById('todo-items')
    todoList.innerHTML = ''

    for (let index = 0; index < todos.length; index++) {
      // Read the todo items backwards (most recent first).
      const todo = todos[todos.length - 1 - index]

      const li = document.createElement('li')
      li.id = 'todo-' + todo.timestamp
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'todo-checkbox'
      checkbox.setAttribute('data-id', todo.timestamp)

      li.appendChild(checkbox)

      const span = document.createElement('span')
      span.innerHTML = todo.text

      li.appendChild(span)

      
      
      const editBtn = document.createElement('input');
      editBtn.type = 'button';
      editBtn.className = 'editBtn';
      editBtn.value = 'Edit';
      editBtn.setAttribute('edit-id', todo.timestamp);

      const saveBtn = document.createElement('input');
      saveBtn.type = 'button';
      saveBtn.className = 'saveBtn';
      saveBtn.value = 'Save';
      saveBtn.setAttribute('save-id', todo.timestamp);

      li.appendChild(editBtn);

      todoList.appendChild(li)

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        const id = parseInt(e.target.getAttribute('data-id'))

        deleteTodo(id, refreshTodos)
      })

      editBtn.addEventListener('click', function(e) {
        const idEdit = parseInt(e.target.getAttribute('edit-id'))


        const editField = document.createElement('input');
        editField.value = todo.text;

        li.replaceChild(editField, span);
        li.replaceChild(saveBtn, editBtn);

        saveBtn.addEventListener('click', function(e) {
          const editText = editField.value;
          if (editText.replace(/ /g, '') !== '') {
            // Create the todo item.
            createTodo(editText, function(todo) {
              deleteTodo(idEdit, refreshTodos)
          })
        }
        else {
          deleteTodo(idEdit, refreshTodos);
        }
      })
      })
    }
  })
}
