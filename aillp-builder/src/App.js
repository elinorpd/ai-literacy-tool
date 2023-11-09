import React, { useState } from 'react';
import './App.css';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LessonComponent from './LessonComponent';
import Popup from './Popup';

// Initialize a counter for unique IDs outside of the component
let uniqueIdCounter = 0;

/**
 * A little function to help us with reordering the result
 * @param {Array} list - The list to reorder
 * @param {number} startIndex - The index of the item to move
 * @param {number} endIndex - The index to move the item to
 * @returns {Array} - The reordered list
 */
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function App() {
  const [components, setComponents] = useState([]);
  // State to manage the visibility of the Popup
  const [showPopup, setShowPopup] = useState(false);
  // State to manage the form data
  const [formData, setFormData] = useState({});
  const [lessonPlan, setLessonPlan] = useState(null); // new state for the lesson plan

  /**
   * Function to generate a unique ID
   * @returns {string} - The unique ID
   */
  const generateUniqueId = () => {
    return `comp_${uniqueIdCounter++}`;
  };

  /**
   * Function to handle the edit click event
   * @param {Object} component - The component to edit
   */
  const handleEditClick = (component) => {
    console.log('Editing component woooi:', component);
    setFormData(component);
    setShowPopup(true);
  };

  /**
   * Function to handle the save form data event
   * @param {Object} data - The form data to save
   */
  const handleSaveFormData = (data) => {
    console.log('Saving form data:', data);
    // If the form data has an id, it's an edit; otherwise, it's a new component
    if (data.id) {
      console.log('Updating existing component');
      setComponents(
        components.map((comp) => (comp.id === data.id ? data : comp))
      );
    } else {
      console.log('Adding new component');
      // Assuming you have a utility to generate a unique ID for new components
      const newComponent = { ...data, id: generateUniqueId() };
      setComponents([...components, newComponent]);
    }
    
    console.log('Form Data Saved:', data);
    // Add here any additional logic you need upon saving the data
    setShowPopup(false); // This will close the popup
  };

  /**
   * Function to handle the drag end event
   * @param {Object} result - The drag result object
   */
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      components,
      result.source.index,
      result.destination.index
    );

    setComponents(items);
  };

  /**
   * Function to open the Popup and optionally initialize with data
   * @param {Object} data - The data to initialize the Popup with
   */
  const handleOpenPopup = (data) => {
    setFormData(data); // You can pass existing data if you are editing an item
    setShowPopup(true);
  };

  /**
   * Function to close the Popup
   */
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  console.log(components);

  // const handleSubmit = async () => {
  //   const jsonData = JSON.stringify(components);
    
  //   fetch('http://localhost:5000/api/submit', { // This URL needs to be the endpoint to your Python script on the server
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: jsonData,
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Success:', data);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  // };  
  const handleSubmit = async () => {
    setLessonPlan(null); // Reset the lesson plan state
    const jsonData = JSON.stringify(components);
    
    // Start using try-catch for async-await pattern
    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
  
      // Update the state with the new lesson plan
      setLessonPlan(data.new_lesson_plan);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleReset = () => {
    // Set the components state back to the initial state, this could be an empty array or object depending on your setup
    setComponents([]);
    // Clear the lesson plan output
    setLessonPlan(null);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Literacy Lesson Plan Builder</h1>
        {/* {components.map((comp, index) => (
          <p key={comp.id}>
            {comp.title}: {comp.editable ? 'Editable' : 'Not Editable'}
          </p>
        ))} */}
        {/* <button onClick={() => handleOpenPopup({})}>Add Component</button> */}
      </header>
      {showPopup && (
        <Popup
          show={showPopup}
          onClose={handleClosePopup}
          onSave={handleSaveFormData}
          data={formData}      
        />
      )}
      <div className="columns">
        <div className="leftColumn">
          {components.map((item, index) => (
            <div key={item.id} className="lessonComponent">
              <LessonComponent data={item} onEditClick={() => handleEditClick(item)} />
            </div>
          ))}
        </div>
        <div className="rightColumn">
          {components.map((comp, index) => (
            <p key={comp.id}>
              {comp.title}: {comp.editable ? 'Editable' : 'Not Editable'}
            </p>
          ))}
          <div className='buttons'><button type='button' onClick={() => handleOpenPopup({})}>Add Component</button></div>
          
          <div className='buttons'>
        <button type='submit' onClick={handleSubmit}>Submit</button>
        <button type='button' onClick={handleReset}>Reset</button>
      </div>
        </div>
        
      </div>
      {/* Render the new lesson plan if it exists */}
      {lessonPlan && (
        <div className="output">
          <h2>Generated Lesson Plan:</h2>
          <p>{lessonPlan}</p>
        </div>
      )}
    </div>
  );
}

export default App;
