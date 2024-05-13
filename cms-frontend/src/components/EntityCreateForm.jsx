import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

function EntityCreateForm() {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: 'string' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: 'string' }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (entityName.trim() === '') {
      setError('Entity name is required.');
      return;
    }

    const data = {
      entityName,
      attributes,
    };

    try {
      const response = await axios.post(`${API_URL}/entities`, data);
      setSuccess(`Entity '${entityName}' created successfully!`);
      setEntityName('');
      setAttributes([{ name: '', type: 'string' }]);
    } catch (error) {
      setError('Failed to create entity. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Entity</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="entityName">Entity Name:</label>
          <input
            type="text"
            className="form-control"
            id="entityName"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
          />
        </div>

        {attributes.map((attribute, index) => (
          <div className="form-row mb-2" key={index}>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Attribute Name"
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="col">
              <select
                className="form-control"
                value={attribute.type}
                onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-2" onClick={handleAddAttribute}>
          Add Attribute
        </button>
        <button type="submit" className="btn btn-primary">
          Create Entity
        </button>
      </form>
    </div>
  );
}

export default EntityCreateForm;