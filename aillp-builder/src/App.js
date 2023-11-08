import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LessonComponent from './LessonComponent';
import Popup from './Popup';

// Initialize a counter for unique IDs outside of the component
let uniqueIdCounter = 0;

// A little function to help us with reordering the result
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
  

  // Function to generate a unique ID
  const generateUniqueId = () => {
    return `comp_${uniqueIdCounter++}`;
  };


  const handleEditClick = (component) => {
    setFormData(component);
    setShowPopup(true);
  };

  const handleSaveFormData = (data) => {
    // If the form data has an id, it's an edit; otherwise, it's a new component
    if (data.id) {
      setComponents(
        components.map((comp) => (comp.id === data.id ? data : comp))
      );
    } else {
      // Assuming you have a utility to generate a unique ID for new components
      const newComponent = { ...data, id: generateUniqueId() };
      setComponents([...components, newComponent]);
    }
    
    console.log('Form Data Saved:', data);
    // Add here any additional logic you need upon saving the data
    setShowPopup(false); // This will close the popup
  };
  

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

  // Function to open the Popup and optionally initialize with data
  const handleOpenPopup = (data) => {
    setFormData(data); // You can pass existing data if you are editing an item
    setShowPopup(true);
  };

  // Function to close the Popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Lesson Plan Builder</h1>
        {components.map((comp, index) => (
          <p key={comp.id}>
            {comp.title}: {comp.editable ? 'Editable' : 'Not Editable'}
          </p>
        ))}
        <button onClick={() => handleOpenPopup({})}>Add Component</button>
      </header>
      {showPopup && (
        <Popup
          show={showPopup}
          onClose={handleClosePopup}
          onSave={handleSaveFormData}
          data={formData}      
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="componentsDroppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
            >
              {components.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >
                      <LessonComponent data={item} onEditClick={() => handleEditClick(item)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
