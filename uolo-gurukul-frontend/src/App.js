import "./App.css";
import { useEffect, useState } from "react";
import AdmissionForm from "./components/AdmissionForm/AdmissionForm";
import ServerError from "./components/ErrorPage/ServerError";


function App() {

  const [healthStatus, setHealthStatus] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchHealthCheck = async () => {
      try {
        const response = await fetch(`${BASE_URL}/healthcheck`);
        if (!response.ok) {
          console.log("🚀 Health Check response not Ok: ", response.status)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Health Check Result:", result);
        setHealthStatus(result);
      } catch (error) {
        console.error("Health Check Failed:", error.message);
      }
    };


    fetchHealthCheck();
  }, []);

  return (
    <div className="App">
      {healthStatus ? <AdmissionForm /> : <ServerError/>}
    </div>
  );
}

export default App;
