import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

const JOURNAL_CSV = 'journal.csv';

export function initializeJournal() {
    const journalEntries = document.getElementById('journal-entries');
    const saveEntryBtn = document.getElementById('save-entry');
    
    let entries = loadFromCSV(JOURNAL_CSV) || [];
    renderEntries();

    saveEntryBtn.addEventListener('click', saveEntry);

    function saveEntry() {
        const entryDate = document.getElementById('entry-date');
        const entryText = document.getElementById('journal-entry');

        if (!entryText.value || !entryDate.value) return;

        const entry = {
            id: Date.now(),
            date: entryDate.value,
            content: entryText.value,
            createdAt: new Date().toISOString()
        };

        entries.push(entry);
        saveToCSV(JOURNAL_CSV, entries);
        renderEntries();
        clearForm();
    }

    function renderEntries() {
        journalEntries.innerHTML = entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(entry => `
                <div class="journal-item">
                    <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                    <div class="entry-content">${entry.content}</div>
                </div>
            `)
            .join('');
    }

    function clearForm() {
        document.getElementById('entry-date').value = '';
        document.getElementById('journal-entry').value = '';
    }
}