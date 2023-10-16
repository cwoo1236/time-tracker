const ActivityDetails = ({record}) => {
    return (
        <tr>
        <td>{record.activityName}</td>
        <td>{record.startHour}:{record.startMin}</td>
        <td>{record.endHour}:{record.endMin}</td>
        <td>{record.duration}</td>
        <td><button>delete row</button></td>
        </tr>
    )
}

export default ActivityDetails;