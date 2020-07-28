class Model {
  constructor() {
    // An array of todos
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }

  _commit(todos) {
    this.onTodoListChanged(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  addTodo(todoText) {
    // Create a new todo element.
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    };

    this.todos.push(todo);

    this._commit(this.todos);
  }

  editTodo(id, updatedText) {
    // Map through all todos and replace the text with updated text of specified id.
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: updatedText, complete: todo.complete }
        : todo
    );
    this._commit(this.todos);
  }

  deletTodo(id) {
    // Filter out the todo from array on basis of id.
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this._commit(this.todos);
  }

  toggleTodo(id) {
    // Map through all todos and change the boolean complete of given todo id.
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );

    this._commit(this.todos);
  }
}

class View {
  constructor() {
    // Root element
    this.app = this.getElement("#root");

    // Heading
    this.title = this.createElement("h1");
    this.title.textContent = "Todos";

    // Form to take user input
    this.form = this.createElement("form");
    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Enter taks..";
    this.input.name = "todo";

    // Input submit button
    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";

    // List for todos
    this.todoList = this.createElement("ul", "todo-list");

    // Make [this.input] and [this.submitButton] child of [this.form].
    this.form.append(this.input, this.submitButton);

    // Make [this.title], [this.form] and [this.todoList] child of [this.app]
    this.app.append(this.title, this.form, this.todoList);

    this._temporaryTodoText = "";
    this._initLocalListeners();
  }

  // getter of input value for new todo.
  get _todoText() {
    return this.input.value;
  }
  // reset input value.
  _resetInput() {
    this.input.value = "";
  }
  // Create an element, className is optional.
  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }

  // Retrieve an element from DOM.
  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  displayTodos(todos) {
    // First of all, delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    // Default message
    if (todos.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to do! Add a task...";
      this.todoList.append(p);
    } else {
      // Create todo item nodes for each todo.
      todos.forEach((todo) => {
        const li = this.createElement("li");
        li.id = todo.id;

        // Checkbox to toggle
        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;

        // Item todo text
        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        // For complete todo item
        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          span.textContent = todo.text;
        }

        // Delete button
        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);

        this.todoList.append(li);
      });
    }

    console.log(todos);
  }

  _initLocalListeners() {
    this.todoList.addEventListener("input", (event) => {
      if (event.target.className === "editable") {
        this._temporaryTodoText = event.target.innerText;
      }
    });
  }
  // Setting up event listeners.
  bindAddTodo(handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener("click", (event) => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener("focusout", (event) => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id);

        handler(id, this._temporaryTodoText);
        this._temporaryTodoText = "";
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // display initial todos
    this.onTodoListChanged(this.model.todos);

    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    this.model.bindTodoListChanged(this.onTodoListChanged);
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };

  // Handlers for events in the controller.
  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText);
  };

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText);
  };

  handleDeleteTodo = (id) => {
    this.model.deletTodo(id);
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
  };
}

const app = new Controller(new Model(), new View());
