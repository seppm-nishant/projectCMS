import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import EntryForm from './EntryForm';
import './EntityDetail.css';

const API_URL = 'http://localhost:5000'; 

function EntityDetail() {
    const { entityName } = useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [attributes, setAttributes] = useState([]); // Store entity attributes
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntries = async () => {
          try {
            const response = await axios.get(`${API_URL}/entities/${entityName}`);
            setEntries(response.data);
    
            // Assuming first entry has all attributes
            if (response.data.length > 0) {
              setAttributes(Object.keys(response.data[0]).filter(key => key !== 'id'));
            }
          } catch (error) {
            console.error('Error fetching entries:', error);
            setError('Failed to fetch entity data. Please try again later.');
          }
        };
    
        fetchEntries();
      }, [entityName]);

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setShowEntryForm(true);
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setShowEntryForm(true);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`${API_URL}/entities/${entityName}/${entryId}`);
      setEntries(entries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEntryFormClose = () => {
    setShowEntryForm(false);
    setSelectedEntry(null); // Clear selected entry
  };

  const handleGoBack = () => {
    navigate('/'); // Navigate back to entity list
  };

  return (
    <div>
      <h2>{entityName}</h2>
      <button className='back-button' onClick={() => navigate(-1)}>Back to Entities</button> {/* Use navigate(-1) for history back */}
      
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <button onClick={handleCreateEntry}>Create New Entry</button>

          {showEntryForm && (
            <EntryForm
              entityName={entityName}
              entry={selectedEntry}
              onClose={handleEntryFormClose}
              attributes={attributes} // Pass attributes to EntryForm
            />
          )}

          <table>
            <thead>
              <tr>
                <th>ID</th>
                {attributes.map(attr => (
                  <th key={attr}>{attr}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  {attributes.map(attr => (
                    <td key={attr}>{entry[attr]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEditEntry(entry)}>Edit</button>
                    <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default EntityDetail;
