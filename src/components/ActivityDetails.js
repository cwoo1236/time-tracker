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
    }

    return (
        <tr>
            <td>{record.activityName}</td>
            <td>{record.startHour}:{record.startMin}</td>
            <td>{record.endHour}:{record.endMin}</td>
            <td>{record.duration}</td>
            <td><button onClick={handleClick}>delete row</button></td>
        </tr>
    )
}

export default ActivityDetails;