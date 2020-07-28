class Model {
  constructor() {
    // An array of todos
    this.todos = [
      { id: 1, text: "Demo task 1", complete: false },
      { id: 2, text: "Demo task 2", complete: false },
    ];
  }

  addTodo(todoText) {
    // Create a new todo element.
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    };

    this.todos.push(todo);
  }

  editTodo(id, updatedText) {
    // Map through all todos and replace the text with updated text of specified id.
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: updatedText, complete: todo.complete }
        : todo
    );
  }

  deletTodo(id) {
    // Filter out the todo from array on basis of id.
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  toggleTodo(id) {
    // Map through all todos and change the boolean complete of given todo id.
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());
