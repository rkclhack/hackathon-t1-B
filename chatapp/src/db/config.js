import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const createConnection = async () => {
  try {
    const db = await open({
      filename: './chatapp.db',
      driver: sqlite3.Database
    });
    console.log('SQLite connected successfully');
    return db;
  } catch (error) {
    console.error('SQLite connection failed:', error);
    throw error;
  }
};