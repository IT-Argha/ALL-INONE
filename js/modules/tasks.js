import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

const TASKS_CSV = 'tasks.csv';

export function initializeTasks() {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task');
    
    let tasks = loadFromCSV(TASKS_CSV) || [];
    renderTasks();

    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskInput = document.getElementById('task-input');
        const dueDate = document.getElementById('task-due-date');
        const priority = document.getElementById('task-priority');

        if (!taskInput.value) return;

        const task = {
            id: Date.now(),
            text: taskInput.value,
            dueDate: dueDate.value,
            priority: priority.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(task);
        saveToCSV(TASKS_CSV, tasks);
        renderTasks();
        taskInput.value = '';
        dueDate.value = '';
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveToCSV(TASKS_CSV, tasks);
            renderTasks();
        }
    }

    function renderTasks() {
        taskList.innerHTML = tasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-priority="${task.priority}">
                    <input type="checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id})">
                    <span class="task-text">${task.text}</span>
                    <span class="task-due-date">${task.dueDate}</span>
                    <span class="task-priority">${task.priority}</span>
                </div>
            `)
            .join('');
    }

    // Expose toggleTask to window for checkbox onclick
    window.toggleTask = toggleTask;
}