// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const categoryInput = document.getElementById('categoryInput'); // Declare once

// Initialize score and create a score display
let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'scoreDisp';
document.body.prepend(scoreDisplay);

// Load tasks and score from localStorage when the page loads
window.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener for adding a new task
addTaskBtn.addEventListener('click', addTask);

// Modify loadTasks to distribute tasks into the correct columns
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

    scoreDisplay.innerHTML = `Score: ${score}`;

    // Clear existing lists before loading new ones
    document.getElementById('personalTasks').innerHTML = '';
    document.getElementById('workTasks').innerHTML = '';
    document.getElementById('urgentTasks').innerHTML = '';

    // Iterate through saved tasks and recreate them in the correct category
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.category, task.completed);
    });
}


// Adjust createTaskElement to add tasks to the correct column
function createTaskElement(taskText, category = 'Personal', completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `${taskText} <button class="deleteBtn">X</button>`;
    if (completed) li.classList.add('completed');

    // Add task to the appropriate list based on category
    const list = category === 'Urgent' ? document.getElementById('urgentTasks') :
                 category === 'Work' ? document.getElementById('workTasks') :
                 document.getElementById('personalTasks');

    list.appendChild(li);

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    li.querySelector('.deleteBtn').addEventListener('click', function (event) {
        event.stopPropagation();
        li.remove();
        saveTasks();
    });
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value;
    const category = categoryInput.value;

    if (taskText !== '') {
        createTaskElement(taskText, category);  // Create the new task
        saveTasks();  // Save the new task list
        taskInput.value = '';  // Clear the input field
    }
}

function saveTasks() {
    const tasks = [];
    const allColumns = [document.getElementById('personalTasks'), document.getElementById('workTasks'), document.getElementById('urgentTasks')];
    
    allColumns.forEach(column => {
        column.querySelectorAll('li').forEach(li => {
            const taskText = li.firstChild.textContent.trim();
            const category = column.id.replace('Tasks', ''); // Extracts 'personal', 'work', 'urgent' from the id
            tasks.push({ text: taskText, category: category, completed: li.classList.contains('completed') });
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('score', score);
}




