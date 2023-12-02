import React from 'react';
import './ComponentPreview.css'; // Import the corresponding stylesheet

const ComponentPreview = ({ lessonPlan }) => {

  // // Function to render components based on type
  // const renderComponentPreview = (comp) => {
  //   // console.log("comp is:", comp)
  //   if (!comp) {
  //     return null;
  //   }

  //   switch (comp.type) {
  //     case 'Title':
  //     case 'Overview':
  //     case 'Assessment':
  //     case 'Audience':
  //       return (
  //         <>
  //           <div className="titleRow">
  //             <h3>{comp.type}</h3>
  //           </div>
  //           {comp.properties.title && <h4>{comp.properties.title}</h4>}
  //           <p>{comp.properties.value}</p>
  //         </>
  //       );
  //       case 'Objectives':
  //         return (
  //           <>
  //             <div className="titleRow">
  //               <h3>Learning {comp.type}</h3>
  //             </div>
  //             {comp.properties.title && <h4>{comp.properties.title}</h4>}
  //             <p>{comp.properties.value}</p>
  //           </>
  //         );
  //       case 'Activity':
  //         return (
  //           <>
  //             <div className="titleRow">
  //               <h3>{comp.type}: {comp.properties.title}</h3>
  //             </div>
  //             <h5>Description</h5>
  //             <p>{comp.properties.value}</p>
              
  //             {comp.properties.assessment && <h5>Assessment</h5>}
  //             {comp.properties.assessment && <p>{comp.properties.assessment}</p>}
  //           </>
  //         );
  //       case 'AIActivity':
  //         return (
  //           <>
  //             <div className="titleRow">
  //               <h3>AI Literacy Activity</h3>
  //             </div>
  //             <p>Duration: {comp.properties.value} minutes.</p>
  //             {comp.properties.req && <h5>Activity Specifications</h5>}
  //             {comp.properties.req && <p>{comp.properties.req}</p>}
  //           </>
  //         );
  //       case 'Custom':
  //         return (
  //           <>
  //             <div className="titleRow">
  //               <h3>{comp.properties.title}</h3>
  //             </div>
              
  //             <p>{comp.properties.value}</p>
  //           </>
  //         );
  //       case 'Duration':
  //         return (
  //           <>
  //             <div className="titleRow">
  //               <h3>{comp.type}</h3>
  //             </div>
  //             {comp.properties.title && <h4>{comp.properties.title}</h4>}
  //             <p>{comp.properties.value} minutes</p>
  //           </>
  //         );
  //     case 'AIObjectives':
  //       return (
  //         <>
  //           <div className="titleRow">
  //             <h3>AI Literacy Learning Objectives</h3>
  //           </div>
  //           <ul>
  //             {comp.properties.checklist.filter(item => item.checked).map((item, index) => (
  //               <li key={index}>{item.label}</li>
  //             ))}
  //             {comp.properties.customObjective && <li>{comp.properties.customObjective}</li>}
  //           </ul>
  //         </>
  //       );
  //     default:
  //       return <p>Unknown Component Type</p>;
  //   }
  // };

  const previewLessonPlan = (lessonPlan) => {
    if (!lessonPlan) {
      return null;
    }

    return (
      <> <div className="titleRow">
              <h3>Title</h3>
      </div>
      {lessonPlan.title && <h4>{lessonPlan.title}</h4>}
      <div className="titleRow">
              <h3>Duration</h3>
      </div>
      {lessonPlan.duration && <h4>{lessonPlan.duration}</h4>}
      <p> minutes</p>

      {/* For the AI Literacy Objectives */}
      <div className="titleRow">
          <h3>AI Literacy Learning Objectives</h3>
        </div>
        {/* <ul>
          {lessonPlan.ailitobjectives.map((obj, index) => (
            obj.checked && <li key={index}>{obj.label}</li>
          ))}
        </ul> */}

        {/* For the Activity section */}
        <div className="titleRow">
          <h3>Activity</h3>
        </div>
        <p>Title: {lessonPlan.activity.title}</p>
        <p>Duration: {lessonPlan.activity.duration}</p>
        <p>Description: {lessonPlan.activity.description}</p>
        {/* ...other fields of activity */}

      </>
    );
  };

  return (
    <div className="componentPreview">
      {previewLessonPlan(lessonPlan)}
      {/* <div className='previewbuttons'>
        <button type='button' onClick={() => onEditClick}>Edit</button>
        <button type='button' onClick={() => onDeleteClick}>Delete</button>
      </div> */}
    </div>
  );
};

export default ComponentPreview;
