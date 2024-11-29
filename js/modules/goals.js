import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

const GOALS_CSV = 'goals.csv';

export function initializeGoals() {
    const goalsList = document.getElementById('goals-list');
    const addGoalBtn = document.getElementById('add-goal');
    
    let goals = loadFromCSV(GOALS_CSV) || [];
    renderGoals();

    addGoalBtn.addEventListener('click', addGoal);

    function addGoal() {
        const titleInput = document.getElementById('goal-title');
        const descriptionInput = document.getElementById('goal-description');
        const targetDateInput = document.getElementById('goal-target-date');

        if (!titleInput.value || !descriptionInput.value) return;

        const goal = {
            id: Date.now(),
            title: titleInput.value,
            description: descriptionInput.value,
            targetDate: targetDateInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        goals.push(goal);
        saveToCSV(GOALS_CSV, goals);
        renderGoals();
        clearForm();
    }

    function toggleGoal(id) {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            goal.completed = !goal.completed;
            saveToCSV(GOALS_CSV, goals);
            renderGoals();
        }
    }

    function renderGoals() {
        goalsList.innerHTML = goals
            .map(goal => `
                <div class="goal-item ${goal.completed ? 'completed' : ''}">
                    <h3>${goal.title}</h3>
                    <p>${goal.description}</p>
                    <div class="goal-meta">
                        <span>Target: ${goal.targetDate}</span>
                        <button onclick="toggleGoal(${goal.id})">
                            ${goal.completed ? 'Completed' : 'Mark Complete'}
                        </button>
                    </div>
                </div>
            `)
            .join('');
    }

    function clearForm() {
        document.getElementById('goal-title').value = '';
        document.getElementById('goal-description').value = '';
        document.getElementById('goal-target-date').value = '';
    }

    // Expose toggleGoal to window for button onclick
    window.toggleGoal = toggleGoal;
}