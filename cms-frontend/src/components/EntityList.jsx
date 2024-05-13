import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EntityList.css'

const API_URL = 'http://localhost:5000'; 

function EntityList() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axios.get(`${API_URL}/entities`);
        setEntities(response.data);
      } catch (error) {
        console.error('Error fetching entities:', error);
      }
    };

    fetchEntities();
  }, []);

  return (
    <div>
      <h2>Entities</h2>
      <ul>
        {entities.map(entity => (
          <li key={entity.name}>
            <Link to={`/entities/${entity.name}`}>{entity.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/create-entity">Create New Entity</Link>
    </div>
  );
}

export default EntityList;
