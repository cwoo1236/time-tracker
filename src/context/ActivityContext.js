import { createContext, useReducer } from "react";

export const ActivityContext = createContext();

export const activitiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACTIVITIES':
            console.log("hit set activities");
            console.log("payload is", action.payload);
            return {
                activities: action.payload
            };
        case 'CREATE_ACTIVITY':
            console.log("create payload is", [action.payload, ...state.activities]);
            return {
                activities: [action.payload, ...state.activities]
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