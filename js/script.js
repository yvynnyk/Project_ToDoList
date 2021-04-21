"use strict";

const todoForm = document.querySelector(".todo__form");
const todoDesc = todoForm.querySelector(".todo__description");
const todoWrapper = document.querySelector(".todo__wrapper");

let filterIndicator = 3; 
let tasksArray;

if (localStorage.tasks) {
    tasksArray = JSON.parse(localStorage.getItem("tasks"));
}
else {
    tasksArray = [];
}

function fillToDoList () {
    todoWrapper.innerHTML = "";
    if (tasksArray.length != 0 ) {
        tasksArray.forEach((task, index) => {
             todoWrapper.innerHTML += createTask (task, index);
        });
    }
    addClick ();
}

function addClick () {
    const todoTask = document.querySelectorAll(".todo__item");
    
    todoTask.forEach(task => {
        task.addEventListener ("click", (e) => {
            if (e.target.classList.contains("todo__complete")) {
                let i = e.target.dataset.complete;  
                
                if (!tasksArray[i].completed) {
                    tasksArray[i].completed = true;
                    tasksArray[i].active = false;
                    updateLocalStorage();
                    fillToDoList ();
                }
                else {
                    tasksArray[i].completed = false;
                    tasksArray[i].active = true;
                    updateLocalStorage();
                    fillToDoList ();
                }
            }

            if (e.target.classList.contains("todo__delete")) {
                let i = e.target.dataset.delete;
                
                if (!tasksArray[i].deleted) {
                    tasksArray[i].deleted = true;
                    tasksArray[i].active = false;
                    task.style.backgroundColor = "orange";
                    updateLocalStorage();
                    fillToDoList ();
                }
            }
        });
    });
    filterTasks (filterIndicator);
}

fillToDoList ();

function updateLocalStorage () {
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

class newToDoTask {
    constructor(desc, active, completed, deleted){
        this.desc = desc;
        this.active = active;
        this.completed = completed;
        this.deleted = deleted;
    }
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    tasksArray.push(new newToDoTask (todoDesc.value, true ,false, false));
    updateLocalStorage ();
    fillToDoList ();
    todoForm.reset();
});

function createTask (task, index) {
    return `
    <div class="todo__item 
    ${task.active ? "active" : ''}
    ${task.completed ? "checked" : ''} 
    ${task.deleted ? "deleted show" : ''}" 
    data-task="${index}">    
        <div class="todo__general">
            <div class="todo__text">${task.desc}</div>
            <div class="todo__deadline">Date</div>
            <div class="todo__show"><img src="img/nav/down-arrow.png" alt="down_arrow"></div>
            <input type="checkbox" class="todo__complete" data-complete="${index}" ${task.completed ? "checked": ""}>
            <div class="todo__delete" data-delete="${index}">&#10060</div>
        </div>
        <div class="todo__additional">

        </div>
    </div>
    `;
}

const filterTaskBtn = document.querySelector(".filter");
filterTaskBtn.addEventListener("click", (e) => {
    const taskList = document.querySelectorAll(".todo__item");
    if (e.target.classList.contains("act")) {
        filterIndicator = 0;
    }
    else if (e.target.classList.contains("del")) {
        filterIndicator = 1;
    }
    else if (e.target.classList.contains("com")) {
        filterIndicator = 2;
    }
    else if (e.target.classList.contains("all")) {
        filterIndicator = 3;
    }
    filterTasks (filterIndicator);
});

function filterTasks(i) {
    const tasksList = document.querySelectorAll(".todo__item");
    
    tasksList.forEach(task => {
        task.classList.remove("show");
        task.classList.add("hide");
    });
    
    tasksList.forEach(task => {
        
        if (i == 0 && task.classList.contains("active")) {
            task.classList.remove("hide");
            task.classList.add("show");
        }
        else if (i == 1 && task.classList.contains("deleted")) {
            task.classList.remove("hide");
            task.classList.add("show");
        }
        else if (i == 2 && task.classList.contains("checked")) {
            task.classList.remove("hide");
            task.classList.add("show");
        }
        else if (i == 3) {
            task.classList.remove("hide");
            task.classList.add("show");
        }

    });
}
