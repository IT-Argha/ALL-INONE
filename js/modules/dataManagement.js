import { saveToCSV, loadFromCSV, exportAllData, importData } from '../utils/csvHandler.js';

export function setupDataManagement() {
    const exportBtn = document.getElementById('export-data');
    const importBtn = document.getElementById('import-data');
    const generateReportBtn = document.getElementById('generate-report');

    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', handleImport);
    generateReportBtn.addEventListener('click', generateReport);

    function handleExport() {
        exportAllData();
    }

    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.multiple = true;
        
        input.onchange = async (e) => {
            const files = e.target.files;
            await importData(files);
            window.location.reload();
        };
        
        input.click();
    }

    function generateReport() {
        const finances = loadFromCSV('finance.csv') || [];
        const tasks = loadFromCSV('tasks.csv') || [];
        const goals = loadFromCSV('goals.csv') || [];
        const journal = loadFromCSV('journal.csv') || [];

        const report = generateReportHTML(finances, tasks, goals, journal);
        downloadReport(report);
    }

    function generateReportHTML(finances, tasks, goals, journal) {
        const totalIncome = finances
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const totalExpenses = finances
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

        const completedTasks = tasks.filter(t => t.completed).length;
        const completedGoals = goals.filter(g => g.completed).length;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Life Manager - Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .section { margin-bottom: 30px; }
                    h2 { color: #4A90E2; }
                    .stat { margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>Student Life Manager Report</h1>
                <div class="section">
                    <h2>Financial Summary</h2>
                    <div class="stat">Total Income: ₹${totalIncome.toFixed(2)}</div>
                    <div class="stat">Total Expenses: ₹${totalExpenses.toFixed(2)}</div>
                    <div class="stat">Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}</div>
                </div>
                <div class="section">
                    <h2>Tasks Progress</h2>
                    <div class="stat">Completed Tasks: ${completedTasks}</div>
                    <div class="stat">Total Tasks: ${tasks.length}</div>
                </div>
                <div class="section">
                    <h2>Goals Progress</h2>
                    <div class="stat">Completed Goals: ${completedGoals}</div>
                    <div class="stat">Total Goals: ${goals.length}</div>
                </div>
                <div class="section">
                    <h2>Journal Activity</h2>
                    <div class="stat">Total Entries: ${journal.length}</div>
                </div>
            </body>
            </html>
        `;
    }

    function downloadReport(html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-life-report-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
}