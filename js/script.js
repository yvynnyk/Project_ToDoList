"use strict";

const todoForm = document.querySelector(".todo__form");
const todoDesc = todoForm.querySelector(".todo__description");
const todoTime = todoForm.querySelector(".todo__duedate");
const todoWrapper = document.querySelector(".todo__wrapper");

let filterId = 0; 
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
    addClickToTaskItem ();
}

fillToDoList ();

function addClickToTaskItem () {
    const todoTask = document.querySelectorAll(".todo__item");
    
    todoTask.forEach(task => {
        task.addEventListener ("click", (e) => {
            if (e.target.classList.contains("todo__complete")) {
                
                if (!tasksArray[e.target.dataset.complete].completed) {
                    changeCompletedStatus (e.target.dataset.complete);
                }
                else {
                    changeCompletedStatus (e.target.dataset.complete);
                }
            }

            if (e.target.classList.contains("todo__delete")) {
                let i = e.target.dataset.delete;
                
                if (!tasksArray[i].deleted) {
                    tasksArray[i].deleted = !tasksArray[i].deleted;
                    tasksArray[i].active = !tasksArray[i].active;
                    updateLocalStorageAndToDoList ();
                }
            }
        });
    });
    filterTasks (filterId);
}

function changeCompletedStatus (i) {
    tasksArray[i].completed = !tasksArray[i].completed;
    tasksArray[i].active = !tasksArray[i].active;
    updateLocalStorageAndToDoList ();
}

function updateLocalStorageAndToDoList () {
    updateLocalStorage();
    fillToDoList ();
}


function updateLocalStorage () {
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

class newToDoTask {
    constructor(desc, deadline, active, completed, deleted){
        this.desc = desc;
        this.deadline = deadline;
        this.active = active;
        this.completed = completed;
        this.deleted = deleted;
    }
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    tasksArray.push(new newToDoTask (todoDesc.value, todoTime.value, true ,false, false));
    updateLocalStorage ();
    fillToDoList ();
    todoForm.reset();
});

function createTask (task, index) {
    return `
    <div class="todo__item 
    ${task.active ? "active" : ''}
    ${task.completed ? "checked" : ''} 
    ${task.deleted ? "deleted" : ''}" 
    data-task="${index}">    
        <div class="todo__general">
                <div class="todo__text">${task.desc}</div>
            <div class="todo__options">
                <div class="todo__deadline">${task.deadline ? task.deadline : ""}</div>
                <div class="todo__show"><img src="img/nav/down-arrow.png" alt="down_arrow"></div>
                <input type="checkbox" class="todo__complete" data-complete="${index}" ${task.completed ? "checked": ""}>
                <div class="todo__delete" data-delete="${index}">&#10060</div>
            </div>
        </div>
        <div class="todo__additional">

        </div>
    </div>
    `;
}

function changeActiveButton () {
    document.querySelectorAll(".filter div").forEach(btn => {
        btn.classList.add("non-active-button");
        btn.classList.remove("active-button");
    });
    document.querySelectorAll(".filter div")[filterId].classList.add("active-button");
}

changeActiveButton ();


document.querySelector(".filter").addEventListener("click", (e) => {
    
    if (e.target.classList.contains("act")) {
        filterId = 0;
    }
    else if (e.target.classList.contains("del")) {
        filterId = 1;
    }
    else if (e.target.classList.contains("com")) {
        filterId = 2;
    }
    else if (e.target.classList.contains("all")) {
        filterId = 3;
    }

    changeActiveButton (filterId);
    filterTasks (filterId);
});

function filterTasks(id) {
    const tasksList = document.querySelectorAll(".todo__item");
    
    hideFilteredTasks (tasksList);
    
    tasksList.forEach(tasks => {
        
        if (id == 0 && tasks.classList.contains("active") && !tasks.classList.contains("deleted")) {
            showFilteredTask (tasks);            
        }
        else if (id == 1 && tasks.classList.contains("deleted")) {
            showFilteredTask (tasks);
        }
        else if (id == 2 && tasks.classList.contains("checked") && !tasks.classList.contains("deleted")) {
            showFilteredTask (tasks);
        }
        else if (id == 3) {
            showFilteredTask (tasks);
        }

    });
}

function hideFilteredTasks (tasksList) {
    tasksList.forEach(task => {
        task.classList.remove("show");
        task.classList.add("hide");
    });
}

function showFilteredTask (task) {
    task.classList.remove("hide");
    task.classList.add("show");
}


function getDate (currentDate) {
    const date = getFirstZero(currentDate.getDate());
    const year = currentDate.getFullYear();
    const month = getMonthName(currentDate.getMonth());
    const day = getDayName(currentDate.getDay());

    return {year, date, month, day};
}

function getMonthName (monthNumber) {
    const monthList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOW", "DEC"];
    return monthList[monthNumber];
}

function getDayName (dayNumber) {
    const dayList = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
    return dayList[dayNumber];
}

function getTime (currentDate) {
    const hours = getFirstZero(currentDate.getHours());
    const minutes = getFirstZero(currentDate.getMinutes());
    const seconds = getFirstZero(currentDate.getSeconds());
    
    return {hours, minutes, seconds};
}
function setClock () {
    const clock = document.querySelector(".header__clock");
    const d = getDate(new Date());
    const t = getTime(new Date());
    

    clock.innerHTML = `
        ${d.date}-(${d.day})-${d.month}-${d.year}   ${t.hours}:${t.minutes}:${t.seconds}`;
}

function getFirstZero (num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

setClock ();
setInterval(setClock, 1000);


