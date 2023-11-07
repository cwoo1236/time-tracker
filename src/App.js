import { useState, useEffect } from 'react';
import ActivityDetails from './components/ActivityDetails';
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Legend } from 'recharts';
import { useActivitiesContext } from './hooks/useActivitiesContext';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../node_modules/bootstrap/js/dist/dropdown.js"
function App() {
  // Hooks
  const { activities, timeTotals, dispatch } = useActivitiesContext();
  const [formValues, setFormValues] = useState({
    activityName: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    duration: 0,
    activityDate: new Date()
  });

  // On page load
  useEffect(() => {
    const fetchData = async () => {
      const activitiesRes = await fetch('/api/activities');
      let activitiesJson = await activitiesRes.json();

      if (!activitiesRes.ok) {
        console.log("Failed to GET activities from db.");
        activitiesJson = null;
      }

      const timeTotalsRes = await fetch('/api/timeTotals/');
      let timeTotalsJson = await timeTotalsRes.json();

      if (!timeTotalsRes.ok) {
        console.log("Failed to GET time totals from db.");
        timeTotalsJson = null;
      }
      
      const payload = { activities: activitiesJson, timeTotals: timeTotalsJson };
      dispatch({type: 'SET_ACTIVITIES', payload: payload});
      console.log("Dispatched SET_ACTIVITIES:", payload);
    }
    fetchData();
  }, [dispatch]);

  // Submit Activity
  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date();
    const endTime = new Date();

    if (Number(formValues.startHour) > Number(formValues.endHour)) {
      endTime.setHours(Number(formValues.endHour) + 12);
    } else {
      endTime.setHours(formValues.endHour);
    }
    startTime.setHours(formValues.startHour);
    startTime.setMinutes(formValues.startMin);
    endTime.setMinutes(formValues.endMin);
    formValues.duration = Math.floor((endTime - startTime) / 60000); // convert to minutes
    formValues.activityDate.setHours(formValues.startHour);
    formValues.activityDate.setMinutes(formValues.startMin);
    const postRes = await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify(formValues),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await postRes.json();


    const res = await fetch('/api/timeTotals/' + formValues.activityName, {
      method: 'PATCH',
      body: JSON.stringify( {$inc: {value: formValues.duration}} ),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json2 = await res.json();

    if (!res.ok) {
      console.log(`Failed to update ${formValues.activityName}'s timeTotal.`);
    } else {
      console.log(`Updated ${formValues.activityName}'s timeTotal.`, json);
    }

    if (!postRes.ok) {
      console.log("Failed to POST activity", json.error);
    } else {
      let payload = { activities: json, timeTotalsParts: { activityName: formValues.activityName, duration: formValues.duration }};
      dispatch({ type: 'CREATE_ACTIVITY', payload: payload });
      setFormValues({
        activityName: "",
        startHour: "",
        startMin: "",
        endHour: "",
        endMin: "",
        duration: 0,
        activityDate: new Date()
      });
    }
  };

  return (
    <div id="outer">
      <form className='activityForm' onSubmit={handleSubmit}>
        <div className='dropdown'>
          <button type='button' className='btn btn-primary dropdown-toggle' data-bs-toggle="dropdown">Activity: {formValues.activityName ? formValues.activityName : "None"}</button>
          <ul className='dropdown-menu'>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "eat"})}>eat</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "exerciseOther"})}>exerciseOther</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "cook"})}>cook</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "downtime"})}>downtime</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "chores"})}>chores</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "classwork"})}>classwork</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "professional development"})}>professional development</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "social time"})}>social time</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => setFormValues({...formValues, activityName: "projects"})}>projects</a></li>
          </ul>
        </div>
      <div id='timeInputs'>
        <div className='timeInputRow'>
          <p>Start Time:</p>
          <span className='hourMin'>
            <input 
              className='timeInput'
              value={formValues.startHour}
              onChange={(e) => setFormValues({...formValues, startHour: e.target.value})
              } 
              name="startHour" 
              pattern="^(?:[1-9]|1[0-2])$"
              required/>
              :
            <input
              className='timeInput'
              value={formValues.startMin}
              onChange={(e) => setFormValues({...formValues, startMin: e.target.value})
              } 
              name="startMin" 
              pattern="^(?:[0-5][0-9])$"
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
              pattern="^(?:[1-9]|1[0-2])$"
              required/>
              :
            <input 
              className='timeInput'
              value={formValues.endMin}
              onChange={(e) => setFormValues({...formValues, endMin: e.target.value})}
              name="endMin"
              pattern="^(?:[0-5][0-9])$"
              required/>
          </span>
        </div>
        <ReactDatePicker id="calendar" selected={formValues.activityDate} onChange={(date) => {
          setFormValues({...formValues, activityDate: date});
        }
        }/>
      </div>
      <button className='btn btn-primary' type="submit" disabled={!(formValues.activityName && formValues.startHour && formValues.startMin && formValues.endHour && formValues.endMin)}>Add activity</button>
    </form>
    <br />
    <div className='tableAndPie'>
      <div id='tableContainer'>
        <table className="table table-bordered table-sm">
          <thead className='table-dark'>
            <tr><th>Date</th><th>Activity</th><th>Duration</th><th>Start Time</th><th>End Time</th><th></th></tr>
          </thead>
          <tbody>
            {activities && activities.map((record, index) => (
              <ActivityDetails key={index} record={record}/>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pie'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            >
              <Legend verticalAlign='top' height={36}/>
              <Pie data={timeTotals} dataKey="value" nameKey="name" cx={200} cy={200} outerRadius={100  } label/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='bar'>
        <ResponsiveContainer width="60%" height="60%">
          <BarChart
            layout='vertical'
            data={timeTotals}
            margin={{top: 10, left: 50, right: 20, bottom: 10}}
          >
            <XAxis type='number'/>
            <YAxis type='category' dataKey='name'/>
            <Legend />
            <Bar dataKey='value' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  );
}

export default App;
