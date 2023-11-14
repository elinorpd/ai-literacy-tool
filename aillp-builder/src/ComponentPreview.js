import React from 'react';
import './ComponentPreview.css'; // Import the corresponding stylesheet

const ComponentPreview = ({ comp }) => {
  const renderEditableStatus = () => {
    return comp.properties.editable ? 'Editable' : 'Not Editable';
  };

  // Function to render components based on type
  const renderComponentPreview = (comp) => {
    // console.log("comp is:", comp)
    if (!comp) {
      return null;
    }

    switch (comp.type) {
      case 'Title':
      case 'Duration':
      case 'Overview':
      case 'Objectives':
      case 'Audience':
      case 'Custom':
      case 'Activity':
        return (
          <>
            <div className="titleRow">
              <h3>{comp.type}</h3>
              <span className="editableStatus">{renderEditableStatus()}</span>
            </div>
            {comp.properties.title && <h4>{comp.properties.title}</h4>}
            <p>{comp.properties.value}</p>
          </>
        );
      case 'AIObjectives':
        return (
          <>
            <div className="titleRow">
              <h3>AI Literacy Learning Objectives</h3>
              <span className="editableStatus">{renderEditableStatus()}</span>
            </div>
            <ul>
              {comp.properties.checklist.filter(item => item.checked).map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          </>
        );
      default:
        return <p>Unknown Component Type</p>;
    }
  };

  return (
    <div className="componentPreview">
      {renderComponentPreview(comp)}
    </div>
  );
};

export default ComponentPreview;
