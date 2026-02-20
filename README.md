# Lamoni Rose Hill Cemetery

Website for the Lamoni Rose Hill Cemetery, providing information about the cemetery, burial records, policies, and historical information.

## Project Structure

```
.
├── index.html              # Home page
├── rosehill.css            # Main stylesheet
├── js/                     # JavaScript utilities
│   ├── includes.js        # HTML include loader
│   └── cemetery-db.js     # Database query utilities
├── includes/               # Reusable HTML components
│   ├── header.html
│   ├── nav.html
│   └── footer.html
├── policies/               # Policy documents
├── search/                 # Search and database reports
├── history/                # Historical content
├── photos/                 # Photo galleries
├── plat/                   # Cemetery plat maps
├── map/                    # Interactive maps
├── scripts/               # Utility scripts
│   ├── migrate-access-to-sqlite.py  # Database migration
│   └── update-html-from-text.py     # Content update tool
├── CurrentDB/              # Database files
│   ├── cemetery.db        # SQLite database (generated)
│   └── *.accdb            # Source Access databases
└── editable-content/       # Editable text versions of HTML pages
```

## Features

- **Static Website**: No server required - all pages are static HTML
- **Client-Side Database**: SQLite database queried in browser using SQL.js
- **Search Functionality**: Search burials, lot owners, and veterans
- **Policy Documents**: Comprehensive cemetery policies and rules
- **Historical Content**: Cemetery history, pioneers, and timeline
- **Interactive Maps**: Cemetery plat maps and location tools

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for running utility scripts)
- Node.js (optional, for npm scripts)

### Running Locally

1. Clone or download this repository
2. Open `index.html` in a web browser
3. For search functionality, ensure `CurrentDB/cemetery.db` exists

### Updating Content

1. Edit text files in `editable-content/` directory
2. Run: `python scripts/update-html-from-text.py`
3. HTML files will be automatically updated

### Database Migration

See [README-DATABASE.md](README-DATABASE.md) for detailed instructions on migrating Access databases to SQLite.

## Development

### Code Style

- **Indentation**: 4 spaces (no tabs)
- **Line Endings**: LF (Unix-style)
- **Trailing Newlines**: All files should end with a newline
- See `.editorconfig` for editor-specific settings

### File Organization

- HTML files in root for main pages
- Reusable components in `includes/`
- Policy documents in `policies/`
- Search/report pages in `search/`
- Historical content in `history/`

## Documentation

- [README-DATABASE.md](README-DATABASE.md) - Database migration and usage
- [editable-content/README.txt](editable-content/README.txt) - Content editing guide
- Directory-specific README files in key folders

## Contact

- Email: LamoniRoseHill@gmail.com
- Office: 531 W Main St, Lamoni, IA 50140
- Map Location: 1100 W Main St, Lamoni, IA

## License

Copyright &copy; 2025 Lamoni Rose Hill Cemetery