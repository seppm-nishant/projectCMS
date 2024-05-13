import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntityList from './components/EntityList';
import EntityCreateForm from './components/EntityCreateForm';
import EntityDetail from './components/EntityDetail';
import './App.css';

function App() {
  return (
    <Router>
    <div>
      <Routes> 
      <Route path="/" element={<EntityList />} />
      <Route path="/create-entity" element={<EntityCreateForm />} />
      <Route path="/entities/:entityName" element={<EntityDetail />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
