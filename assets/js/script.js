var taskIdCounter = 0;
var pageContentEl = document.querySelector('#page-content');
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector("#task-to-do");

var editTask = function(taskId) {
  // get task element from html based on data-task-id attribute
  var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  
  // get task name and type of current task list item
  var taskName = taskSelected.querySelector('h3.task-name').textContent;
  var taskType = taskSelected.querySelector('span.task-type').textContent;
  
  // set the input and select to the values of the current task being edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  
  // change button text to show we are in edit mode
  document.querySelector("#save-task").textContent = "Save Task";
  // add data-task-id attribute to formEl with value of current taskId we are editing
  formEl.setAttribute("data-task-id", taskId);
}

// edit task completion
var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching list item
  var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  // set the new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  // alert task updated
  alert('Task Updated!');
};

var deleteTask = function(taskId) {
  // get task element from html based on data-task-id attribute
  var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  taskSelected.remove();
}

var taskFormHandler = function(event) {
  event.preventDefault();
  // capture the form values 
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  
  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  // clear the form 
  formEl.reset();

  // check to see if we are in edit mode by checking 
  // if the form has the data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");
  if (isEdit) {
    // if so, get the taskId No. and pass that as well as 
    // the new task and type to completeEditTask()
    var taskId = formEl.getAttribute('data-task-id');
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    // if not, take the task and typ and
    // package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj); 
  }

}
// create the task element that will appear on the page
var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  // add class to list item
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
  // target element from event
  var targetEl = event.target;

  // check to see if edit button is click
  if (targetEl.matches('.edit-btn')) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches('.delete-btn')) {
    // check if delete button ^, if so, delete task based on taskId 
    var taskId = targetEl.getAttribute('data-task-id');
    deleteTask(taskId);
  }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);