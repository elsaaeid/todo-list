document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('searchInput').addEventListener('input', searchTasks);
document.getElementById('filterTasks').addEventListener('change', filterTasks);
document.getElementById('clearTasksBtn').addEventListener('click', clearAllTasks);



let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskIndex = -1;

function loadTasks() {
    document.getElementById('taskList').innerHTML = ''; // Clear the list before loading
    tasks.forEach((task, index) => {
        createTaskElement(task.text, index, task.completed);
    });

    // Show or hide the searchInput and filterTasks based on whether there are any tasks
    const hasTasks = tasks.length > 0;
    document.getElementById('searchInput').style.display = hasTasks ? 'inline-block' : 'none';
    document.getElementById('filterTasks').style.display = hasTasks ? 'inline-block' : 'none';
    document.getElementById('clearTasksBtn').style.display = hasTasks ? 'inline-block' : 'none';
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    if (editingTaskIndex >= 0) {
        updateTask(taskText);
    } else {
        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        createTaskElement(taskText, tasks.length - 1, false);
        saveTasksToLocalStorage();
    }

    taskInput.value = '';
    editingTaskIndex = -1; // Reset editing index

    // Show the searchInput and filterTasks after adding a new task
    document.getElementById('searchInput').style.display = 'inline-block';
    document.getElementById('filterTasks').style.display = 'inline-block';
    document.getElementById('clearTasksBtn').style.display = 'inline-block';
}

function createTaskElement(taskText, index, completed) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (completed) {
        li.classList.add('completed');
    }

    // Create edit button element
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => editTask(index, taskText);

    // Create delete button element
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
        li.remove();
        removeTaskFromLocalStorage(index);
    };
    // Create complete/incomplete button element
    const completeBtn = document.createElement("button");
    completeBtn.textContent = completed ? "Incomplete" : "Complete";
    completeBtn.className = "complete-btn";
    completeBtn.onclick = () => {
        li.classList.toggle("completed");
        tasks[index].completed = !tasks[index].completed;
        saveTasksToLocalStorage(); // Save the updated tasks to localStorage
        completeBtn.textContent = tasks[index].completed ? "inComplete" : "complete";
    };


    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(completeBtn);
    document.getElementById('taskList').appendChild(li);
}

function editTask(index, taskText) {
    document.getElementById('taskInput').value = taskText;
    editingTaskIndex = index; // Set the index of the task being edited
}

function updateTask(taskText) {
    tasks[editingTaskIndex].text = taskText; // Update the task text
    saveTasksToLocalStorage();
    loadTasks(); // Reload tasks to reflect changes
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// removeTaskFromLocalStorage
function removeTaskFromLocalStorage(index) {
    tasks.splice(index, 1);
    saveTasksToLocalStorage();
    loadTasks(); // Reload tasks to reflect changes
}
function clearAllTasks() {
    tasks = []; // Clear the tasks array
    localStorage.removeItem('tasks'); // Remove from local storage
    loadTasks(); // Reload tasks to reflect changes
}
function filterTasks() {
    const filterValue = document.getElementById('filterTasks').value;
    const filteredTasks = tasks.filter(task => {
        if (filterValue === 'completed') {
            return task.completed;
        } else if (filterValue === 'active') {
            return !task.completed;
        }
        return true; // Show all tasks
    });

    document.getElementById('taskList').innerHTML = ''; // Clear the list before loading filtered tasks
    filteredTasks.forEach((task, index) => {
        createTaskElement(task.text, index, task.completed);
    });
}
function searchTasks() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchText));

    document.getElementById('taskList').innerHTML = ''; // Clear the list before loading searched tasks
    filteredTasks.forEach((task, index) => {
        createTaskElement(task.text, index, task.completed);
    });
}
