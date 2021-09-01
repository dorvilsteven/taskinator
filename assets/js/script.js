var taskIdCounter = 0;
var pageContentEl = document.querySelector('#page-content');
var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector("#task-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];

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

  // loop through the tasks array to find which object to update with new content
  for (var i=0;i<tasks.length;i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  // alert task updated
  alert('Task Updated!');
  // remove data-task-id attribute and change back the text for the form submit button
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function(taskId) {
  // get task element from html based on data-task-id attribute
  var taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  taskSelected.remove();

  // create new array to hold updated list of task objects
  var updatedTaskArray = [];

  // loop through current task
  for (var i=0;i<tasks.length;i++) {
    // if the current task id doesnt match the value 
    // of the task id in the array then keep that task
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArray.push(tasks[i]);
    }
  }

  // reassign tasks array to the updatedTaskArray
  tasks = updatedTaskArray;
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
      type: taskTypeInput,
      status: 'to do'
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
  
  // add task id property to current data object
  taskDataObj.id = taskIdCounter;
  // push current task onto the tasks array
  tasks.push(taskDataObj);

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

var taskStatusChangeHandler = function(event) {
  // get the task items id
  var taskId = event.target.getAttribute('data-task-id');
  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();
  // find the parent task item element based on the id
  var taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

  // move the list item to a different list based on the status value
  if (statusValue === 'to do') {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === 'in progress') {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === 'completed') {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's status in tasks array
  for (var i=0;i<tasks.length;i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);