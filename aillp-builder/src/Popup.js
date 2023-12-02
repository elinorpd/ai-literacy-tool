import React, { useState, useEffect } from 'react';
import './Popup.css'; // You will need to create a corresponding CSS file for styling.
// import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';

const Popup = ({ show, onClose, onSave, data, isLoading }) => {
  // const [title, setTitle] = useState(data?.title || '');
  // const [value, setValue] = useState(data?.value || '');
  // const [editable, setEditable] = useState(data?.editable || false);
  const [id, setId] = useState(data?.id || null); // use null to signify no id if new component
  const [properties, setProperties] = useState(data || {
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
  });
  
  // allow close popup when clicking escape char
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) { // 27 is the key code for the Escape key
        onClose();
      }
    };
  
    window.addEventListener('keydown', handleEsc);
  
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]); // Add onClose to the dependency array
  

  useEffect(() => {
    console.log('Data received:', data);
    setProperties(data || {
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
        { label: "Evaluate the reliability of AI-driven content (e.g., deepfakes, automated articles, hallucinations).", checked: false }
      ],
      customobjective: '',
      activity: {
        title: '',
        duration: '',
        description: '',
        alternatives: false,
        assessment: false,
      },
    });  
    setId(data?.id || null); // Reset ID when opening for a new component
  }, [data]);

  // for debugging
  // useEffect(() => {
  //   console.log('Properties changed:', properties);
  // }, [properties]);  

  const renderEditableCheckbox = () => {
    if (!properties) {
      return null; // or some default UI
    }
  
    return (
      <div className='checkboxItem'>
        <input
          type="checkbox"
          id="editable"
          checked={properties.editable || false}
          onChange={handleEditableChange}
        />
        <label htmlFor="editable">Editable: Check this if you'd like the AI to modify or add anything in this activity.</label>  
      </div>
    );
  };
  
  const renderAllFields = () => (
    <>
    <label htmlFor="title"><h5>Lesson Title</h5></label>
      <input
        type="text"
        id="title"
        value={properties.title || ''}
        onChange={handleChange}
      />
      <label htmlFor="duration"><h5>Duration (mins)</h5></label>
      <input
        type="number"
        id="duration"
        value={properties.duration || ''}
        onChange={handleChange}
      />
    <label htmlFor="overview"><h5>Overview</h5></label>
    <p>Overview or description of the lesson.</p>
    <textarea
      id="overview"
      value={properties.overview || ''}
        onChange={handleChange}
    />
    <label htmlFor="objectives"><h5>Learning Objectives</h5></label>
      <p align="left">Overall learning objectives for the lesson. Can be in paragraph form or a list.</p>
      <textarea
        id="objectives"
        value={properties.objectives || ''}
          onChange={handleChange}
      />
    <div className="ailitobj">
    <label><h5>AI Literacy Learning Objectives</h5></label>
    <p align="left">Select the learning objectives that you would like the AI to incorporate into your lesson plan in the form of an
    AI Literacy activity. You may choose any of the following suggestions or write your own custom ones!</p>
    {properties.ailitobjectives.map((item, index) => (
      <div key={index} className="checkboxItem">
        <div key={`checklist-item-${index}-${item.checked}`}>
          <input
            type="checkbox"
            id={`objective${index}`}
            checked={item.checked || false}
            onChange={(e) => handleChecklistChange(e, index)}
          />
          <label htmlFor={`objective${index}`}>{item.label}</label>
        </div>
      </div>
    ))}
    <br/>
      <div className="customObjectiveRow">
        <label htmlFor="customobjective">Custom Objective:</label>
        <input
          type="text"
          id="customobjective"
          value={properties.customobjective || ''}
          onChange={handleChange}
        />
      </div>
  </div>
  <div className='ailitobj'>
      <label htmlFor="title"><h5>Activity</h5></label>
      <p align="left">Input an activity for the lesson. If you would like the AI to edit this, please select the "editable" checkbox below. 
      This works best if you give some instruction within the description for where you'd like the AI to edit. 
      For example in the description, you could describe your existing activity and write "please incorporate AI Literacy objectives into 
      this activity where students work in groups of 3" or "write me a 4 question multiple choice quiz to assess students' learning from this activity" etc.
      The more specific you are, the better the AI will be able to edit your activity.
      </p>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="activity.title"
        value={properties.activity.title || ''}
        onChange={handleChange}
      />
      <label htmlFor="duration">Duration (mins)</label>
      <input
        type="number"
        id="activity.duration"
        value={properties.activity.duration || ''}
        onChange={handleChange}
      />
      <label htmlFor="description">Description (including materials or other specifications)</label>
      <textarea
        id="activity.description"
        value={properties.activity.description || ''}
        onChange={handleChange}
      />
      <div className="checkboxItem">
        <input
          type="checkbox"
          id="activity.alternatives"
          checked={properties.activity.alternatives || false}
          onChange={handleChange}
        />
        <label htmlFor="alternatives">Activity Alternatives: Check this if you'd like the AI to create versions of the activity to accommodate lower and higher level students in the class.</label>
        </div>
      <div className="checkboxItem">
        <input
          type="checkbox"
          id="activity.assessment"
          checked={properties.activity.assessment || false}
          onChange={handleChange}
        />
        <label htmlFor="assessment">Assessment: Check this if you'd like the AI to create a short assessment for this activity.</label>
      </div>
    </div>
    </>
  );


  // 6.1. AI Activity
  const renderAIActivityFields = () => (
    <>
    <div className='ailitobj'>
    <h5>AI Activity</h5>
    <p align="left">The AI will craft an AI Literacy-related activity tailored to your lesson. Begin by specifying the duration of the activity, if desired, and outline any particular specifications or requirements in the text box. The resulting activity will always include a short assessment at the end to gauge students' learning outcomes.<br/><br/>
    Be specific for optimal results. For example, request an offline activity without the use of technology, ask for a debate-style activity, or specify that the assessment should be in multiple choice format.   
      </p>
      <label htmlFor="value">Duration (mins)</label>
      <input
        type="number"
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      <label htmlFor="req">Requirements or specifications (optional)</label>
      <textarea
        id="req"
        value={properties.req || ''}
        onChange={handleReqChange}
      />
      </div>
    </>
  );

  // 8. Custom Component
  const renderCustomFields = () => (
    <>
      <label htmlFor="title">Custom Component Title</label>
      <input
        type="text"
        id="title"
        value={properties.title || ''}
        onChange={handleTitleChange}
      />
      <label htmlFor="value">Custom Description</label>
      <textarea
        id="value"
        value={properties.value || ''}
        onChange={handleValueChange}
      />
      {renderEditableCheckbox()}
    </>
  );

  // helper functions to handle changes in the forms 
  const handleChecklistChange = (e, index) => {
    // Update the specific checklist item in the ailitobjectives array
    const updatedAilitObjectives = properties.ailitobjectives.map((item, i) => {
      if (i === index) {
        return { ...item, checked: e.target.checked };
      }
      return item;
    });
  
    // Update the state with the new ailitobjectives array
    setProperties({ ...properties, ailitobjectives: updatedAilitObjectives });
  };  

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    // console.log(`Changing ${id} to ${value}`);

    // Handle changes for nested properties in 'activity'
    if (id.startsWith("activity.")) {
      const activityKey = id.split(".")[1];
      setProperties(prevProps => ({
        ...prevProps,
        activity: {
          ...prevProps.activity,
          [activityKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle changes for top-level properties
      setProperties(prevProps => ({
        ...prevProps,
        [id]: value
      }));
    }

  };  

  const handleTitleChange = (e) => {
    setProperties({ ...properties, title: e.target.value });
  };
  
  const handleValueChange = (e) => {
    setProperties({ ...properties, value: e.target.value });
  };

  
  const handleReqChange = (e) => {
    setProperties({ ...properties, req: e.target.value });
  };

  const handleEditableChange = (e) => {
    setProperties({ ...properties, editable: e.target.checked });
  };

  // Function to determine which form fields to render
  const renderFormFields = () => {
    // if newlessonplan then render all fields
    // data = formdata from app.js
    // console.log(data)
    switch (properties.type) {
      // case 'Title':
      //   return renderTitleFields();
      // case 'Duration':
      //   return renderDurationFields();
      // case 'Overview':
      //   return renderOverviewFields();
      // case 'Assessment':
      //   return renderAssessmentFields();
      // case 'Objectives':
      //   return renderObjectivesFields();
      // case 'AIObjectives':
      //   return renderAIObjectivesFields();
      // case 'Activity':
      //   return renderActivityFields();
      // case 'AIActivity':
      //   return renderAIActivityFields();
      // case 'Audience':
      //   return renderAudienceFields();
      // case 'Custom':
      //   return renderCustomFields();
      case 'newLessonPlan':
        // console.log("properties", properties)
        return renderAllFields();
      default:
        return <p>Unknown component type</p>;
    }
  };
  
  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Call the onSave prop with the updated lesson plan data
    onSave(properties); // properties should contain the updated lesson plan data
  };
  

  // If isLoading is true, render the loading message instead of the form
  if (isLoading) {
    return (
      <div className="popup">
        <div className="popup-content">
          <p>Please wait while the AI generates your lesson plan...</p>
        </div>
      </div>
    );
  }
  
  // Otherwise, render the form
  return (
    <div className="popup">
      <div className="popup-content">
      <button className="close-button" onClick={onClose}>&times;</button>
        <form onSubmit={handleSubmit}>
          {renderFormFields()}  {/* This will dynamically render the correct fields based on the type */}
          <div className="buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Popup;
