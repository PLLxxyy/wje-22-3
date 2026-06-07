import { db } from './database'

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Properties table
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    address TEXT NOT NULL,
    area TEXT NOT NULL,
    rent INTEGER NOT NULL,
    layout TEXT NOT NULL,
    size INTEGER,
    photos TEXT,
    landlord_name TEXT,
    landlord_phone TEXT,
    status TEXT DEFAULT 'viewing',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// Viewing notes table
db.exec(`
  CREATE TABLE IF NOT EXISTS viewing_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    lighting INTEGER DEFAULT 5,
    noise INTEGER DEFAULT 5,
    transport INTEGER DEFAULT 5,
    amenities INTEGER DEFAULT 5,
    overall_score INTEGER DEFAULT 5,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
  )
`)

// Reminders table
db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  )
`)

console.log('Database initialized successfully')
