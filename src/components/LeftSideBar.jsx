import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { useSocket } from "../Context/SocketContext";
export default function LeftSideBar() {
  const driverUrl = "driver/auth/admin/drivers";
  const userUrl = "user/auth/get_all";
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  // console.log("decode", decoded);
  const [users, setUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  // console.log("all user", allUser);
  const { socket } = useSocket();
  const location = useLocation();
  const pathname = location.pathname;
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
      // socket.emit("sidebar", decoded?.userId);

      socket.on("conversation", (data) => {
        // Process the conversation data
        console.log("conversation", data);
        const conversationUserData = data?.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== decoded?.userId) {
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
  }, [socket, decoded?.userId]);
  return (
    <div>
      <div>
        {/* {users?.map((user, index) => (
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
        ))} */}
        {allUser.map((conv, index) => {
          const isActive = pathname === `/${conv?.userDetails?._id}`;
          const href =
            pathname === "/"
              ? `message/${conv?.userDetails?._id}`
              : `message/${conv?.userDetails?._id}`;

          return (
            <Link
              to={href}
              key={conv?._id}
              className={`flex items-center gap-2 py-3 px-2 border border-transparent rounded hover:bg-slate-100 cursor-pointer
                ${
                  isActive
                    ? "border-primary bg-slate-100"
                    : "hover:border-primary"
                }`}
            >
              <div>
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                  {conv?.userDetails?.name}
                </h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {conv?.lastMsg?.imageUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </div>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </div>
                    )}
                  </div>
                  <p className="text-ellipsis line-clamp-1 ">
                    {conv?.lastMsg?.text?.slice(0, 25) + "..."}
                  </p>
                </div>
              </div>
              {Boolean(conv?.unseenMsg) && (
                <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-red-700 font-semibold rounded-full">
                  {conv?.unseenMsg}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
