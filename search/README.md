# Search Directory

This directory contains search functionality and database reports for the cemetery.

## Search Pages

- **BurialsByName.html** - List of burials sorted alphabetically by name
- **BurialsByLocation.html** - List of burials sorted by location (section, lot, space)
- **OwnedLotsByName.html** - List of lot owners sorted by name
- **OwnedLotsByLocation.html** - List of lot owners sorted by location
- **OwnedLotsByNameWithNotes.html** - Lot owners by name with notes
- **OwnedLotsByLocationWithNotes.html** - Lot owners by location with notes
- **VeteransByNameTable.html** - Veterans list sorted by name
- **FlagsAndCrosses.html** - Veteran flags and crosses information
- **QuickStartGuide.html** - Quick start guide for using search features

## How It Works

All search pages use client-side SQLite database queries:

1. Load SQL.js library from CDN
2. Fetch `CurrentDB/cemetery.db` via HTTP
3. Load database into browser memory
4. Execute SQL queries to get data
5. Render results in searchable/filterable tables

## Database Requirements

- Requires `CurrentDB/cemetery.db` to be present
- Database is loaded entirely into browser memory
- Initial load time depends on database size and network speed
- Once loaded, queries are very fast

## Browser Requirements

- Modern browser with JavaScript enabled
- Support for Fetch API and WebAssembly (for SQL.js)
- Sufficient memory to load the database (typically <50MB)
