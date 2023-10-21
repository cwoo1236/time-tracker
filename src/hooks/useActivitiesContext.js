import { ActivityContext } from "../context/ActivityContext";
import { useContext } from 'react';

export const useActivitiesContext = () => {
    const context = useContext(ActivityContext);

    if (!context) {
        throw Error('useActivitiesContext must be used inside an ActivityContextProvider');
    }

    return context;
}
