import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import { jwtDecode } from "jwt-decode";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { uploadFile } from "../utils/uploadfile";
export default function MessageBox() {
  const { id } = useParams();
  const { socket } = useSocket();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("accessToken");
  const decodedData = jwtDecode(token);
  const [allMessage, setAllMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const currentMessage = useRef(null);
  const [newMessage, setNewMessage] = useState({
    imageUrl: "",
    videoUrl: "",
  });
  console.log(userData);
  const handleSendMessage = (e) => {
    e.preventDefault();
    const form = e.target;
    const message = form.message.value;
    console.log(message);
    form.reset();
    if (socket) {
      socket.emit("new-message", {
        sender: decodedData?.userId,
        receiver: id,
        text: message,
        msgByUserId: decodedData?.userId,
        imageUrl: newMessage?.imageUrl,
        videoUrl: newMessage?.videoUrl,
      });
      setNewMessage({
        imageUrl: "",
        videoUrl: "",
      });
    }
  };
  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  // for image and video
  // handle upload image
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setNewMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };

  // clear image
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };
  // handle upload video
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };
  // clear video
  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };
  // use useEffect for message page and message user
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
  // changes-----------------------
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
        <div className="overflow-x-hidden overflow-y-scroll h-[80vh]">
          <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
            {/* {allMessage.map((msg, index) => {
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
            })} */}
            {allMessage.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    decodedData?.userId === msg?.msgByUserId
                      ? "ml-auto bg-teal-100"
                      : "bg-white"
                  }`}
                >
                  <div className="w-full relative">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down"
                      />
                    )}
                    {msg?.videoUrl && (
                      <video
                        src={msg.videoUrl}
                        className="w-full h-full object-scale-down"
                        controls
                      />
                    )}
                  </div>
                  <p className="px-2">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
          </div>
          {newMessage.imageUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                onClick={handleClearUploadImage}
              >
                <IoClose size={30} />
              </div>
              <div className="bg-white p-3">
                <img
                  src={newMessage?.imageUrl}
                  alt="uploadImage"
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="">
        <button
          onClick={handleUploadImageVideoOpen}
          className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
        >
          <FaPlus size={20} />
        </button>
        {openImageVideoUpload && (
          <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
            <form>
              <label
                htmlFor="uploadImage"
                className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
              >
                <div className="text-primary">
                  <FaImage size={18} />
                </div>
                <p>Image</p>
              </label>
              <label
                htmlFor="uploadVideo"
                className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
              >
                <div className="text-purple-500">
                  <FaVideo size={18} />
                </div>
                <p>Video</p>
              </label>

              <input
                type="file"
                id="uploadImage"
                onChange={handleUploadImage}
                className="hidden"
              />

              <input
                type="file"
                id="uploadVideo"
                onChange={handleUploadVideo}
                className="hidden"
              />
            </form>
          </div>
        )}
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
