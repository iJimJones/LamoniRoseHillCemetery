# Scripts Directory

This directory contains utility scripts for maintaining and updating the cemetery website.

## Python Scripts

### Database Migration
- **migrate-access-to-sqlite.py** - Converts Access databases (.accdb) to SQLite format
- **migrate-excel-to-sqlite.py** - Converts Excel files to SQLite format

### Content Management
- **update-html-from-text.py** - Updates HTML files from editable text files
- **extract-content-to-text.py** - Extracts content from HTML to text format
- **convert-policy-pdfs-to-html.py** - Converts PDF policy documents to HTML

## Node.js Scripts

- **migrate-access-to-sqlite.js** - Node.js wrapper for database migration

## Shell Scripts

- **update-html.bat** - Windows batch script to update HTML from text
- **update-html.sh** - Unix/Linux shell script to update HTML from text

## Usage

### Database Migration
```bash
npm run migrate
# or
python scripts/migrate-access-to-sqlite.py
```

### Content Updates
```bash
# Windows
scripts\update-html.bat

# Mac/Linux
bash scripts/update-html.sh

# Or directly
python scripts/update-html-from-text.py
```

## Requirements

See `requirements.txt` for Python dependencies:
- pyodbc (for Access database access)
- openpyxl (for Excel file handling)
- pdf2image, pytesseract, Pillow (for PDF conversion)

## Prerequisites

- Python 3
- Microsoft Access Database Engine (for Access database migration)
- Node.js (optional, for npm scripts)
