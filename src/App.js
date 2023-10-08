import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [formValues, setFormValues] = useState({
    activity: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    duration: 0
  });

  const [records, setRecords] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const startTime = new Date();
    startTime.setHours(formValues.startHour);
    startTime.setMinutes(formValues.startMin);
    const endTime = new Date();
    endTime.setHours(formValues.endHour);
    endTime.setMinutes(formValues.endMin);
    formValues.duration = (endTime - startTime) / 60000; // convert to minutes
    setRecords([...records, formValues]);
    setFormValues({
      activity: "",
      startHour: "",
      startMin: "",
      endHour: "",
      endMin: "",
      duration: 0
    });
  };

  return (
    <div>

    <form method="post" onSubmit={handleSubmit}>
      <input 
        name="activity"
        placeholder="Activity"
        value={formValues.activity}
        onChange={(e) => setFormValues({...formValues, activity: e.target.value})}
      />
      <br />
      <div>
        Start Time:&nbsp;
        <input 
          className='timeInput'
          value={formValues.startHour}
          onChange={(e) => setFormValues({...formValues, startHour: e.target.value})
          } 
          name="startHour" 
          pattern="\d{1,2}"/>
          :
        <input
          className='timeInput'
          value={formValues.startMin}
          onChange={(e) => setFormValues({...formValues, startMin: e.target.value})
          } 
          name="startMin" 
          pattern="\d{2}"/>
      </div>
      <div>End Time&nbsp;
      <input 
        className='timeInput'
        value={formValues.endHour}
        onChange={(e) => setFormValues({...formValues, endHour: e.target.value})}
        name="endHour"
        pattern="\d{1,2}"/>
        :
      <input 
        className='timeInput'
        value={formValues.endMin}
        onChange={(e) => setFormValues({...formValues, endMin: e.target.value})}
        name="endMin"
        pattern="\d{2}"/>
      </div>
      <button type="submit">Add activity</button>
    </form>
    <table border="1">
      <tbody>
        <tr><th>Activity</th><th>Start Time</th><th>End Time</th><th>Duration (min)</th></tr>
        {records.map((record, index) => (
          <tr key={index}>
            <td>{record.activity}</td>
            <td>{record.startHour}:{record.startMin}</td>
            <td>{record.endHour}:{record.endMin}</td>
            <td>{record.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
    

    </div>
  );
}

export default App;
