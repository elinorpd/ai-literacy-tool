// LessonComponent.js
import React from 'react';

const LessonComponent = ({ data, onEditClick, onDeleteClick }) => {
  return (
    <div className='lesson-component'>
      <h3>{data.title}</h3>
      <p>{data.value}</p>
      <div className='buttons'>
      <button type='button' onClick={() => onEditClick(data)}>Edit</button>
      <button type='button' onClick={() => onDeleteClick(data)}>Delete</button>
      </div>
    </div>
  );
};

export default LessonComponent;
