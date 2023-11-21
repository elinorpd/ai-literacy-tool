import React, { useState, useRef, useEffect} from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//   return result;
// };

function App() {
  const [components, setComponents] = useState([]);
  // State to manage the visibility of the Popup
  const [showPopup, setShowPopup] = useState(false);
  // State to manage the form data
  const [formData, setFormData] = useState({});
  const [lessonPlan, setLessonPlan] = useState(null); // new state for the lesson plan
  const [isLoading, setisLoading] = useState(false); // to show a loading indicator during generation
  const outputRef = useRef(null); // Create a ref for the output section

  /**
   * Function to generate a unique ID
   * @returns {string} - The unique ID
   */
  const generateUniqueId = () => {
    return `comp_${uniqueIdCounter++}`;
  };

  const scrollToOutput = () => {
    console.log("scrolling to output")
    console.log(outputRef.current)
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (lessonPlan && outputRef.current) {
      scrollToOutput();
    }
  }, [lessonPlan]); // Depend on lessonPlan to trigger the effect

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  function downloadLessonPlan() {
    const filename = "lesson_plan.txt";
    const blob = new Blob([lessonPlan], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
  
    // Create a link element, use it to download the file and then remove it
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Free up memory when done
    URL.revokeObjectURL(href);
  }  
  
  function downloadPDF() {
    const input = document.getElementById('output'); // The ID of the HTML content you want to download as PDF
  
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // A4 size page in portrait orientation
        const pdfWidth = 210;
        const pdfHeight = 297;
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;

        let finalPdfWidth = pdfWidth;
        let finalPdfHeight = pdfHeight;

        // Adjust dimensions based on aspect ratio
        if (canvasAspectRatio > pdfAspectRatio) {
          // Canvas is wider than PDF page, fit to width
          finalPdfHeight = pdfWidth / canvasAspectRatio;
        } else {
          // Canvas is taller than PDF page, fit to height
          finalPdfWidth = pdfHeight * canvasAspectRatio;
        }

        // Calculate margins to center the image
        const marginLeft = (pdfWidth - finalPdfWidth) / 2;
        const marginTop = (pdfHeight - finalPdfHeight) / 2;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [pdfWidth, pdfHeight]
        });
        pdf.addImage(imgData, 'PNG', marginLeft, marginTop, finalPdfWidth, finalPdfHeight);

        // Add additional text to the PDF
        const additionalText = "AI generated Lesson Plan. Note that AI may make mistakes.";
        pdf.setFontSize(12); // Set font size
        pdf.text(additionalText, 10, pdfHeight - 10); // Position the text at the bottom of the PDF

        pdf.save("lesson_plan.pdf");
      })
      .catch(err => {
        console.error("Could not generate PDF: ", err);
      });
  }  
  
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
  // const onDragEnd = (result) => {
  //   // dropped outside the list
  //   if (!result.destination) {
  //     return;
  //   }

  //   const items = reorder(
  //     components,
  //     result.source.index,
  //     result.destination.index
  //   );

  //   setComponents(items);
  // };

  /**
   * Function to open the Popup and optionally initialize with data
   * @param {Object} data - The data to initialize the Popup with
   */
  // deprecated
  // const handleOpenPopup = () => {
  //   // Reset the form data to empty fields
  //   setFormData({
  //     title: '',
  //     value: '',
  //     editable: false,
  //     id: null, // Ensure no id is set when adding a new component
  //   });
  //   setShowPopup(true);
  // };
  
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
      newComponentProperties.checklist = [
        { label: "Understand the basic concept of AI, its main components, and everyday examples.", checked: false }, 
        { label: "Discuss ethical implications of AI, including issues of privacy, bias, and decision-making.", checked: false },
        // { label: "Analyze the impact of AI on society, culture, and human interaction.", checked: false },
        { label: "Understand the concept of bias in AI and its societal implications.", checked: false },
        { label: "Understand the collaboration between human creativity and AI algorithms.", checked: false },
        // { label: "Explore real-world applications of AI in learning, scientific research and experiments.", checked: false },
        { label: "Recognize the importance of digital privacy and the role of AI in data collection.", checked: false },
        { label: "Understand the basics of safe online behavior in AI-integrated platforms.", checked: false },
        { label: "Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations).", checked: false },
        // { label: "Discuss strategies for maintaining a balance between AI assistance and independent decision-making.", checked: false }
      ];
      newComponentProperties.customObjective = '';
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
      scrollToOutput(); // Scroll to the output section
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
      <div className="columns outer">
        <div className="leftColumn">
          <h2>Edit</h2>
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
          <h2>Preview</h2>
          <hr></hr>
          {components.filter(comp => comp).map((comp) => (
            <ComponentPreview key={comp.id} comp={comp} />
          ))}
          {components.length === 0 && <p>Currently empty. You can use the buttons above to add components to your lesson plan!</p>}
          {components.length > 0 && <hr></hr>}
          <div className='buttons'>
            <button type='submit' onClick={handleSubmit}>Submit</button>
            <button type='button' onClick={handleReset}>Reset</button>
          </div>
        </div>
        
      </div>
      <div className='outer'>
        {/* Render the new lesson plan if it exists */}
      <span id="output"> {/* anything in this span will be in the downloadable PDF */}
      {lessonPlan && (
        <div className="output" ref={outputRef}>
          <h2 className='glp'>Generated Lesson Plan:</h2>
          <div dangerouslySetInnerHTML={createMarkup(lessonPlan)} />
        </div>
      )}
      </span>
      <div className='buttons'>
        <button type='button' onClick={downloadLessonPlan}>Download</button>
        <button type='button' onClick={downloadPDF}>Download PDF</button>   
        </div> 
      </div>

          
    </div>
  );
}

export default App;
