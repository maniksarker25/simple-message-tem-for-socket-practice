import { useState, useEffect } from "react";
import io from "socket.io-client";

// Set up your Socket.IO client
const socket = io("http://localhost:5000"); // Adjust the URL as necessary

function JobPage({ jobId }) {
  const [potentialDrivers, setPotentialDrivers] = useState([]); // Holds all drivers
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0); // Tracks the current driver

  useEffect(() => {
    // Join the room for this job
    socket.emit("join-job-room", jobId);

    // Listen for drivers accepting the job in real-time
    socket.on("driver-accepted", (drivers) => {
      setPotentialDrivers(drivers);
    });

    // Clean up the event listener when component unmounts
    return () => {
      socket.off("driver-accepted");
    };
  }, [jobId]);

  // Function to show the next driver when "Find Another" is clicked
  const showNextDriver = () => {
    if (potentialDrivers.length > 0) {
      setCurrentDriverIndex(
        (prevIndex) => (prevIndex + 1) % potentialDrivers.length
      );
    }
  };

  // Get the current driver to display
  const currentDriver = potentialDrivers[currentDriverIndex];

  return (
    <div>
      <h3>Accepted Drivers for Job {jobId}</h3>

      {currentDriver && currentDriver.driverId ? (
        <div>
          <p>Driver Name: {currentDriver.driverId.name}</p>
          <p>Phone Number: {currentDriver.driverId.phoneNumber}</p>
          <p>Vehicle Type: {currentDriver.driverId.vehicleType}</p>
          <p>
            Accepted At: {new Date(currentDriver.acceptedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No drivers have accepted the job yet.</p>
      )}

      {potentialDrivers.length > 1 && (
        <button onClick={showNextDriver}>Find Another</button>
      )}
    </div>
  );
}

export default JobPage;
