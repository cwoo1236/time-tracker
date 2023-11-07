import { useActivitiesContext } from "../hooks/useActivitiesContext";
import ActivityDetails from "./ActivityDetails";

export default function ActivityTable() {
    const { activities } = useActivitiesContext();

    return (
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
    );
}