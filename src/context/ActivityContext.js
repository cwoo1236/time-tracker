import { createContext, useReducer } from "react";

export const ActivityContext = createContext();

export const activitiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACTIVITIES':
            return {
                activities: action.payload
            };
        case 'CREATE_ACTIVITY':
            console.log("create payload is", [action.payload, ...state.activities]);
            let sorted = [action.payload, ...state.activities].sort((a, b) => Date.parse(a.activityDate) - Date.parse(b.activityDate));
            return {
                activities: sorted
            };
        case 'DELETE_ACTIVITY':
            return {
                activities: state.activities.filter((a) => a._id !== action.payload._id)
            };

        default:
            return state;
    }
}

export const ActivityContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(activitiesReducer, {
        activities: null
    });

    return (
        <ActivityContext.Provider value={{...state, dispatch}}>
            {children}
        </ActivityContext.Provider>
    );
}