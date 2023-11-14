// // LessonModal.js
// import React, { useState } from 'react';

// const LessonModal = ({ show, onSave, onClose, data }) => {
//   const [title, setTitle] = useState(data?.title || '');
//   const [value, setValue] = useState(data?.value || '');
//   const [editable, setEditable] = useState(data?.editable || false);

//   if (!show) {
//     return null;
//   }

//   const handleSave = () => {
//     onSave({ title, value, editable });
//     onClose();
//   };

//   return (
//     <div>
//       <label>Title:</label>
//       <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <label>Value:</label>
//       <textarea value={value} onChange={(e) => setValue(e.target.value)} />
//       <label>Editable:</label>
//       <input type="checkbox" checked={editable} onChange={(e) => setEditable(e.target.checked)} />
//       <button onClick={handleSave}>Save</button>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default LessonModal;
