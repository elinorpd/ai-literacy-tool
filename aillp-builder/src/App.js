import React, { useState, useRef, useEffect} from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import './App.css';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import LessonComponent from './LessonComponent';
import Popup from './Popup';
import ComponentPreview from './ComponentPreview'; // Adjust the path as necessary

// Initialize a counter for unique IDs outside of the component
let uniqueIdCounter = 0;



function App() {
  const [components, setComponents] = useState([]);
  // State to manage the visibility of the Popup
  const [showPopup, setShowPopup] = useState(false);
  // State to manage the form data
  const [formData, setFormData] = useState({});
  const [lessonPlan, setlessonPlan] = useState({
    type: 'newLessonPlan',
    title: '',
    duration: '',
    overview: '',
    audience: '',
    objectives: '',
    ailitobjectives: [
      { label: "Understand the basic concept of AI, its main components, and everyday examples.", checked: false }, 
      { label: "Discuss ethical implications of AI, including issues of privacy, bias, and decision-making.", checked: false },
      { label: "Understand the concept of bias in AI and its societal implications.", checked: false },
      { label: "Understand the collaboration between human creativity and AI algorithms.", checked: false },
      { label: "Recognize the importance of digital privacy and the role of AI in data collection.", checked: false },
      { label: "Understand the basics of safe online behavior in AI-integrated platforms.", checked: false },
      { label: "Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations).", checked: false },
    ],
    customobjective: '',
    activity: {
      title: '',
      duration: '',
      description: '',
      alternatives: false,
      assessment: false,
    },
    aiactivity: {
      duration: '',
      req: '',
      alternatives: false,
      assessment: false,
    },
  }); // current (input) lesson plan
  const [outputLessonPlan, setOutputLessonPlan] = useState(null); // new state for the output lesson plan
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
    if (outputLessonPlan && outputRef.current) {
      scrollToOutput();
    }
  }, [outputLessonPlan]); // Depend on lessonPlan to trigger the effect

  useEffect(() => {
    console.log('formData updated:', formData);
  }, [formData]);
  
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  async function downloadLessonPlan() {
    try {
      // change the url to convert-to-text if you want to download plain text
        const response = await fetch('http://localhost:5000/convert-to-docx', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: outputLessonPlan, // Send the lesson plan HTML content
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const href = URL.createObjectURL(blob);

        // Create a link element, use it to download the file and then remove it
        const link = document.createElement("a");
        link.href = href;
        link.download = "lesson_plan.docx"; // change .txt if converting to plain text
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Free up memory when done
        URL.revokeObjectURL(href);
    } catch (error) {
        console.error('Error downloading docx file:', error);
    }
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
  const handleEditClick = () => {
    setShowPopup(true);
  };

  /**
   * Function to handle the save form data event
   * @param {Object} data - The form data to save
   */
  const handleSaveFormData = (updatedLessonPlan) => {
    console.log('Saving form data:', updatedLessonPlan);
  
    // Update the state with the new lesson plan
    setlessonPlan(updatedLessonPlan);
  
    setShowPopup(false); // Close the popup after saving the data
  };
  
  const getStartedClick = () => {
    console.log('Get Started Clicked');
    // initalize components
    let newLessonPlan = {
      type: 'newLessonPlan',
      title: '',
      duration: '',
      overview: '',
      audience: '',
      objectives: '',
      ailitobjectives: [
        { label: "Understand the basic concept of AI, its main components, and everyday examples.", checked: false }, 
        { label: "Discuss ethical implications of AI, including issues of privacy, bias, and decision-making.", checked: false },
        { label: "Understand the concept of bias in AI and its societal implications.", checked: false },
        { label: "Understand the collaboration between human creativity and AI algorithms.", checked: false },
        { label: "Recognize the importance of digital privacy and the role of AI in data collection.", checked: false },
        { label: "Understand the basics of safe online behavior in AI-integrated platforms.", checked: false },
        { label: "Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations).", checked: false },
      ],
      customobjective: '',
      activity: {
        title: '',
        duration: '',
        description: '',
        alternatives: false,
        assessment: false,
      },
    }; 
    console.log('newLessonPlan:', newLessonPlan)
    // Set the form data for a new component
    setlessonPlan(newLessonPlan);
    // console.log('formData:', formData)

    setShowPopup(true);
  }; 

  const lessonPlanIsEmpty = (plan) => {
    // Check each field of the lesson plan
    return (
      !plan.title &&
      !plan.duration &&
      !plan.overview &&
      !plan.audience &&
      !plan.objectives &&
      !plan.customobjective &&
      plan.ailitobjectives.every(obj => !obj.checked) &&
      // Check for the activity structure
      !plan.activity.title &&
      !plan.activity.duration &&
      !plan.activity.description &&
      !plan.activity.alternatives &&
      !plan.activity.assessment &&
      !plan.aiactivity.title &&
      !plan.aiactivity.duration &&
      !plan.aiactivity.req &&
      !plan.aiactivity.alternatives &&
      !plan.aiactivity.assessment
    );
  };
  
  /**
   * Function to close the Popup
   */
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmitNewLessonPlan = async () => {
    console.log('Submitting new lesson plan:', lessonPlan);
    setOutputLessonPlan(null); // Reset the lesson plan state
    setisLoading(true); // Start loading
    const jsonData = JSON.stringify(lessonPlan);


    const appUrl = 'http://localhost:5000';

    // Start using try-catch for async-await pattern
    try {
      const response = await fetch(`${appUrl}/api/submit`, {
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
      setOutputLessonPlan(data.new_lesson_plan);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setisLoading(false); // End loading
      scrollToOutput(); // Scroll to the output section
    }
  };


  const handleSubmit = async () => {
    setOutputLessonPlan(null); // Reset the lesson plan state
    setisLoading(true); // Start loading
    const jsonData = JSON.stringify(components);

   
    //PROD appURL
    //'https://ai-lesson-planner-cd8f89bac323.herokuapp.com/';

    //LOCAL appURL
    // 'http://localhost:5000';

    const appUrl = 'http://localhost:5000';
    
    // Start using try-catch for async-await pattern
    try {
      const response = await fetch(`${appUrl}/api/submit`, {
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
      setOutputLessonPlan(data.new_lesson_plan);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setisLoading(false); // End loading
      scrollToOutput(); // Scroll to the output section
    }
  };
  
  const handleReset = () => {
    // Set the components state back to the initial state, this could be an empty array or object depending on your setup
    setlessonPlan({
      type: 'newLessonPlan',
      title: '',
      duration: '',
      overview: '',
      audience: '',
      objectives: '',
      ailitobjectives: [
        { label: "Understand the basic concept of AI, its main components, and everyday examples.", checked: false }, 
        { label: "Discuss ethical implications of AI, including issues of privacy, bias, and decision-making.", checked: false },
        { label: "Understand the concept of bias in AI and its societal implications.", checked: false },
        { label: "Understand the collaboration between human creativity and AI algorithms.", checked: false },
        { label: "Recognize the importance of digital privacy and the role of AI in data collection.", checked: false },
        { label: "Understand the basics of safe online behavior in AI-integrated platforms.", checked: false },
        { label: "Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations).", checked: false },
      ],
      customobjective: '',
      activity: {
        title: '',
        duration: '',
        description: '',
        alternatives: false,
        assessment: false,
      },
      aiactivity: {
        duration: '',
        req: '',
        alternatives: false,
        assessment: false,
      },
    });
    // Clear the lesson plan output
    setOutputLessonPlan(null);
  };

  
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Lesson Plan Builder</h1>
        <h3>A GPT-4 powered tool for middle school educators to improve and incorporate AI literacy into lesson plans.</h3>
        <div className='buttons'>
          <button type='button' className='start-button' onClick={handleEditClick}>Get Started</button>
        </div>
      </header>
      <Popup
          show={showPopup || isLoading} // Show popup when it needs to be shown or when loading
          isLoading={isLoading}
          onClose={handleClosePopup}
          onSave={handleSaveFormData}
          data={lessonPlan}      
        />
      <div className="columns outer">
        <div className="rightColumn">
          <div className="preview-header">
            <h2>Lesson Plan Preview</h2>
            {lessonPlan &&
              <>
              <div className='buttons'>
              <button type='button' onClick={handleEditClick}>Edit Lesson Plan</button>
              <button type='button' onClick={handleReset}>Reset</button>
            </div>
            </>
            }
          </div>
          <hr></hr>
          {!lessonPlanIsEmpty(lessonPlan) ? (
            <ComponentPreview 
            lessonPlan={lessonPlan} 
            />
          ) : (
            <p>Currently empty. Create your lesson plan using the button above!</p> 
          )}
          {lessonPlan &&
            <>
            <hr></hr>
            <div className='buttons'>
            <button type='submit' onClick={handleSubmitNewLessonPlan}>Submit</button>
          </div>
          </>
          }
          
        </div>
      </div>
      <div className='outer'>
        {/* Render the new lesson plan if it exists */}
      <span id="output"> {/* anything in this span will be in the downloadable PDF */}
      {outputLessonPlan && (
        <div className="output" ref={outputRef}>
          <h2 className='glp'>Generated Lesson Plan:</h2>
          <div dangerouslySetInnerHTML={createMarkup(outputLessonPlan)} />
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
