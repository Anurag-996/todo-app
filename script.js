document.addEventListener("DOMContentLoaded", function () {
    const addTodo = document.getElementById("add-btn");
    addTodo.addEventListener("click", addTask);

    const priorityFilter = document.getElementById("priorityFilter");
    priorityFilter.addEventListener("change", filterTasksByPriority);

    let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Load tasks from localStorage on page load
    allTasks.forEach(taskData => {
        const tasksContainer = document.getElementById("tasksContainerToDo");
        const taskItem = createTaskElement(taskData);
        tasksContainer.appendChild(taskItem);
    });

    function addTask() {
        const taskInput = document.getElementById("taskInput");
        const taskName = taskInput.value.trim();
        const taskDateInput = document.getElementById("taskDate");
        const taskDate = taskDateInput.value || getCurrentDate(); // Use current date if not provided
        const prioritySelect = document.getElementById("prioritySelect");
        const priority = prioritySelect.value;
    
        if (taskName !== "") {
            const tasksContainer = document.getElementById("tasksContainerToDo");
    
            const taskData = {
                name: taskName,
                date: taskDate,
                priority: priority
            };
    
            const taskItem = createTaskElement(taskData);
    
            tasksContainer.appendChild(taskItem);
            taskInput.value = "";
            taskDateInput.value = ""; // Reset date input
    
            allTasks.push(taskData);
    
            localStorage.setItem("tasks", JSON.stringify(allTasks));
    
            updateTaskCounts();
        }
    }
    
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    
    function createTaskElement(taskData) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("item");
    
        if (taskData.priority) {
            taskItem.classList.add(taskData.priority.toLowerCase());
        }
    
        const completeCheckbox = document.createElement("input");
        completeCheckbox.type = "checkbox";
        completeCheckbox.addEventListener("change", function () {
            updateTaskLists(taskItem, completeCheckbox.checked);
        });
        taskItem.appendChild(completeCheckbox);
    
        const taskText = document.createElement("div");
        taskText.textContent = `${taskData.name} - Due Date: ${taskData.date}`;
        taskItem.appendChild(taskText);
    
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            const updatedTaskName = prompt("Enter updated task name:", taskData.name);
            if (updatedTaskName !== null) {
                taskText.textContent = `${updatedTaskName} - Due Date: ${taskData.date}`;
                taskData.name = updatedTaskName;
                updateTaskCounts();
            }
        };
        taskItem.appendChild(editButton);
    
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            const index = Array.from(taskItem.parentNode.children).indexOf(taskItem);
            if (index !== -1) {
                allTasks.splice(index, 1);
            }
            taskItem.remove();
            updateTaskCounts();
        };
        
        
        taskItem.appendChild(deleteButton);
    
        appendPriorityLabel(taskItem);
    
        return taskItem;
    }
    
    function appendPriorityLabel(task) {
        const priorityLabel = document.createElement("div");
        const priorityLevel = task.classList[1];

        switch (priorityLevel) {
            case "high":
                priorityLabel.style.color = "red";
                break;
            case "medium":
                priorityLabel.style.color = "yellow";
                break;
            case "low":
                priorityLabel.style.color = "green";
                break;
            default:
                break;
        }

        priorityLabel.textContent = `Priority: ${priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}`;
        task.appendChild(priorityLabel);
    }

    function updateTaskLists(task, isChecked) {
        const tasksContainerInProgress = document.getElementById("tasksContainerInProgress");
        const tasksContainerDone = document.getElementById("tasksContainerDone");
    
        if (isChecked) {
            tasksContainerDone.appendChild(task);
        } else {
            tasksContainerInProgress.appendChild(task);
        }
    
        updateTaskCounts();
    
        // Update the completed status in allTasks array based on checkbox state
        const index = Array.from(task.parentNode.children).indexOf(task);
        if (index !== -1) {
            allTasks[index].completed = isChecked;
            localStorage.setItem("tasks", JSON.stringify(allTasks));
        }
    }
    

    function updateTaskCounts() {
        updateSectionTaskCount("tasksContainerToDo", "totalTasksToDo");
        updateSectionTaskCount("tasksContainerInProgress", "totalTasksInProgress");
        updateSectionTaskCount("tasksContainerDone", "totalTaskCount");
        updateDoneTaskCount();
    }

    function updateSectionTaskCount(containerId, totalId) {
        const totalTasks = document.getElementById(totalId);
    
        if (totalTasks) {
            const totalTaskCount = document.querySelectorAll(`#${containerId} .item`).length;
            totalTasks.textContent = totalTaskCount;
        }
    }

    function updateDoneTaskCount() {
        const totalDoneTasks = document.getElementById("totalTasksDone");

        if (totalDoneTasks) {
            const doneTaskCount = document.querySelectorAll("#tasksContainerDone .item").length;
            totalDoneTasks.textContent = doneTaskCount;
        }
    }

    

    function filterTasksByPriority() {
        const selectedPriority = priorityFilter.value;
        const tasksContainerToDo = document.getElementById("tasksContainerToDo");

        tasksContainerToDo.innerHTML = "";

        allTasks.forEach(taskData => {
            const taskItem = createTaskElement(taskData);
            const taskPriority = taskItem.classList[1];
            if (selectedPriority === "All" || taskPriority === selectedPriority.toLowerCase()) {
                tasksContainerToDo.appendChild(taskItem);
            }
        });

        updateTaskCounts();
    }
});
