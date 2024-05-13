import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EntryForm.css';

const API_URL = 'http://localhost:5000'; 

function EntryForm({ entityName, entry, onClose }) {
  const isEditing = entry !== null;
  const [formData, setFormData] = useState(entry || {});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFormData(entry || {}); // Update form data if entry is being edited
  }, [entry]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/entities/${entityName}/${entry.id}`, formData);
        setSuccess('Entry updated successfully!');
      } else {
        await axios.post(`${API_URL}/entities/${entityName}`, formData);
        setSuccess('Entry created successfully!');
      }
      onClose(); // Close the form
    } catch (error) {
      setError('Failed to save entry. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="entry-form-modal">
      <div className="entry-form-content">
        <h2>{isEditing ? 'Edit Entry' : 'Create New Entry'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Dynamically render input fields based on entity attributes */}
          {Object.keys(formData).map(attribute => (
            <div className="form-group" key={attribute}>
              <label htmlFor={attribute}>{attribute}:</label>
              <input
                type="text"
                className="form-control"
                id={attribute}
                name={attribute}
                value={formData[attribute] || ''}
                onChange={handleChange}
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary mr-2">
            Save
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EntryForm;