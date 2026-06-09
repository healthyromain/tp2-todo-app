import * as SQLite from 'expo-sqlite';
import type { TaskItemData } from '@/lib/types';

const db = SQLite.openDatabaseSync('tasks.db');

type TaskRow = Omit<TaskItemData, 'completed'> & { completed: number };

function rowToTask(row: TaskRow): TaskItemData {
  return { ...row, completed: row.completed === 1 };
}

export function initDB() {
  db.execSync(`DROP TABLE IF EXISTS tasks;`);
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function getTasks(): TaskItemData[] {
  const rows = db.getAllSync<TaskRow>(
    'SELECT id, title, description, completed FROM tasks ORDER BY created_at ASC'
  );
  return rows.map(rowToTask);
}

export function getTaskById(id: number): TaskItemData | null {
  const row = db.getFirstSync<TaskRow>(
    'SELECT id, title, description, completed FROM tasks WHERE id = ?',
    [id]
  );
  return row ? rowToTask(row) : null;
}

export function insertTask(title: string, description: string | null) {
  db.runSync(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description]
  );
}

export function updateTask(id: number, title: string, description: string | null) {
  db.runSync(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    [title, description, id]
  );
}

export function toggleTask(id: number, completed: boolean) {
  db.runSync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );
}

export function deleteAllTasks() {
  db.execSync('DELETE FROM tasks');
}

export function insertSeedTasks() {
  const seeds: [string, string | null][] = [
    ['Record podcast video', "Don't forget to ask confirmation with the guest from Stanford"],
    ['Dinner with Anna', null],
    ['Dinner with Bill', null],
    ['Rest', null],
    ['Write a blog post', null],
    ['Send the podcast script', null],
    ['Update the notion template', null],
    ['Plan the content schedule', null],
    ['Ma nouvelle tâche', 'Test'],
  ];
  for (const [title, desc] of seeds) {
    db.runSync(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, desc]
    );
  }
}