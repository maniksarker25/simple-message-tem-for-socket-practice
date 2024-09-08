import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
export default function LeftSideBar() {
  const driverUrl = "driver/auth/admin/drivers";
  const userUrl = "user/auth/get_all";
  const token = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  useEffect(() => {
    let decoded;
    if (token) {
      decoded = jwtDecode(token);
    }
    fetch(
      `http://192.168.10.153:5050/${
        decoded?.role === "DRIVER" ? userUrl : driverUrl
      }`
    )
      .then((res) => res.json())
      .then((data) => setUsers(data?.data));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);

      socket.on("conversation", (data) => {
        // Process the conversation data
        const conversationUserData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        // Update the state with the processed data
        setAllUser(conversationUserData);
      });

      // Cleanup listener on component unmount
      return () => {
        socket.off("conversation");
      };
    }
  }, [socket, user]);
  return (
    <div>
      <div>
        {users?.map((user, index) => (
          <div key={user?._id}>
            <Link
              to={`message/${user?._id}`}
              className="flex gap-4 p-3 border-b-2 border-black cursor-pointer"
            >
              <img
                className="h-10 w-10 rounded-full"
                src={user?.profile_image}
                alt="profileImage"
              />
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
