/**
 * Client-side SQLite database query utilities for cemetery data.
 * Uses SQL.js to load and query the SQLite database in the browser.
 */

let db = null;
let dbLoaded = false;
let dbLoading = false;

// Query result cache for instant retrieval
const queryCache = {
    burialsByName: null,
    burialsByLocation: null,
    ownedLotsByName: null,
    ownedLotsByLocation: null,
    veteranFlagsCrosses: null,
    metadata: null
};

/**
 * Initialize SQL.js and load the database.
 * @returns {Promise} Promise that resolves when database is loaded
 */
async function loadDatabase() {
    if (dbLoaded && db) {
        return Promise.resolve(db);
    }
    
    if (dbLoading) {
        // Wait for existing load to complete
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (dbLoaded && db) {
                    clearInterval(checkInterval);
                    resolve(db);
                }
            }, 100);
        });
    }
    
    dbLoading = true;
    
    try {
        // Load SQL.js library
        if (typeof initSqlJs === 'undefined') {
            throw new Error('SQL.js library not loaded. Make sure sql-wasm.js is included before this script.');
        }
        
        const SQL = await initSqlJs({
            locateFile: (file) => {
                // Use CDN for SQL.js WASM files
                return `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`;
            }
        });
        
        // Fetch the database file
        const response = await fetch('../CurrentDB/cemetery.db');
        if (!response.ok) {
            throw new Error(`Failed to load database: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Load database into SQL.js
        db = new SQL.Database(uint8Array);
        dbLoaded = true;
        dbLoading = false;
        
        console.log('Database loaded successfully');
        return db;
    } catch (error) {
        dbLoading = false;
        console.error('Error loading database:', error);
        throw error;
    }
}

/**
 * Execute a SQL query and return results.
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Optional parameters for prepared statement
 * @returns {Array} Array of result objects
 */
async function query(sql, params = []) {
    if (!dbLoaded || !db) {
        await loadDatabase();
    }
    
    try {
        if (params.length > 0) {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            const results = [];
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();
            return results;
        } else {
            const result = db.exec(sql);
            if (result.length === 0) {
                return [];
            }
            
            // Convert result to array of objects
            const columns = result[0].columns;
            const values = result[0].values;
            const rows = [];
            
            for (let i = 0; i < values.length; i++) {
                const row = {};
                for (let j = 0; j < columns.length; j++) {
                    row[columns[j]] = values[i][j];
                }
                rows.push(row);
            }
            
            return rows;
        }
    } catch (error) {
        console.error('Query error:', error);
        console.error('SQL:', sql);
        throw error;
    }
}

/**
 * Format date from YYYYMMDD format to MM/DD/YYYY
 */
function formatDate(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr || '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}/${year}`;
}

/**
 * Format FindAGrave URL from ID
 * Security: Use HTTPS to prevent mixed content warnings and ensure secure connections
 */
function formatFindAGraveUrl(fgId) {
    if (!fgId) return null;
    // Security: Use HTTPS and escape the ID to prevent injection
    const safeId = String(fgId).replace(/[^0-9]/g, ''); // Only allow numeric IDs
    return `https://www.findagrave.com/memorial/${safeId}`;
}

/**
 * Get all burials sorted by name.
 * @returns {Promise<Array>} Array of burial records
 */
async function getBurialsByName() {
    // Return cached result if available
    if (queryCache.burialsByName !== null) {
        return Promise.resolve(queryCache.burialsByName);
    }
    
    const sql = `
        SELECT 
            b.Burial as name,
            b.DateOfBirth,
            b.DateOfDeath,
            b.Lot as lot_id,
            b.Plot as space,
            b.Cremains as code,
            b.MilitaryRecord as military_service,
            b.MilitaryReported,
            b.FindAGrave,
            COALESCE(m.Section, '') as Section,
            COALESCE(m.X, '') as X,
            COALESCE(m.Y, '') as Y
        FROM tblBurialSites b
        LEFT JOIN tblMapCellData m ON (b.Lot = m.StdLotID OR b.Lot = m.CellContents)
        WHERE b.Burial IS NOT NULL AND b.Burial != ''
        ORDER BY b.Burial
    `;
    const results = await query(sql);
    
    // Transform results to match expected format
    const transformed = results.map(row => ({
        name: row.name || '',
        birthdate: formatDate(row.DateOfBirth || ''),
        deathdate: formatDate(row.DateOfDeath || ''),
        section: row.Section || '',
        lot_id: row.lot_id || '',
        space: row.space || '',
        code: row.code || '',
        military_service: row.military_service || '',
        veteran: row.MilitaryReported && row.MilitaryReported !== '9999-09-09 00:00:00' ? 'X' : '',
        findagrave_url: formatFindAGraveUrl(row.FindAGrave),
        findagrave: formatFindAGraveUrl(row.FindAGrave),
        x: row.X || '',
        y: row.Y || '',
        row: row.X || '',
        lot: row.Y || ''
    }));
    
    // Cache the result
    queryCache.burialsByName = transformed;
    return transformed;
}

/**
 * Get all burials sorted by location (section, lot_id, space).
 * @returns {Promise<Array>} Array of burial records
 */
async function getBurialsByLocation() {
    // Return cached result if available
    if (queryCache.burialsByLocation !== null) {
        return Promise.resolve(queryCache.burialsByLocation);
    }
    
    const sql = `
        SELECT 
            b.Burial as name,
            b.DateOfBirth,
            b.DateOfDeath,
            b.Lot as lot_id,
            b.Plot as space,
            b.Cremains as code,
            b.MilitaryRecord as military_service,
            b.MilitaryReported,
            b.FindAGrave,
            COALESCE(m.Section, '') as Section,
            COALESCE(m.X, '') as X,
            COALESCE(m.Y, '') as Y
        FROM tblBurialSites b
        LEFT JOIN tblMapCellData m ON (b.Lot = m.StdLotID OR b.Lot = m.CellContents)
        WHERE b.Burial IS NOT NULL AND b.Burial != ''
        ORDER BY COALESCE(m.Section, ''), b.Lot, CAST(b.Plot AS INTEGER)
    `;
    const results = await query(sql);
    
    // Transform results to match expected format
    const transformed = results.map(row => ({
        name: row.name || '',
        birthdate: formatDate(row.DateOfBirth || ''),
        deathdate: formatDate(row.DateOfDeath || ''),
        section: row.Section || '',
        lot_id: row.lot_id || '',
        space: row.space || '',
        code: row.code || '',
        military_service: row.military_service || '',
        veteran: row.MilitaryReported && row.MilitaryReported !== '9999-09-09 00:00:00' ? 'X' : '',
        findagrave_url: formatFindAGraveUrl(row.FindAGrave),
        findagrave: formatFindAGraveUrl(row.FindAGrave),
        x: row.X || '',
        y: row.Y || '',
        row: row.X || '',
        lot: row.Y || ''
    }));
    
    // Cache the result
    queryCache.burialsByLocation = transformed;
    return transformed;
}

/**
 * Get all lot owners sorted by name.
 * @returns {Promise<Array>} Array of lot owner records
 */
async function getOwnedLotsByName() {
    // Return cached result if available
    if (queryCache.ownedLotsByName !== null) {
        return Promise.resolve(queryCache.ownedLotsByName);
    }
    
    const sql = `
        SELECT 
            Owner as name,
            Section,
            Lot as lot_id,
            Notes
        FROM tblPlotSales
        WHERE Owner IS NOT NULL AND Owner != ''
        ORDER BY Owner
    `;
    const results = await query(sql);
    
    // Cache the result
    queryCache.ownedLotsByName = results;
    return results;
}

/**
 * Get all lot owners sorted by location (section, lot_id).
 * @returns {Promise<Array>} Array of lot owner records
 */
async function getOwnedLotsByLocation() {
    // Return cached result if available
    if (queryCache.ownedLotsByLocation !== null) {
        return Promise.resolve(queryCache.ownedLotsByLocation);
    }
    
    const sql = `
        SELECT 
            Owner as name,
            Section,
            Lot as lot_id,
            Notes
        FROM tblPlotSales
        WHERE Owner IS NOT NULL AND Owner != ''
        ORDER BY Section, Lot
    `;
    const results = await query(sql);
    
    // Cache the result
    queryCache.ownedLotsByLocation = results;
    return results;
}

/**
 * Get all veteran flags and crosses records sorted by name.
 * @returns {Promise<Array>} Array of veteran flags/crosses records
 */
async function getVeteranFlagsCrosses() {
    // Return cached result if available
    if (queryCache.veteranFlagsCrosses !== null) {
        return Promise.resolve(queryCache.veteranFlagsCrosses);
    }
    
    const sql = `
        SELECT * FROM veteran_flags_crosses
        ORDER BY full_name
    `;
    const results = await query(sql);
    
    // Cache the result
    queryCache.veteranFlagsCrosses = results;
    return results;
}

/**
 * Get database metadata (last update date, record counts, etc.)
 * @returns {Promise<Object>} Metadata object
 */
async function getDatabaseMetadata() {
    // Return cached result if available
    if (queryCache.metadata !== null) {
        return Promise.resolve(queryCache.metadata);
    }
    
    try {
        const burialsCount = await query('SELECT COUNT(*) as count FROM tblBurialSites WHERE Burial IS NOT NULL AND Burial != \'\'');
        const ownersCount = await query('SELECT COUNT(*) as count FROM tblPlotSales WHERE Owner IS NOT NULL AND Owner != \'\'');
        const veteransCount = await query('SELECT COUNT(*) as count FROM veteran_flags_crosses');
        
        const metadata = {
            burialsCount: burialsCount[0]?.count || 0,
            ownersCount: ownersCount[0]?.count || 0,
            veteransCount: veteransCount[0]?.count || 0,
            lastUpdated: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
        
        // Cache the result
        queryCache.metadata = metadata;
        return metadata;
    } catch (error) {
        console.error('Error getting metadata:', error);
        const fallback = {
            burialsCount: 0,
            ownersCount: 0,
            veteransCount: 0,
            lastUpdated: 'Unknown'
        };
        queryCache.metadata = fallback;
        return fallback;
    }
}

/**
 * Preload the appropriate query based on the current page URL
 */
async function preloadQueryForPage() {
    if (typeof window === 'undefined') return;
    
    try {
        // Wait for database to be loaded
        await loadDatabase();
        
        // Determine which query to preload based on page URL
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('burialsbyname')) {
            getBurialsByName().catch(err => console.log('Preload burials by name failed:', err));
            getDatabaseMetadata().catch(err => console.log('Preload metadata failed:', err));
        } else if (path.includes('burialsbylocation')) {
            getBurialsByLocation().catch(err => console.log('Preload burials by location failed:', err));
            getDatabaseMetadata().catch(err => console.log('Preload metadata failed:', err));
        } else if (path.includes('ownedlotsbyname')) {
            getOwnedLotsByName().catch(err => console.log('Preload owned lots by name failed:', err));
            getDatabaseMetadata().catch(err => console.log('Preload metadata failed:', err));
        } else if (path.includes('ownedlotsbylocation')) {
            getOwnedLotsByLocation().catch(err => console.log('Preload owned lots by location failed:', err));
            getDatabaseMetadata().catch(err => console.log('Preload metadata failed:', err));
        } else if (path.includes('flagsandcrosses')) {
            getVeteranFlagsCrosses().catch(err => console.log('Preload veteran flags/crosses failed:', err));
            getDatabaseMetadata().catch(err => console.log('Preload metadata failed:', err));
        }
    } catch (error) {
        // Silently handle - will retry when page calls the function
        console.log('Query preload failed (will retry on demand):', error);
    }
}

// Preload database and query immediately when script loads (don't wait for DOM)
// This makes the initial load faster since database and data start loading right away
if (typeof window !== 'undefined') {
    // Start loading database in background as soon as script is parsed
    loadDatabase()
        .then(() => {
            // Once database is loaded, preload the appropriate query
            preloadQueryForPage();
        })
        .catch(error => {
            // Silently handle errors - they'll be caught when loadData() is called
            console.log('Background database preload failed (will retry on demand):', error);
        });
}

// Export functions for use in HTML pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDatabase,
        query,
        getBurialsByName,
        getBurialsByLocation,
        getOwnedLotsByName,
        getOwnedLotsByLocation,
        getVeteranFlagsCrosses,
        getDatabaseMetadata
    };
}
