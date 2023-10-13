import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [formValues, setFormValues] = useState({
    activityName: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    duration: 0
  });

  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("opened");

    const fetchData = async () => {
      const res = await fetch('/api/activities');
      const json = await res.json();
      console.log(json);

      if (res.ok) {
        setRecords(json);
      }
    }

    fetchData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date();
    startTime.setHours(formValues.startHour);
    startTime.setMinutes(formValues.startMin);
    const endTime = new Date();
    endTime.setHours(formValues.endHour);
    endTime.setMinutes(formValues.endMin);
    formValues.duration = Math.floor((endTime - startTime) / 60000); // convert to minutes
    setRecords([...records, formValues]);
    
    const res = await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify(formValues),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error);
    }

    if (res.ok) {
      setError(null);
      console.log("added", json);
      setFormValues({
        activityName: "",
        startHour: "",
        startMin: "",
        endHour: "",
        endMin: "",
        duration: 0
      });
    }
  };

  return (
    <div id="outer">

    <form onSubmit={handleSubmit}>
      <input id="activityInput"
        list='options'
        name="activityName"
        placeholder="Activity"
        value={formValues.activityName}
        onChange={(e) => setFormValues({...formValues, activityName: e.target.value})}
        required autoFocus
      />
      <datalist id='options'>
        <option value='sleep'>sleep</option>
        <option value='eat'>eat</option>
        <option value='gym'>gym</option>
        <option value='exerciseOther'>exercise (other)</option>
        <option value='cook'>cook</option>
        <option value='downtime'>downtime</option>
        <option value='in class'>in class</option>
        <option value='classwork'>classwork</option>
        <option value='prof dev'>professional development</option>
        <option value='social time'>social time</option>
      </datalist>
      <br />
      <div className='timeInputRow'>
        <p>Start Time:</p>
        <span className='hourMin'>
          <input 
            className='timeInput'
            value={formValues.startHour}
            onChange={(e) => setFormValues({...formValues, startHour: e.target.value})
            } 
            name="startHour" 
            pattern="\d{1,2}"
            required/>
            :
          <input
            className='timeInput'
            value={formValues.startMin}
            onChange={(e) => setFormValues({...formValues, startMin: e.target.value})
            } 
            name="startMin" 
            pattern="\d{2}"
            required/>
          </span>
      </div>
      <div className='timeInputRow'>
        <p>End Time:</p>
        <span className='hourMin'>
          <input 
            className='timeInput'
            value={formValues.endHour}
            onChange={(e) => setFormValues({...formValues, endHour: e.target.value})}
            name="endHour"
            pattern="\d{1,2}"
            required/>
            :
          <input 
            className='timeInput'
            value={formValues.endMin}
            onChange={(e) => setFormValues({...formValues, endMin: e.target.value})}
            name="endMin"
            pattern="\d{2}"
            required/>
        </span>
      </div>
      <button type="submit">Add activity</button>
    </form>
    <table id="activitiesTable">
      <tbody>
        <tr><th>Activity</th><th>Start Time</th><th>End Time</th><th>Duration (min)</th></tr>
        {records.map((record, index) => (
          <tr key={index}>
            <td>{record.activityName}</td>
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
