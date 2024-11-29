export function saveToCSV(filename, data) {
    try {
        localStorage.setItem(filename, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

export function loadFromCSV(filename) {
    try {
        const data = localStorage.getItem(filename);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

export function exportAllData() {
    const files = ['finance.csv', 'tasks.csv', 'goals.csv', 'journal.csv'];
    files.forEach(filename => {
        const data = loadFromCSV(filename);
        if (data) {
            const csv = convertToCSV(data);
            downloadCSV(filename, csv);
        }
    });
}

export async function importData(files) {
    for (const file of files) {
        const text = await file.text();
        const data = parseCSV(text);
        saveToCSV(file.name, data);
    }
}

function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => 
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ];
    
    return csvRows.join('\n');
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = JSON.parse(values[index] || 'null');
            return obj;
        }, {});
    });
}

function downloadCSV(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}