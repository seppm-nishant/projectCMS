// models/entity.js

const pool = require('../config/db');

// Function to determine PostgreSQL data type based on attribute type
function getPostgresType(attributeType) {
  switch (attributeType) {
    case 'string':
      return 'TEXT';
    case 'number':
      return 'INTEGER';
    case 'boolean':
      return 'BOOLEAN';
    case 'date':
      return 'DATE';
    default:
      return 'TEXT'; // Default to text for unknown types
  }
}

// Function to create a table based on entity attributes
async function createTable(entityName, attributes) {
  const columns = attributes
    .map(attr => `${attr.name} ${getPostgresType(attr.type)}`)
    .join(', ');
  const query = `CREATE TABLE IF NOT EXISTS ${entityName} (id SERIAL PRIMARY KEY, ${columns})`;

  await pool.query(query);
}

// Function to insert a new entry into an entity table
async function insertEntry(entityName, data) {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data)
    .map(val => (typeof val === 'string' ? `'${val}'` : val))
    .join(', ');
  const query = `INSERT INTO ${entityName} (${columns}) VALUES (${values}) RETURNING *`; // Return the inserted row

  const result = await pool.query(query);
  return result.rows[0]; // Return the inserted data
}

// Function to fetch all entries from an entity table
async function getAllEntries(entityName) {
  const query = `SELECT * FROM ${entityName}`;
  const result = await pool.query(query);
  return result.rows;
}

// Function to update an existing entry
async function updateEntry(entityName, id, data) {
  const updates = Object.entries(data)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');
  const query = `UPDATE ${entityName} SET ${updates} WHERE id = ${id}`;

  await pool.query(query);
}

// Function to delete an entry
async function deleteEntry(entityName, id) {
  const query = `DELETE FROM ${entityName} WHERE id = ${id}`;
  await pool.query(query);
}

module.exports = {
  createTable,
  insertEntry,
  getAllEntries,
  updateEntry,
  deleteEntry,
};
