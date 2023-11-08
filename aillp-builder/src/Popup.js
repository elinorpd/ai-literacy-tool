import React, { useState, useEffect } from 'react';
import './Popup.css'; // You will need to create a corresponding CSS file for styling.

const Popup = ({ show, onClose, onSave, data }) => {
  const [title, setTitle] = useState(data?.title || '');
  const [value, setValue] = useState(data?.value || '');
  const [editable, setEditable] = useState(data?.editable || false);
  const [id, setId] = useState(data?.id || null); // use null to signify no id if new component

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id, title, value, editable });
  };  

  return (
    <div className="popup">
      <div className="popup-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="value">Value</label>
          <textarea
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <label htmlFor="editable">Editable</label>
          <input
            type="checkbox"
            id="editable"
            checked={editable}
            onChange={(e) => setEditable(e.target.checked)}
          />
          <div className="buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
