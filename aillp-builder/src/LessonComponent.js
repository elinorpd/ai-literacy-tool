import React from 'react';

const LessonComponent = ({ data, onEditClick, onDeleteClick }) => {
  const renderComponentContent = () => {
    switch (data.type) {
      case 'Title':
      case 'Overview':
      case 'Objectives':
      case 'Audience':
        return (
          <>
            <h3>{data.type}</h3>
            {data.properties.title && <h4>{data.properties.title}</h4>}
            <p>{data.properties.value}</p>
          </>
        );
      case 'Duration':
        return (
          <>
            <h3>{data.type}</h3>
            {data.properties.title && <h4>{data.properties.title}</h4>}
            <p>{data.properties.value} minutes</p>
          </>
        );
      case 'Activity':
        return (
          <>
            <h3>{data.type}: {data.properties.title}</h3>
            <p>{data.properties.value}</p>
          </>
        );
      case 'Custom':
        return (
          <>
            <h3>{data.properties.title}</h3>
            <p>{data.properties.value}</p>
          </>
        );
      case 'AIObjectives':
        return (
          <>
            <h3>AI Literacy Learning Objectives</h3>
            <ul>
              {data.properties.checklist.filter(item => item.checked).map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
              {data.properties.customObjective && <li>{data.properties.customObjective}</li>}
            </ul>
          </>
        );
      default:
        return <p>Unknown Component Type</p>;
    }
  };

  return (
    <div className='lesson-component'>
      {renderComponentContent()}
      <div className='buttons'>
        <button type='button' onClick={() => onEditClick(data)}>Edit</button>
        <button type='button' onClick={() => onDeleteClick(data.id)}>Delete</button>
      </div>
    </div>
  );
};

export default LessonComponent;
