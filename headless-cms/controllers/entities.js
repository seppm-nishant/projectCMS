const pool = require('../config/db');

// Helper function to build dynamic queries
function buildQuery(entityName, attributes, data = null, whereClause = '') {
    let query = '';
  
    // 1. CREATE TABLE Query
    if (attributes && !data && !whereClause) {
      const columns = attributes
        .map((attr) => `${attr.name} ${attr.type}`)
        .join(', ');
      query = `CREATE TABLE IF NOT EXISTS ${entityName} (id SERIAL PRIMARY KEY, ${columns})`;
    }
  
    // 2. INSERT Query
    else if (data && !whereClause) {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data)
        .map((val) => (typeof val === 'string' ? `'${val}'` : val)) // Handle string values
        .join(', ');
      query = `INSERT INTO ${entityName} (${columns}) VALUES (${values})`;
    }
  
    // 3. SELECT Query
    else if (!data && !whereClause) {
      query = `SELECT * FROM ${entityName}`;
    }
  
    // 4. UPDATE Query
    else if (data && whereClause) {
      const updates = Object.entries(data)
        .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
        .join(', ');
      query = `UPDATE ${entityName} SET ${updates} ${whereClause}`;
    }
  
    // 5. DELETE Query
    else if (!data && whereClause) {
      query = `DELETE FROM ${entityName} ${whereClause}`;
    }
  
    return query;
}

async function createEntity(req, res) {
  const { entityName, attributes } = req.body;

  try {
    const createTableQuery = buildQuery(entityName, attributes);
    await pool.query(createTableQuery);
    res.status(201).json({ message: `Entity '${entityName}' created successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create entity' });
  }
}

async function getEntityData(req, res) {
  const { entityName } = req.params;

  try {
    const selectQuery = buildQuery(entityName, null, null); // Fetch all attributes
    const result = await pool.query(selectQuery);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch entity data' });
  }
}

async function createEntry(req, res) {
  const { entityName } = req.params;
  const data = req.body;

  try {
    const insertQuery = buildQuery(entityName, null, data);
    await pool.query(insertQuery);
    res.status(201).json({ message: 'Entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
}

async function updateEntry(req, res) {
  const { entityName, id } = req.params;
  const data = req.body;

  try {
    const updateQuery = buildQuery(entityName, null, data, `WHERE id = ${id}`);
    await pool.query(updateQuery);
    res.json({ message: 'Entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
}

async function deleteEntry(req, res) {
  const { entityName, id } = req.params;

  try {
    const deleteQuery = buildQuery(entityName, null, null, `WHERE id = ${id}`);
    await pool.query(deleteQuery);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
}

module.exports = {
  createEntity,
  getEntityData,
  createEntry,
  updateEntry,
  deleteEntry
};
