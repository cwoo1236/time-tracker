import { useActivitiesContext } from "../hooks/useActivitiesContext";
import { useState } from "react";

export default function EmailInputAndButton() {
    const [ email, setEmail ] = useState("");
    const { activities } = useActivitiesContext();

    const handleClick = async () => {
        if (window.confirm(`Are you sure you want to send an email to ${email}?`)) {
            const res = await fetch(`/api/email/${email}`, 
            {
                method: "POST",
                body: JSON.stringify(activities),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await res.json();
            console.log(json);
            setEmail("");
        }
    };
    return (
        <div>
            <input type="email" id="emailBox" value={email} onChange={e => setEmail(e.target.value)}/>
            <button onClick={handleClick}>Send Email</button>
        </div>
    );
}
    