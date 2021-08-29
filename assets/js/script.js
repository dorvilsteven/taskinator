var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector("#task-to-do");

var createTaskHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // create container to hold list item and task info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  
  // add html content to container
  taskInfoEl.innerHTML = `<h3 class='task-name'>${taskNameInput}</h3>
                          <span class='task-type'>${taskTypeInput}</span>`;
  // append container to the li
  listItemEl.appendChild(taskInfoEl);
  // append entire li to the task list(ul)
  tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", createTaskHandler);