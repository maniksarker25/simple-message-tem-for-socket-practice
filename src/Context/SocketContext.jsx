// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  onlineUser: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [token, setToken] = useState(null);
  console.log(onlineUser);

  useEffect(() => {
    // Get token from localStorage or some async API (e.g., authentication context)
    const savedToken = localStorage.getItem("accessToken");
    // const savedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ2ZjBkZWE4MDE5ZDY3YjA1YTg1MmYiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjUzNjI1NTMsImV4cCI6MTcyNzk1NDU1M30.pRJzc6g67g23M39LlvqrYc4kQ3fxlt60seqPCNLMwrk";
    if (savedToken) {
      setToken(savedToken); // Set token when found
    }
  }, []);
  console.log(import.meta.env.VITE_PUBLIC_BACKEND_URL)
  useEffect(() => {
    if (!token) return; 
    const socketConnection = io(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}`, {
      auth: {
        token: token, // Use token in socket auth
      },
    });

    socketConnection.on("onlineUser", (data) => {
      setOnlineUser(data); // Update onlineUser in context
    });

    setSocket(socketConnection); // Set socket in state

    return () => {
      socketConnection.disconnect(); // Clean up when component unmounts
    };
  }, [token]); 

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
