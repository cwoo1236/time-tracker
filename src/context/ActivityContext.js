import { createContext, useReducer } from "react";

// Increment appropriate timeTotal when activity is added
// async function updateTimeTotalInDb(nameToUpdate, toAdd) {
//     console.log("toAdd is", toAdd);
//     const res = await fetch('/api/timeTotals/' + nameToUpdate, {
//       method: 'PATCH',
//       body: JSON.stringify( {$inc: {value: toAdd}} ),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       console.log(`Failed to update ${nameToUpdate}'s timeTotal.`);
//     } else {
//       console.log(`Updated ${nameToUpdate}'s timeTotal.`, json);
//     }
// }

function updateTimeTotalLocal(timeTotals, nameToUpdate, duration) {
    return timeTotals.map(item => item.name === nameToUpdate ? { ...item, value: item.value + duration } : item);
}

export const ActivityContext = createContext();

export const activitiesReducer = (state, action) => {
    let nameToUpdate, duration;
    switch (action.type) {
        case 'SET_ACTIVITIES':
            return {
                activities: action.payload.activities,
                timeTotals: action.payload.timeTotals
            };
        case 'CREATE_ACTIVITY':
            let sorted = [action.payload.activities, ...state.activities].sort((a, b) => Date.parse(a.activityDate) - Date.parse(b.activityDate));
            nameToUpdate = action.payload.timeTotalsParts.activityName;
            duration = action.payload.timeTotalsParts.duration;

            return {
                activities: sorted,
                timeTotals: updateTimeTotalLocal(state.timeTotals, nameToUpdate, duration).sort((a, b) => b.value - a.value)
            }
        case 'DELETE_ACTIVITY':
            nameToUpdate = action.payload.timeTotalsParts.activityName;
            duration = action.payload.timeTotalsParts.duration;

            return {
                activities: state.activities.filter((a) => a._id !== action.payload.activity._id),
                timeTotals: updateTimeTotalLocal(state.timeTotals, nameToUpdate, duration * -1).sort((a, b) => b.value - a.value)
            }

        default:
            return state;
    }
}

export const ActivityContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(activitiesReducer, {
        activities: null,
        timeTotals: null
    });

    return (
        <ActivityContext.Provider value={{...state, dispatch}}>
            {children}
        </ActivityContext.Provider>
    );
}
