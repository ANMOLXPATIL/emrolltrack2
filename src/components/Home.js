import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const [activeEmployees, setActiveEmployees] = useState([]);
    const [inactiveEmployees, setInactiveEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const attendanceRef = ref(database, `attendance/${today}`);

        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            const active = [];
            const inactive = [];

            for (const empID in data) {
                const logs = data[empID].logs;
                const lastLog = Object.values(logs).pop(); // Get the latest log
                if (lastLog.type === "entry") {
                    active.push(empID);
                } else {
                    inactive.push(empID);
                }
            }

            setActiveEmployees(active);
            setInactiveEmployees(inactive);
        });
    }, []);

    return (
        <div className="content">
            <h2>Active Employees</h2>
            <ul>
                {activeEmployees.map((emp, index) => (
                    <li key={index}>
                        <Link to={`/employee/${emp}`}>{emp}</Link>
                    </li>
                ))}
            </ul>

            <h2>Inactive Employees</h2>
            <ul>
                {inactiveEmployees.map((emp, index) => (
                    <li key={index}>
                        <Link to={`/employee/${emp}`}>{emp}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;