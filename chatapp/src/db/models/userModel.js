import { createConnection } from '../config.js';
import { sha256 } from "js-sha256";

export class UserModel {
  static async createTable() {
    const db = await createConnection();
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          hashed_password TEXT NOT NULL,
          userName TEXT NOT NULL,
          instrument JSON,
          music JSON,
          grade INTEGER,
          university TEXT,
          last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table created or already exists');
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      await db.close();
    }
  }

  static async createUser(email, password, userName, instrument, music, grade, university) {
    const db = await createConnection();
    try {
      const hashedPassword = sha256(password);
      const result = await db.run(
        'INSERT INTO users (email, hashed_password, userName, instrument, music, grade, university) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, userName, JSON.stringify(instrument), JSON.stringify(music), grade, university]
      );
      return result.lastID;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  static async getUserInfoByID(userId) {
    const db = await createConnection();
    try {
      const row = await db.get(
        'SELECT userName, instrument, music, grade, university FROM users WHERE id = ?',
        [userId]
      );
      row.instrument = JSON.parse(row.instrument);
      row.music = JSON.parse(row.music);
      return row ? row : null;
    } catch (error) {
      console.error('Error fetching user info by ID:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  static async authenticateUser(email, password) {
    const db = await createConnection();
    try {
      const hashedPassword = sha256(password);
      const row = await db.get(
        'SELECT id, userName FROM users WHERE email = ? AND hashed_password = ?',
        [email, hashedPassword]
      );
      return row ? { id: row.id, userName: row.userName } : null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  static async getAllUsers() {
    const db = await createConnection();
    try {
      const rows = await db.all('SELECT id, userName FROM users');
      return rows;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  static async updateLastLogin(userId) {
    const db = await createConnection();
    try {
      await db.run(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    } finally {
      await db.close();
    }
  }
}