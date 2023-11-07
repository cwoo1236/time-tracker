import { useEffect } from 'react';
import ActivityDetails from './components/ActivityDetails';
import { ResponsiveContainer, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Legend } from 'recharts';
import { useActivitiesContext } from './hooks/useActivitiesContext';
import ActivityForm from './components/ActivityForm';

function App() {
  // Hooks
  const { activities, timeTotals, dispatch } = useActivitiesContext();

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
      dispatch({ type: 'SET_ACTIVITIES', payload: payload });
      console.log("Dispatched SET_ACTIVITIES:", payload);
    }
    fetchData();
  }, [dispatch]);

  return (
    <div id="outer">
      <ActivityForm />
      <br />
      <div id='tableContainer'>
        <table className="table table-bordered table-sm">
          <thead className='table-dark'>
            <tr><th>Date</th><th>Activity</th><th>Duration</th><th>Start Time</th><th>End Time</th><th></th></tr>
          </thead>
          <tbody>
            {activities && activities.map((record, index) => (
              <ActivityDetails key={index} record={record} />
            ))}
          </tbody>
        </table>
      </div>
      <div className='pie'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
          >
            <Legend verticalAlign='top' height={36} />
            <Pie data={timeTotals} dataKey="value" nameKey="name" cx={200} cy={200} outerRadius={100} label />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='bar'>
        <ResponsiveContainer width="60%" height="60%">
          <BarChart
            layout='vertical'
            data={timeTotals}
            margin={{ top: 10, left: 50, right: 20, bottom: 10 }}
          >
            <XAxis type='number' />
            <YAxis type='category' dataKey='name' />
            <Legend />
            <Bar dataKey='value' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
