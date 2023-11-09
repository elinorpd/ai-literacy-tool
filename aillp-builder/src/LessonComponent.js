// LessonComponent.js
import React from 'react';

const LessonComponent = ({ data, onEditClick }) => {
  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.value}</p>
      <div className='buttons'>
      <button type='button' onClick={() => onEditClick(data)}>Edit</button>
      </div>
    </div>
  );
};

export default LessonComponent;
