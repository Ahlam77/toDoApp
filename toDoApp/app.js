import { renderTask, renderFooter } from "./library/index.js";

let tasks = [];
let filter = "all";

export const TaskStatus = {
  TODO: "todo",
  COMPLETED: "completed",
};

const $form = document.getElementById("form");
const $input = document.getElementById("task");
const $taskList = document.getElementById("task-list");

$form.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = $input.value;

  if (!task) {
    alert("Per favore, inserisci un task prima di aggiungerlo");
    return null;
  }

  filter = "all";
  tasks = createTask(tasks, task);
  renderTasks(tasks);
  renderCounter(tasks);

  $input.value = "";
});

function renderTasks(taskList = []) {
  $taskList.innerHTML = "";

  taskList.forEach((task) => {
    const $task = renderTask(task);
    $taskList.insertAdjacentHTML("beforeend", $task);
  });

  if (!tasks?.length && !taskList.length) return;

  const $footer = renderFooter(taskList, filter);
  $taskList.insertAdjacentHTML("beforeend", $footer);

  const $filters = document.querySelector(".filters");
  const $all = $filters.querySelector(".all");
  const $completed = $filters.querySelector(".completed");
  const $uncompleted = $filters.querySelector(".uncompleted");
  const $clear = document.querySelector(".clear");

  $all.addEventListener("click", () => {
    filter = "all";
    renderTasks(tasks);
    renderCounter(tasks);
  });

  $completed.addEventListener("click", () => {
    filter = "completed";
    const completedTasks = getCompletedTasks(tasks);
    renderTasks(completedTasks);
    renderCounter(tasks);
  });

  $uncompleted.addEventListener("click", () => {
    filter = "todo";
    const uncompletedTasks = getUncompletedTasks(tasks);
    renderTasks(uncompletedTasks);
    renderCounter(tasks);
  });

  $clear.addEventListener("click", () => {
    tasks = clearTasks(tasks);
    renderTasks(tasks);
    renderCounter(tasks);
  });

  watchTasks();
}

function watchTasks() {
  const $tasks = document.querySelectorAll(".task");

  $tasks.forEach(($task) => {
    const id = $task.getAttribute("id");
    const $taskToggle = $task.querySelector(".toggle");
    const $deleteTask = $task.querySelector(".delete-task");

    $taskToggle.addEventListener("click", () => {
      tasks = toggleTaskStatus(tasks, id);
      renderTasks(tasks);
      renderCounter(tasks);
    });

    $deleteTask.addEventListener("click", () => {
      tasks = deleteTask(tasks, id);
      renderTasks(tasks);
      renderCounter(tasks);
    });
  });
}

// Item Actions
function createTask(tasks, title) {
  const nuovoTask = {
    id: Date.now(),
    title,
    status: TaskStatus.TODO,
  };
  tasks.unshift(nuovoTask);
  return tasks;
}

function toggleTaskStatus(tasks, id) {
  const trovaTask = findTask(tasks, id);
  const isCompleted = trovaTask.status === TaskStatus.COMPLETED;
  trovaTask.status = isCompleted ? TaskStatus.TODO : TaskStatus.COMPLETED;
  return tasks;
}

function findTask(tasks, id) {
  return tasks.find((task) => task.id === Number(id));
}

function getCompletedTasks(tasks) {
  return tasks.filter((task) => task.status !== TaskStatus.TODO);
}

function getUncompletedTasks(tasks) {
  return tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
}

function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== Number(id));
}

function clearTasks(tasks) {}

// Render counter
function renderCounter(tasks) {
  const $count = document.createElement("div");
  $count.classList.add("count");
  $count.innerHTML = `${tasks.length} TOTAL TASKS`;
  $taskList.append($count);
  $count.style.color = "black";
  $count.style.fontStyle = "50px";
  $count.style.textAlign = "center";
  $count.style.fontWeight = "900";
  $count.style.padding = "10px";
  $count.style.border = " 2px solid black";
  $count.style.borderRadius = "50px";
  $count.style.margin = "10px";
  $count.style.background = "white";
  $count.style.width = "70%";
}
