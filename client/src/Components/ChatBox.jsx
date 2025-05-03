/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import EmptyChat from "./EmptyChat";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socketContext";

export default function ChatBox({
  isChatSelected,
  selectedChat,
  setSelectedChat,
}) {
  const { userDetails } = useSelector((state) => state.user);
  const [messageList, setMessageList] = useState([]);
  const socket = useContext(SocketContext);
  const [messageData, setMessageData] = useState("");
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const limit = 6;
  const [offset, setOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const fetchMessages = async (newOffset = 0) => {
    if (isFetching || !hasMoreMessages) return;
    setIsFetching(true);

    try {
      const response = await fetch(`${apiUrl}/api/message/${selectedChat.chatId}?limit=${limit}&offset=${newOffset}`, {
        method: "GET",
        credentials: "include"
      });

      if (response.status !== 200) {
        const error = await response.json();
        console.log(error);
        throw new Error(error);
      }

      const data = await response.json();
      if (data.chatMessages.length > 0) {
        setMessageList((prevMessages) => [...data.chatMessages.reverse(), ...prevMessages]);
        setOffset(newOffset + limit);

      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessageList([]);
      setOffset(0);
      setHasMoreMessages(true);
      fetchMessages(0);
    }
  }, [selectedChat]);

  useEffect(() => {
    const currentContainer = messagesContainerRef.current;
    if (currentContainer) {
      // Adjust the scroll position by setting scrollTop property
      currentContainer.scrollTop = 5; // Adjust this value as needed
    }
  }, [messageList]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMoreMessages && !isFetching) {
        fetchMessages(offset);
      }
    }
  }, [hasMoreMessages, isFetching, offset]);

  useEffect(() => {
    const currentContainer = messagesContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleSelectedChat = () => {
    isChatSelected.current = false;
    setSelectedChat(null);
  };

  const handleMessage = (e) => {
    const { value } = e.target;
    setMessageData(value);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    if (selectedChat === null || messageData.trim() === "") {
      return;
    }

    const newMessage = {
      chatId: selectedChat.chatId,
      members: [userDetails._id, selectedChat._id],
      message: messageData.trim(),
    };

    socket.emit("NEW_MESSAGE", newMessage);
    setMessageData("");
  };

  useEffect(() => {
    socket.on("NEW_MESSAGE", (data) => {
      // const container = messagesContainerRef.current;
      // const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

      setMessageList((prevList) => [...prevList, data]);

      // if (isAtBottom) {
      //   setTimeout(() => {
      //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      //   }, 100); // Slight delay to ensure the new message is rendered
      // }
    });

    return () => {
      socket.off("NEW_MESSAGE");
    };
  }, [socket]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <>
      {selectedChat && isChatSelected ? (
        <div className="flex flex-col flex-grow w-full h-full">
          <div className="flex space-x-4 align-middle shadow-md p-4">
            <IoMdArrowRoundBack
              onClick={handleSelectedChat}
              className="md:hidden text-3xl text-blue-950 mb-2"
            />
            <div>
              <img
                className="w-8 h-8 rounded-full"
                src={selectedChat.image}
                alt="User image"
              />
            </div>
            <div>
              <p>{selectedChat.name}</p>
              <span className="text-sm text-slate-600">
                {selectedChat.email}
              </span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-5" ref={messagesContainerRef}>
            {messageList.length > 0 ? (
              messageList.map((message) => (
                <div
                  key={message.message._id}
                  className={`w-full flex ${
                    message.message.sender === userDetails._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.message.sender !== userDetails._id && (
                    <div className="mr-4">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={selectedChat.image}
                        alt="User image"
                      />
                    </div>
                  )}
                  <div className="max-w-full">
                    {message.message.sender !== userDetails._id && (
                      <h5 className="text-gray-600 text-sm font-medium leading-snug pb-1">
                        {selectedChat.name}
                      </h5>
                    )}
                    <div
                      className={`px-3.5 py-2 ${
                        message.message.sender === userDetails._id
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500"
                      } rounded items-center gap-3 inline-flex max-w-72 break-all ${
                        message.message.sender === userDetails._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <h5 className="text-white  text-sm font-normal leading-snug">
                        {message.message.message}
                      </h5>
                    </div>
                    <div className="justify-end items-center mb-2.5 mr-2">
                      <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                        {formatTime(message.message.createdAt)}
                      </h6>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center mt-10 p-4 italic">Lets Chat Now</p>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="w-full p-4">
            <form className="flex" onSubmit={submitMessage}>
              <input
                type="text"
                value={messageData}
                onChange={handleMessage}
                className="flex-grow p-2 border rounded"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <EmptyChat />
      )}
    </>
  );
}
