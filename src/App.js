import './App.css';
import { useState, useEffect } from 'react';
import ActivityDetails from './components/ActivityDetails';
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Legend } from 'recharts';
import { useActivitiesContext } from './hooks/useActivitiesContext';

function App() {
  const { activities, dispatch } = useActivitiesContext();

  const [formValues, setFormValues] = useState({
    activityName: "",
    startHour: "",
    startMin: "",
    endHour: "",
    endMin: "",
    duration: 0
  });

  const [timeTotals, setTimeTotals] = useState([
    {
      name: "eat",
      value: 0, 
      fill: '#e3c574'
    },
    {
      name: "exerciseOther",
      value: 0,
      fill: '#6f76f2'
    },
    {
      name: "cook",
      value: 0,
      fill: '#9ee68e'
    },
    {
      name: 'downtime',
      value: 0,
      fill: '#e37474'
    },
    {
      name: 'chores',
      value: 0,
      fill: '#c26ff2'
    },
    {
      name: 'classwork',
      value: 0,
      fill: '#ecf08b'
    },
    {
      name: 'prof dev',
      value: 0, 
      fill: '#8bf0bc'
    },
    {
      name: 'social',
      value: 0,
      fill: '#f08bae'
    },
    {
      name: 'projects',
      value: 0,
      fill: '#a6a6a6'
    }
  ]);

  const updateTimeTotal = (nameToUpdate, toAdd) => {
    setTimeTotals(timeTotals => timeTotals.map(item => {
      if (item.name === nameToUpdate) {
        return { ...item, value: item.value + toAdd };
      }
      return item;
    }));
    console.log(timeTotals);
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/activities');
      const json = await res.json();

      if (res.ok) {
        console.log("Dispatching...");
        dispatch({type: 'SET_ACTIVITIES', payload: json});
        console.log("Dispatched", json);
      }
    }

    fetchData();
    console.log(activities);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date();
    startTime.setHours(formValues.startHour);
    startTime.setMinutes(formValues.startMin);
    const endTime = new Date();
    endTime.setHours(formValues.endHour);
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
      console.log("added", json);
      updateTimeTotal(formValues.activityName, formValues.duration);
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
      </div>
      <button id="addActivity" type="submit">Add activity</button>
    </form>
    <br />
    <div className='tableAndPie'>
      <div className='tableSpan'>
        <table id="activitiesTable">
          <tbody>
            <tr><th>Activity</th><th>Start Time</th><th>End Time</th><th>Duration (min)</th><th></th></tr>
            {activities && activities.map((record, index) => (
              <ActivityDetails key={index} record={record}/>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pieSpan'>
        <PieChart
          width={400}
          height={400}
          >
            <Legend verticalAlign='top' height={36}/>
            <Pie data={timeTotals} dataKey="value" nameKey="name" cx={200} cy={200} outerRadius={50} label/>
        </PieChart>
      </div>
      <div className='barSpan'>
        <BarChart 
          width={500}
          height={500}
          data={timeTotals}
        >
          <XAxis dataKey='name' />
          <YAxis />
          <Legend />
          <Bar dataKey='value' />
        </BarChart>
      </div>
    </div>
  </div>
  );
}

export default App;
