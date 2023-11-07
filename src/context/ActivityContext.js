import { createContext, useReducer } from "react";

export const ActivityContext = createContext();


export const activitiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACTIVITIES':
            return {
                activities: action.payload.activities,
                timeTotals: action.payload.timeTotals
            };
        case 'CREATE_ACTIVITY':
            let sorted = [action.payload.activities, ...state.activities].sort((a, b) => Date.parse(a.activityDate) - Date.parse(b.activityDate));
            const nameToUpdate = action.payload.timeTotalsParts.activityName;
            const toAdd = action.payload.timeTotalsParts.duration;

            updateTimeTotal(nameToUpdate, toAdd);

            return {
                activities: sorted,
                timeTotals: state.timeTotals.map(item => item.name === nameToUpdate ? { ...item, value: item.value + toAdd } : item)
            }
        case 'DELETE_ACTIVITY':
            return {
                activities: state.activities.filter((a) => a._id !== action.payload._id)
            }

        default:
            return state;
    }
}

async function updateTimeTotal(nameToUpdate, toAdd) {
    const res = await fetch('/api/timeTotals/' + nameToUpdate, {
      method: 'PATCH',
      body: JSON.stringify( {$inc: {value: toAdd}} ),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();

    if (!res.ok) {
      console.log(`Failed to update ${nameToUpdate}'s timeTotal.`);
    } else {
      console.log(`Updated ${nameToUpdate}'s timeTotal.`, json);
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
