import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Popup.css'; // You will need to create a corresponding CSS file for styling.
// import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';

const Popup = ({ show, onClose, onSave, data, isLoading }) => {
  const [activityType, setActivityType] = useState(null); // 'aiLiteracy' or 'normal'
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
    aiactivity: {
      duration: '',
      req: '',
      alternatives: false,
      assessment: false,
    },
  });
  
  function openNewTab(index) {
    const url = `info#AILLO${index + 1}`;
    const win = window.open(url, '_blank');
    if (win != null) {
      win.focus();
    }
  }

  const navigate = useNavigate();

  const handleLabelClick = (index) => {

    // Navigate to the specified element in the 'info' page
    const elementId = `AILLO${index + 1}`;
    navigate(`/info#${elementId}`);
  };

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
      aiactivity: {
        duration: '',
        req: '',
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

  const handleActivityTypeSelection = (type) => {
    setActivityType(type);
  
    if (type === 'aiLiteracy') {
      // Clear normal activity fields
      setProperties(prevProps => ({
        ...prevProps,
        activity: {
          title: '',
          duration: '',
          description: '',
          alternatives: false,
          assessment: false,
        }
      }));
    } else if (type === 'normal') {
      // Clear AI Literacy objectives and AI activity fields
      setProperties(prevProps => ({
        ...prevProps,
        ailitobjectives: prevProps.ailitobjectives.map(obj => ({ ...obj, checked: false })),
        customobjective: '',
        aiactivity: {
          duration: '',
          req: '',
          alternatives: false,
          assessment: false,
        }
      }));
    }
  };
  
  
  const renderAllFields = () => (
    <>
    <label htmlFor="title"><h3>Lesson Title</h3></label>
      <input
        type="text"
        id="title"
        value={properties.title || ''}
        onChange={handleChange}
      />
      <label htmlFor="duration"><h3>Duration (mins)</h3></label>
      <input
        type="number"
        id="duration"
        value={properties.duration || ''}
        onChange={handleChange}
      />
      <label htmlFor="audience"><h3>Target Audience</h3></label>
      <input
        type="text"
        id="audience"
        value={properties.audience || ''}
        onChange={handleChange}
      />
    <label htmlFor="overview"><h3>Overview</h3></label>
    <p>Overview or description of the lesson.</p>
    <textarea
      id="overview"
      value={properties.overview || ''}
        onChange={handleChange}
    />
    <label htmlFor="objectives"><h3>Learning Objectives</h3></label>
      <p align="left">Overall learning objectives for the lesson. Can be in paragraph form or a list.</p>
      <textarea
        id="objectives"
        value={properties.objectives || ''}
          onChange={handleChange}
      />
      <p>Would you like to add an AI Literacy activity to the lesson or proceed with a normal activity?</p>
      <div className='activity-selection-buttons'>
        <button
          type='button'
          onClick={() => handleActivityTypeSelection('aiLiteracy')}
          className={activityType === 'aiLiteracy' ? 'selected' : ''}
        >
          AI Literacy Activity
        </button>
        <button
          type='button'
          onClick={() => handleActivityTypeSelection('normal')}
          className={activityType === 'normal' ? 'selected' : ''}
        >
          Activity
        </button>
      </div>
      {/* Render AI Literacy or Activity fields based on selection */}
      {activityType === 'aiLiteracy' && renderAILiteracyFields()}
      {activityType === 'normal' && renderActivityFields()}

    </>
  );


  const renderActivityFields = () => (
    <>
    <div className='ailitobj'>
      <label htmlFor="title"><h4>Activity</h4></label>
      <p align="left">Input an existing activity for the lesson that you would like the AI to modify. 
      This works best if you give some instruction within the description for where you'd like the AI to edit.
      <b>The more specific you are, the better the AI will be able to edit your activity.</b>
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
        placeholder='This text is a placeholder which you could edit. You could describe your existing activity like "incorporate AI Literacy objectives into this activity where students work in groups of 3".'
      />
      <div className="checkboxItem">
        <input
          type="checkbox"
          id="activity.alternatives"
          checked={properties.activity.alternatives || false}
          onChange={handleChange}
        />
        <label htmlFor="alternatives"><b>Activity Alternatives: </b>Check this if you'd like the AI to create versions of the activity to accommodate lower and higher level students in the class.</label>
        </div>
      <div className="checkboxItem">
        <input
          type="checkbox"
          id="activity.assessment"
          checked={properties.activity.assessment || false}
          onChange={handleChange}
        />
        <label htmlFor="assessment"><b>Assessment:</b> Check this if you'd like the AI to create a short assessment for this activity.</label>
      </div>
    </div>
    </>
  );

  const renderAILiteracyFields = () => (
    <>
    <div className="ailitobj">
      <label><h4>AI Literacy Learning Objectives</h4></label>
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
            {/* <label htmlFor={`objective${index}`}><a href='info#AILLO1' target='_blank'>{item.label}</a></label> */}
            {/* <label htmlFor={`objective${index}`}  onClick={() => openNewTab(index)} className="blueUnderlined"> */}
            <label htmlFor={`objective${index}`}>
              <Link smooth to={`/info#AILLO${index + 1}`} target="_blank" rel="noopener noreferrer">
              {index+1}.{item.label}
              </Link>
            </label>
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
      <h4>AI Activity</h4>
      <p align="left">The AI will craft an AI Literacy-related activity tailored to your lesson. Begin by specifying the <b>duration</b> of the activity, if desired, and outline any particular specifications or requirements in the text box.<br/><br/>
      <b>Be specific for optimal results.</b> 
        </p>
        <label htmlFor="duration">Duration (mins)</label>
        <input
          type="number"
          id="aiactivity.duration"
          value={properties.aiactivity.duration || ''}
          onChange={handleChange}
        />
        <label htmlFor="req">Requirements or specifications (optional)</label>
        <textarea
          id="aiactivity.req"
          value={properties.aiactivity.req || ''}
          onChange={handleChange}
          placeholder='This text is a placeholder which you could edit. Request an offline activity without the use of technology, ask for a debate-style activity.'
        />
        <div className="checkboxItem">
          <input
            type="checkbox"
            id="aiactivity.alternatives"
            checked={properties.aiactivity.alternatives || false}
            onChange={handleChange}
          />
          <label htmlFor="alternatives"><b>Activity Alternatives:</b> Check this if you would like the AI to create versions of the activity to accommodate lower and higher level students in the class.</label>
          </div>
        <div className="checkboxItem">
          <input
            type="checkbox"
            id="aiactivity.assessment"
            checked={properties.aiactivity.assessment || false}
            onChange={handleChange}
          />
          <label htmlFor="assessment"><b>Assessment:</b> Check this if you would like the AI to create a short assessment for this activity to gauge students' learning outcomes.</label>
        </div>
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
      {/* {renderEditableCheckbox()} */}
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

    // Handle changes for nested properties in 'ai/activity'
    if (id.startsWith("activity.") || id.startsWith("aiactivity.")) {
      const parts = id.split(".");
      const key = parts[0]; // 'activity' or 'aiactivity'
      const property = parts[1];
      
      setProperties(prevProps => ({
        ...prevProps,
        [key]: {
          ...prevProps[key],
          [property]: type === 'checkbox' ? checked : value
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
      <div className="popup-wrapper">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="popup-content">
          <form onSubmit={handleSubmit}>
            {renderAllFields()}
            <div className="buttons">
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Popup;
