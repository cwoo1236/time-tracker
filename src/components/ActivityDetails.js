import { useActivitiesContext } from "../hooks/useActivitiesContext";

const ActivityDetails = ({record}) => {
    const { dispatch } = useActivitiesContext();

    const handleClick = async () => {
        // DELETE the activity from db
        const res = await fetch('/api/activities/' + record._id, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (!res.ok) {
            console.log("Failed to DELETE from db.");
        }
        console.log("before PATCH");
        // Decrement timeTotal in db
        const res2 = await fetch('/api/timeTotals/' + record.activityName, {
            method: 'PATCH',
            body: JSON.stringify({ $inc: { value: (record.duration * -1) }}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json2 = await res2.json();

        if (!res2.ok) {
            console.error("Something went wrong subtracting from timeTotal");
        }

        // Update state
        const payload = { activity: json, timeTotalsParts: { activityName: record.activityName, duration: record.duration }};
        dispatch({type: 'DELETE_ACTIVITY', payload: payload});
        console.log(`DELETE activity w/ id ${record._id}`);
    }
    
    // Date.parse() instead?
    const theDate = new Date(record.activityDate);

    return (
        <tr>
            <td>{`${theDate.getMonth() + 1}/${theDate.getDate()}`}</td>
            <td>{record.activityName}</td>
            <td>{record.duration}</td>
            <td>{record.startHour}:{record.startMin}</td>
            <td>{record.endHour}:{record.endMin}</td>
            <td>{record.comments}</td>
            <td><button onClick={handleClick}>Delete</button></td>
        </tr>
    )
}

export default ActivityDetails;