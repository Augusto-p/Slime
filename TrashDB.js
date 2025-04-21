const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Trash.db');

function init() {
  db.run(`
    CREATE TABLE IF NOT EXISTS Trash (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Path TEXT NOT NULL DEFAULT "",
      Name TEXT NOT NULL DEFAULT "",
      Type INTEGER NOT NULL DEFAULT 0
    )
  `);
}

function getAll() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Trash', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function add({ Path, Name, Type }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Trash (Path, Name, Type) VALUES (?, ?, ?)`,
      [Path, Name, Type],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

function deleteItem(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM Trash WHERE ID = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

function update({ ID, Path, Name, Type }) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Trash SET Path = ?, Name = ?, Type = ? WHERE ID = ?`,
      [Path, Name, Type, ID],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  init,
  getAll,
  add,
  delete: deleteItem,
  update,
};
