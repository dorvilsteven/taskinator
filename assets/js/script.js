var taskIdCounter = 0;
var pageContentEl = document.querySelector('#page-content');
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector("#task-to-do");

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  taskSelected.remove();
}

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  
  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  formEl.reset();
  // package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  // send it as an argument to createTaskEl
  createTaskEl(taskDataObj);

}

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create container to hold list item and task info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  
  // add html content to container
  taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3>
                          <span class='task-type'>${taskDataObj.type}</span>`;
  
  // append container to the li
  listItemEl.appendChild(taskInfoEl);
  
  // add task actions to the task 
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // append entire li to the task list(ul)
  tasksToDoEl.appendChild(listItemEl);
  
  // increment taskIdCounter
  taskIdCounter++;
}

var createTaskActions = function(taskId) {
  // create action button container div
  var actionContainerEl = document.createElement('div');
  actionContainerEl.className = 'task-actions';

  // create edit button
  var editButtonEl = document.createElement('button');
  editButtonEl.textContent = 'Edit';
  editButtonEl.className = 'btn edit-btn';
  editButtonEl.setAttribute("data-task-id", taskId);

  // append edit button to to container
  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement('button');
  deleteButtonEl.textContent = 'Delete';
  deleteButtonEl.className = 'btn delete-btn';
  deleteButtonEl.setAttribute('data-task-id', taskId);

  // append delete button to container
  actionContainerEl.appendChild(deleteButtonEl);

  // create dropdown menu
  var statusSelectEl = document.createElement('select');
  statusSelectEl.className = 'select-status';
  statusSelectEl.setAttribute('name', 'status-change');
  statusSelectEl.setAttribute('data-task-id', taskId);

  // append dropdown menu to container
  actionContainerEl.appendChild(statusSelectEl);

  // choices for the dropdown menu
  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i=0;i<statusChoices.length;i++) {
    // create option element
    var statusOptionEl = document.createElement('option');
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute('value', statusChoices[i])

    // append option to dropdown select menu
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
}

var taskButtonHandler = function(event) {
  // check if delete button, if so, delete task based on taskId
  if (event.target.matches('.delete-btn')) {
    var taskId = event.target.getAttribute('data-task-id');
    deleteTask(taskId);
  }
  if (event.target.matches('.edit-btn')) {
    console.log('you clicked edit');
  }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);