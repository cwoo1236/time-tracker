import { useActivitiesContext } from "../hooks/useActivitiesContext";

const ActivityDetails = ({record}) => {
    const { dispatch } = useActivitiesContext();

    const handleClick = async () => {
        const res = await fetch('/api/activities/' + record._id, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (res.ok) {
            dispatch({type: 'DELETE_ACTIVITY', payload: json});
        }

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
        } else {
            console.log("PATCH reduced\n", json2);
        }
    }

    const theDate = new Date(record.activityDate);

    return (
        <tr>
            <td>{`${theDate.getMonth() + 1}/${theDate.getDate()}`}</td>
            <td>{record.activityName}</td>
            <td>{record.duration}</td>
            <td>{record.startHour}:{record.startMin}</td>
            <td>{record.endHour}:{record.endMin}</td>
            <td><button onClick={handleClick}>Delete</button></td>
        </tr>
    )
}

export default ActivityDetails;