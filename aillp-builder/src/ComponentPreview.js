import React from 'react';
import './ComponentPreview.css'; // Import the corresponding stylesheet

const ComponentPreview = ({ comp, onEditClick, onDeleteClick }) => {
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
      case 'Overview':
      case 'Assessment':
      case 'Audience':
        return (
          <>
            <div className="titleRow">
              <h3>{comp.type}</h3>
              {/* <span className="editableStatus">{renderEditableStatus()}</span> */}
            </div>
            {comp.properties.title && <h4>{comp.properties.title}</h4>}
            <p>{comp.properties.value}</p>
          </>
        );
        case 'Objectives':
          return (
            <>
              <div className="titleRow">
                <h3>Learning {comp.type}</h3>
                {/* <span className="editableStatus">{renderEditableStatus()}</span> */}
              </div>
              {comp.properties.title && <h4>{comp.properties.title}</h4>}
              <p>{comp.properties.value}</p>
            </>
          );
        case 'Activity':
          return (
            <>
              <div className="titleRow">
                <h3>{comp.type}: {comp.properties.title}</h3>
                <span className="editableStatus">{renderEditableStatus()}</span>
              </div>
              <h5>Description</h5>
              <p>{comp.properties.value}</p>
              
              {comp.properties.assessment && <h5>Assessment</h5>}
              {comp.properties.assessment && <p>{comp.properties.assessment}</p>}
            </>
          );
        case 'AIActivity':
          return (
            <>
              <div className="titleRow">
                <h3>AI Literacy Activity</h3>
                <span className="editableStatus">{renderEditableStatus()}</span>
              </div>
              <p>Duration: {comp.properties.value} minutes.</p>
              {comp.properties.req && <h5>Activity Specifications</h5>}
              {comp.properties.req && <p>{comp.properties.req}</p>}
            </>
          );
        case 'Custom':
          return (
            <>
              <div className="titleRow">
                <h3>{comp.properties.title}</h3>
                {/* <span className="editableStatus">{renderEditableStatus()}</span> */}
              </div>
              
              <p>{comp.properties.value}</p>
            </>
          );
        case 'Duration':
          return (
            <>
              <div className="titleRow">
                <h3>{comp.type}</h3>
                {/* <span className="editableStatus">{renderEditableStatus()}</span> */}
              </div>
              {comp.properties.title && <h4>{comp.properties.title}</h4>}
              <p>{comp.properties.value} minutes</p>
            </>
          );
      case 'AIObjectives':
        return (
          <>
            <div className="titleRow">
              <h3>AI Literacy Learning Objectives</h3>
              {/* <span className="editableStatus">{renderEditableStatus()}</span> */}
            </div>
            <ul>
              {comp.properties.checklist.filter(item => item.checked).map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
              {comp.properties.customObjective && <li>{comp.properties.customObjective}</li>}
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
      <div className='previewbuttons'>
        <button type='button' onClick={() => onEditClick(comp)}>Edit</button>
        <button type='button' onClick={() => onDeleteClick(comp.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ComponentPreview;
