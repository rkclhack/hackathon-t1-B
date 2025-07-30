import { createConnection } from '../config.js';
import { sha256 } from "js-sha256";

export class UserModel {
  static async createTable() {
    const db = await createConnection();
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          hashed_password TEXT NOT NULL,
          username TEXT NOT NULL,
          instrument JSON,
          music JSON,
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

  static async createUser(email, password, username, instrument, music) {
    const db = await createConnection();
    try {
      const hashedPassword = sha256(password);
      const result = await db.run(
        'INSERT INTO users (email, hashed_password, username, instrument, music) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, username, instrument, music]
      );
      return result.lastID;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      await db.close();
    }
  }

  static async getUsernameByID(userID) {
    const db = await createConnection();
    try {
      const row = await db.get(
        'SELECT username FROM users WHERE id = ?',
        [userID]
      );
      return row ? row.username : null;
    } catch (error) {
      console.error('Error fetching username by ID:', error);
      throw error;
    } finally {
      await db.close();
    }
  }
}