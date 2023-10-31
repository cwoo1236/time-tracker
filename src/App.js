// import './App.css';
import { useState, useEffect } from 'react';
import ActivityDetails from './components/ActivityDetails';
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Legend } from 'recharts';
import { useActivitiesContext } from './hooks/useActivitiesContext';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function App() {
  // Initialize context and state
  const { activities, dispatch } = useActivitiesContext();
  const [formValues, setFormValues] = useState({
    activityName: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    duration: 0,
    activityDate: new Date()
  });
  const [timeTotals, setTimeTotals] = useState(null);
  const [error, setError] = useState(null);

  // On page load
  useEffect(() => {
    const fetchData = async () => {
      const activitiesRes = await fetch('/api/activities');
      const activitiesJson = await activitiesRes.json();

      if (activitiesRes.ok) {
        dispatch({type: 'SET_ACTIVITIES', payload: activitiesJson});
        console.log("Dispatched", activitiesJson);
      }

      const timeTotalsRes = await fetch('/api/timeTotals/');
      const timeTotalsJson = await timeTotalsRes.json();

      if (timeTotalsRes.ok) {
        setTimeTotals(timeTotalsJson);
      }
    }

    fetchData();
  }, []);

  // Handle updating time totals when new activity is added
  const updateTimeTotal = async (nameToUpdate, toAdd) => {
    setTimeTotals(timeTotals => timeTotals.map(item => {
      if (item.name === nameToUpdate) {
        return { ...item, value: item.value + toAdd };
      }
      return item;
    }));

    const res = await fetch('/api/timeTotals/' + nameToUpdate, {
      method: 'PATCH',
      body: JSON.stringify( {$inc: {value: toAdd}} ),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error);
    } else {
      console.log("PATCHed\n", json);
    }
  };

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

    const postRes = await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify(formValues),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await postRes.json();

    if (!postRes.ok) {
      setError(json.error);
    } else {
      dispatch( {type: 'CREATE_ACTIVITY', payload: json});
      setError(null);
      updateTimeTotal(formValues.activityName, formValues.duration);
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
      <input id="activityInput"
        list='options'
        name="activityName"
        placeholder="Activity"
        value={formValues.activityName}
        onChange={(e) => setFormValues({...formValues, activityName: e.target.value})}
        required autoFocus
      />
      <datalist id='options'>
        <option value='eat'>eat</option>
        <option value='exerciseOther'>exerciseOther</option>
        <option value='cook'>cook</option>
        <option value='downtime'>downtime</option>
        <option value='chores'>chores</option>
        <option value='classwork'>classwork</option>
        <option value='prof dev'>professional development</option>
        <option value='social'>social time</option>
        <option value='projects'>projects</option>
      </datalist>
      <br />
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
          console.log(date.getMonth() + 1);
          }
        }/>
      </div>
      <button id="addActivity" type="submit">Add activity</button>
    </form>
    <br />
    <div className='tableAndPie'>
      <div id='tableContainer'>
        <table className="table">
          <tbody>
            <tr><th>Date</th><th>Activity</th><th>Duration</th><th>Start Time</th><th>End Time</th><th></th></tr>
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
