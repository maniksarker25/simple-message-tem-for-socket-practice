import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
export default function MessageBox() {
  const { id } = useParams();
  const { socket } = useSocket();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("accessToken");
  const decodedData = jwtDecode(token);
  console.log("decoded data", decodedData);
  const [allMessage, setAllMessage] = useState([]);
  console.log("dskjdkfj", allMessage);
  const currentMessage = useRef(null);
  console.log(userData);
  const handleSendMessage = (e) => {
    e.preventDefault();
    const form = e.target;
    const message = form.message.value;
    // console.log(message);
    form.reset();
    if (socket) {
      console.log(decodedData?.userId, id, message);
      socket.emit("new-message", {
        senderId: decodedData?.userId,
        receiverId: id,
        text: message,
        msgByUserId: decodedData?.userId,
      });
    }
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socket && id) {
      console.log("socket massage page");
      socket.emit("message-page", id);
      socket.on("message-user", (data) => {
        // console.log("user details", data);
        setUserData(data);
      });

      socket.on("message", (data) => {
        setAllMessage(data);
      });
    }
  }, []);
  // changes
  return (
    <div>
      <div className="h-[90vh]">
        <div className="flex gap-4 border-b border-black pb-4">
          <img
            className="w-12 h-12 rounded-full"
            src={userData?.profile_image}
            alt=""
          />
          <div>
            <h1 className="text-xl font-semibold">{userData?.name}</h1>
            <p className="-my-2 text-sm mt-1">
              {userData?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        {/* <div className="overflow-x-hidden overflow-y-scroll h-[80vh]">
          <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
            {allMessage?.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    decodedData?.userId === msg?.msgByUserId
                      ? "ml-auto bg-teal-100"
                      : "bg-white"
                  }`}
                >

                  <p className="px-2">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>

      <div className="">
        <form onSubmit={handleSendMessage}>
          <div className="flex justify-end  -end">
            <input type="text" name="message" className="w-full" />
            <button className="bg-blue-600 px-3 py-1 rounded-sm" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
