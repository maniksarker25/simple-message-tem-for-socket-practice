import React, { useEffect, useState } from "react";

function Notification() {
  const token = localStorage.getItem("accessToken");
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `http://192.168.10.153:5050/notification`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setNotifications(data?.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]); // Add `token` as a dependency to avoid stale token issues

  return (
    <div>
      <p className="my-4">You have {notifications?.length} notifications</p>
      {notifications?.map((noti, index) => (
        <div className="border-b-2 border-red-400 pb-3" key={index}>
          <h1>{noti?.title}</h1>
          <p>{noti?.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notification;
