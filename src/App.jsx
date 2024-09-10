import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import { useSocket } from "./Context/SocketContext";
import { IoMdNotifications } from "react-icons/io";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const { socket } = useSocket();
  const token = localStorage.getItem("accessToken");
  const decodedData = jwtDecode(token);
  // const [notifications, setNotifications] = useState({});
  const [notificationCount, setNotificationCount] = useState(null);
  useEffect(() => {
    if (socket && decodedData?.userId) {
      console.log("mice on this ting");
      socket.emit("notification-page", decodedData?.userId);
      socket.on("notifications", (data) => {
        console.log("count with notifications", data);
        // setNotifications(data);
        console.log(data);
        setNotificationCount(data);
      });
    }
  }, [socket && decodedData?.userId]);

  // const handleNotification = () => {
  //   socket.emit("new-notification", {
  //     jobId: "66dc3e14a1062cd6c2263307",
  //     title: "Job Application Update",
  //     message:
  //       "Your application for the Software Engineer position has been received.",
  //     receiverId: "66d98c3901c81a5445355894",
  //   });
  // };

  const handleSeenMsg = () => {
    socket.emit("seen-notification", decodedData?.userId);
  };

  return (
    <div className="">
      <div className="max-w-screen-lg mx-auto flex gap-6">
        <div className="w-2/5 bg-slate-200 h-screen p-6">
          <div className="flex gap-7">
            <h1 className="text-xl font-semibold ">All Users </h1>
            <div>
              <IoMdNotifications
                onClick={handleSeenMsg}
                className="cursor-pointer"
              />
              {/* {notifications?.unseenCount > 0 && (
                <div className="bg-red-500 absolute w-6 h-6 rounded-full top-0 text-white font-bold">
                  {notifications?.unseenCount}
                </div>
              )} */}
              {notificationCount > 0 && (
                <div className="bg-red-500 absolute w-6 h-6 rounded-full top-0 text-white font-bold">
                  {notificationCount}
                </div>
              )}
            </div>
            <div>
              {/* <button
                onClick={handleNotification}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                Send Notification
              </button> */}
            </div>
          </div>
          <LeftSideBar></LeftSideBar>
        </div>
        <div className="w-3/5 bg-slate-200 h-screen p-6">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default App;
