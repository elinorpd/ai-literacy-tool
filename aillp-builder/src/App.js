import React, { useState } from 'react';
import './App.css';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LessonComponent from './LessonComponent';
import Popup from './Popup';
import ComponentPreview from './ComponentPreview'; // Adjust the path as necessary

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
  const [isLoading, setisLoading] = useState(false); // to show a loading indicator during generation

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
  
    // Check if we are editing an existing component or adding a new one
    if (data.id && components.some(comp => comp.id === data.id)) {
      // Existing component: Update
      console.log('Updating existing component');
      setComponents(components.map(comp => comp.id === data.id ? data : comp));
    } else {
      // New component: Add
      console.log('Adding new component');
      const newComponent = { ...data, id: generateUniqueId() };
      setComponents([...components, newComponent]);
    }
  
    console.log('Form Data Saved:', data);
    setShowPopup(false); // Close the popup after saving the data
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
  const handleOpenPopup = () => {
    // Reset the form data to empty fields
    setFormData({
      title: '',
      value: '',
      editable: false,
      id: null, // Ensure no id is set when adding a new component
    });
    setShowPopup(true);
  };
  
  const handleAddComponentClick = (componentType) => {
    let newComponentProperties = {
      editable: true, // Ensure this is always set
    };
    
    // Initializing properties based on component type
    if (['Title', 'Duration', 'Overview', 'Objectives', 'Audience'].includes(componentType)) {
      newComponentProperties.value = '';
    } else if (['Activity', 'Custom'].includes(componentType)) {
      newComponentProperties = { ...newComponentProperties, title: '', value: '' };
    } else if (componentType === 'AIObjectives') {
      newComponentProperties.checklist = [{ label: "Placeholder 1", checked: false }, { label: "Placeholder 2", checked: false }];
    }  
  
    // Set the form data for a new component
    setFormData({
      id: null, // null signifies a new component
      type: componentType,
      properties: newComponentProperties,
    });
  
    // Open the popup
    setShowPopup(true);
  };  

  /**
   * Function to close the Popup
   */
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  console.log(components);

  const handleSubmit = async () => {
    setLessonPlan(null); // Reset the lesson plan state
    setisLoading(true); // Start loading
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
    } finally {
      setisLoading(false); // End loading
    }
  };
  
  const handleReset = () => {
    // Set the components state back to the initial state, this could be an empty array or object depending on your setup
    setComponents([]);
    // Clear the lesson plan output
    setLessonPlan(null);
  };

  const handleDeleteComponent = (idToDelete) => {
    setComponents(components.filter(component => component.id !== idToDelete));
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
        <div className='buttons'>
          <button type='button' onClick={() => handleAddComponentClick('Title')}>Lesson Title</button>
          <button type='button' onClick={() => handleAddComponentClick('Duration')}>Duration</button>
          <button type='button' onClick={() => handleAddComponentClick('Overview')}>Lesson Overview</button>
          <button type='button' onClick={() => handleAddComponentClick('Objectives')}>Learning Objectives</button>
          <button type='button' onClick={() => handleAddComponentClick('AIObjectives')}>AI Literacy Learning Objectives</button>
          <button type='button' onClick={() => handleAddComponentClick('Activity')}>Activity</button>
          <button type='button' onClick={() => handleAddComponentClick('Audience')}>Target Audience</button>
          <button type='button' onClick={() => handleAddComponentClick('Custom')}>Custom Component</button>
        </div>
      </header>
      {showPopup && (
        <Popup
          show={showPopup}
          onClose={handleClosePopup}
          onSave={handleSaveFormData}
          data={formData}      
        />
      )}
      {/* {isLoading && <Popup message="Please wait while the AI generates your lesson plan..." />} */}
      <Popup
          show={showPopup || isLoading} // Show popup when it needs to be shown or when loading
          isLoading={isLoading}
          onClose={handleClosePopup}
          onSave={handleSaveFormData}
          data={formData}      
        />
      <div className="columns">
        <div className="leftColumn">
          {components.map((item, index) => (
            <div key={item.id} className="lessonComponent">
              <LessonComponent 
              data={item} 
              onEditClick={() => handleEditClick(item)} 
              onDeleteClick={() => handleDeleteComponent(item.id)}
              />
            </div>
          ))}
        </div>
        <div className="rightColumn">
          <h2>Lesson Plan Preview</h2>
          <hr></hr>
          {components.filter(comp => comp).map((comp) => (
            <ComponentPreview key={comp.id} comp={comp} />
          ))}
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
          {lessonPlan}
        </div>
      )}
    </div>
  );
}

export default App;
