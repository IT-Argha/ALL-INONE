import { saveToCSV, loadFromCSV } from '../utils/csvHandler.js';

const FINANCE_CSV = 'finance.csv';

export function initializeFinance() {
    const balanceElement = document.getElementById('current-balance');
    const addTransactionBtn = document.getElementById('add-transaction');
    const transactionsList = document.getElementById('transactions');
    
    let transactions = loadFromCSV(FINANCE_CSV) || [];
    updateBalance();
    renderTransactions();

    addTransactionBtn.addEventListener('click', addTransaction);

    function addTransaction() {
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const type = document.getElementById('type').value;

        if (!amount || !description) return;

        const transaction = {
            date: new Date().toISOString(),
            amount: type === 'expense' ? -amount : +amount,
            description,
            type
        };

        transactions.push(transaction);
        saveToCSV(FINANCE_CSV, transactions);
        updateBalance();
        renderTransactions();
        clearForm();
    }

    function updateBalance() {
        const balance = transactions.reduce((sum, trans) => sum + Number(trans.amount), 0);
        balanceElement.textContent = `₹${balance.toFixed(2)}`;
    }

    function renderTransactions() {
        transactionsList.innerHTML = transactions
            .slice()
            .reverse()
            .slice(0, 10)
            .map(trans => `
                <div class="transaction-item ${trans.amount < 0 ? 'expense' : 'income'}">
                    <div class="transaction-info">
                        <span class="description">${trans.description}</span>
                        <span class="amount">₹${Math.abs(trans.amount).toFixed(2)}</span>
                    </div>
                    <div class="transaction-date">
                        ${new Date(trans.date).toLocaleDateString()}
                    </div>
                </div>
            `)
            .join('');
    }

    function clearForm() {
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
    }
}