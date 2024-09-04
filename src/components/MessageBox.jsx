import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";

export default function MessageBox() {
  const { id } = useParams();
  const { socket } = useSocket();
  const [userData, setUserData] = useState(null);
  console.log(userData);
  const handleSendMessage = (e) => {
    e.preventDefault();
    const form = e.target;
    const message = form.message.value;
    console.log(message);
  };

  useEffect(() => {
    if (socket && id) {
      console.log("socket massage page");
      socket.emit("message-page", id);
      socket.on("message-user", (data) => {
        // console.log("user details", data);
        setUserData(data);
      });
    }
  }, []);
  return (
    <div>
      <div className="h-[90vh]">messages</div>
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
