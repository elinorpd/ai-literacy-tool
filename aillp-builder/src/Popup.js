import React, { useState, useEffect } from 'react';
import './Popup.css'; // You will need to create a corresponding CSS file for styling.

const Popup = ({ show, onClose, onSave, data, isLoading }) => {
  // const [title, setTitle] = useState(data?.title || '');
  // const [value, setValue] = useState(data?.value || '');
  // const [editable, setEditable] = useState(data?.editable || false);
  const [id, setId] = useState(data?.id || null); // use null to signify no id if new component
  const [properties, setProperties] = useState(data.properties || { checklist: [] });

  useEffect(() => {
    setProperties(data.properties || {});
    setId(data?.id || null); // Reset ID when opening for a new component
  }, [data]);

  const renderEditableCheckbox = () => {
    if (!properties) {
      return null; // or some default UI
    }
  
    return (
      <div>
        <label htmlFor="editable">Editable</label>
        <input
          type="checkbox"
          id="editable"
          checked={properties.editable || false}
          onChange={handleEditableChange}
        />
      </div>
    );
  };
  
  
  // 1. Title
  const renderTitleFields = () => (
    <>
      <label htmlFor="value">Title</label>
      <input
        type="text"
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {renderEditableCheckbox()}
    </>
  );

  // 2. Duration
  const renderDurationFields = () => (
    <>
      <label htmlFor="value">Duration</label>
      <input
        type="number"
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {renderEditableCheckbox()}
    </>
  );

  // 3. Overview
  const renderOverviewFields = () => (
    <>
    <label htmlFor="value">Overview</label>
    <textarea
      id="value"
      value={properties.value || ''}
        onChange={handleValueChange}
    />
    {renderEditableCheckbox()}
  </>
);

  // another one. Assessment
  const renderAssessmentFields = () => (
    <>
    <label htmlFor="value">Assessment</label>
    <textarea
      id="value"
      value={properties.value || ''}
        onChange={handleValueChange}
    />
    {renderEditableCheckbox()}
  </>
);

  // 4. Learning Objectives
  const renderObjectivesFields = () => (
    <>
      <label htmlFor="value">Learning Objectives</label>
      <input
        type="text"
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {renderEditableCheckbox()}
    </>
  );

  // 5. AI Literacy Learning Objectives
  const renderAIObjectivesFields = () => {
    // console.log("rendering AI objectives fields")
    // console.log(properties)
    if (!properties.checklist) {
      return (<p>no checklist</p>)
    }
    
    return (
    <>
    <label>AI Literacy Learning Objectives</label>
    {properties.checklist.map((item, index) => (
      <div key={index} className="checkboxItem">
        <div key={`checklist-item-${index}-${item.checked}`}>
          <input
            type="checkbox"
            id={`objective${index}`}
            checked={item.checked || false}
            onChange={(e) => handleChecklistChange(e, index)}
          />
          <label htmlFor={`objective${index}`}>{item.label}</label>
        </div>
      </div>
    ))}
    <br/>
      <div className="customObjectiveRow">
        <label htmlFor="customObjective">Custom Objective:</label>
        <input
          type="text"
          id="customObjective"
          value={properties.customObjective || ''}
          onChange={(e) => setProperties({ ...properties, customObjective: e.target.value })}
        />
      </div>
  {renderEditableCheckbox()}
  </>
)};

  // 6. Activities
  const renderActivityFields = () => (
    <>
      <label htmlFor="title">Activity Title</label>
      <input
        type="text"
        id="title"
        value={properties.title || ''}
        onChange={handleTitleChange}
      />
      <label htmlFor="value">Description</label>
      <textarea
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {/* <label htmlFor="value">Assessment</label>
      <textarea
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      /> */}
      {renderEditableCheckbox()}
    </>
  );
  

  // 7. Target Audience
  const renderAudienceFields = () => (
      <>
        <label htmlFor="value">Target Audience</label>
        <input
          type="text"
          id="value"
          value={properties.value || ''}
          onChange={handleValueChange}
        />
        {renderEditableCheckbox()}
      </>
    );

  // 8. Custom Component
  const renderCustomFields = () => (
    <>
      <label htmlFor="title">Custom Component Title</label>
      <input
        type="text"
        id="title"
        value={properties.title || ''}
        onChange={handleTitleChange}
      />
      <label htmlFor="value">Custom Description</label>
      <textarea
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {renderEditableCheckbox()}
    </>
  );

  // helper functions to handle changes in the forms 
  const handleChecklistChange = (e, index) => {
    console.log("checklist is changing!")
    // Create a new checklist array with the updated item
    const updatedChecklist = properties.checklist.map((item, i) => {
      if (i === index) {
        return { ...item, checked: e.target.checked };
      }
      return item;
    });  
    console.log(updatedChecklist)

    // Update the state with the new checklist
    setProperties({ ...properties, checklist: updatedChecklist });
  };

  const handleTitleChange = (e) => {
    setProperties({ ...properties, title: e.target.value });
  };  

  const handleValueChange = (e) => {
    setProperties({ ...properties, value: e.target.value });
  };
  
  const handleEditableChange = (e) => {
    setProperties({ ...properties, editable: e.target.checked });
  };

  // Function to determine which form fields to render
  const renderFormFields = () => {
    // console.log("render form fields")
    // console.log(data)
    switch (data.type) {
      case 'Title':
        return renderTitleFields();
      case 'Duration':
        return renderDurationFields();
      case 'Overview':
        return renderOverviewFields();
      case 'Assessment':
        return renderAssessmentFields();
      case 'Objectives':
        return renderObjectivesFields();
      case 'AIObjectives':
        return renderAIObjectivesFields();
      case 'Activity':
        return renderActivityFields();
      case 'Audience':
        return renderAudienceFields();
      case 'Custom':
        return renderCustomFields();
      default:
        return <p>Unknown component type</p>;
    }
  };
  

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const componentData = {
      id: data.id ? data.id : Date.now(), // If it's a new component, generate a new ID
      type: data.type,
      properties: { ...properties }
    };
  
    // Call the onSave prop with the new or updated component data
    onSave(componentData);
  };
  

    // If isLoading is true, render the loading message instead of the form
    if (isLoading) {
      return (
        <div className="popup">
          <div className="popup-content">
            <p>Please wait while the AI generates your lesson plan...</p>
          </div>
        </div>
      );
    }
  
  // Otherwise, render the form
  return (
    <div className="popup">
      <div className="popup-content">
        <form onSubmit={handleSubmit}>
          {renderFormFields()}  {/* This will dynamically render the correct fields based on the type */}
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
