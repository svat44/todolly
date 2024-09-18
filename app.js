// Select DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Initialize score and create a score display
let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'scoreDisp';
document.body.prepend(scoreDisplay);

// Load tasks and score from localStorage when the page loads
window.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener for adding a new task
addTaskBtn.addEventListener('click', addTask);

// Function to load tasks and score from localStorage
function loadTasks() {
    // Retrieve tasks and score from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

    // Update the score display
    scoreDisplay.innerHTML = `Score: ${score}`;

    // Load and display the tasks
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

// Function to create and add a new task element
function createTaskElement(taskText, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `${taskText} <button class="deleteBtn">X</button>`;

    // Mark task as completed
    if (completed) {
        li.classList.add('completed');
    }

    // Add event listener to mark task as complete and update score
    li.addEventListener('click', function () {
        if (!li.classList.contains('completed')) {
            li.classList.toggle('completed');
            score += 10;  // Earn 10 points for completing a task
            scoreDisplay.innerHTML = `Score: ${score}`;
        }
        saveTasks(); // Save task and score
    });

    // Add event listener for deleting the task
    li.querySelector('.deleteBtn').addEventListener('click', function () {
        li.remove();
        saveTasks(); // Save tasks after deleting
    });

    taskList.appendChild(li);
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value;

    if (taskText !== '') {
        createTaskElement(taskText);  // Create the new task
        saveTasks();  // Save the new task list
        taskInput.value = '';  // Clear the input field
    }
}

// Function to save tasks and score to localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.firstChild.textContent.trim(),
            completed: li.classList.contains('completed')
        });
    });
    // Save tasks and score to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('score', score);
}