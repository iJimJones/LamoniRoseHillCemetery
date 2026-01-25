/**
 * Node.js wrapper for Access to SQLite migration.
 * This script calls the Python migration script.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PYTHON_SCRIPT = path.join(__dirname, 'migrate-access-to-sqlite.py');
const SQLITE_DB = path.join(__dirname, '..', 'CurrentDB', 'cemetery.db');

console.log('Access to SQLite Migration (Node.js wrapper)');
console.log('='.repeat(60));

// Check if Python script exists
if (!fs.existsSync(PYTHON_SCRIPT)) {
    console.error(`Error: Python script not found at ${PYTHON_SCRIPT}`);
    process.exit(1);
}

// Try to find Python executable
const pythonCommands = ['python3', 'python', 'py'];
let pythonCmd = null;

for (const cmd of pythonCommands) {
    try {
        // Check if command exists (this is a simple check)
        exec(`${cmd} --version`, (error) => {
            if (!error) {
                pythonCmd = cmd;
            }
        });
    } catch (e) {
        // Continue to next command
    }
}

if (!pythonCmd) {
    console.error('Error: Python not found. Please install Python 3.');
    console.error('You can also run the migration directly with:');
    console.error(`  python ${PYTHON_SCRIPT}`);
    process.exit(1);
}

// Run Python script
console.log(`Running: ${pythonCmd} ${PYTHON_SCRIPT}\n`);

exec(`${pythonCmd} "${PYTHON_SCRIPT}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running migration: ${error.message}`);
        console.error(stderr);
        process.exit(1);
    }
    
    console.log(stdout);
    
    // Check if SQLite database was created
    if (fs.existsSync(SQLITE_DB)) {
        const stats = fs.statSync(SQLITE_DB);
        console.log(`\n✓ SQLite database created: ${SQLITE_DB}`);
        console.log(`  Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.error(`\n✗ SQLite database not found at ${SQLITE_DB}`);
        process.exit(1);
    }
});
