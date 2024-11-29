import { initializeFinance } from './modules/finance.js';
import { initializeTasks } from './modules/tasks.js';
import { initializeGoals } from './modules/goals.js';
import { initializeJournal } from './modules/journal.js';
import { setupNavigation } from './modules/navigation.js';
import { setupDataManagement } from './modules/dataManagement.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    initializeFinance();
    initializeTasks();
    initializeGoals();
    initializeJournal();
    setupDataManagement();
});