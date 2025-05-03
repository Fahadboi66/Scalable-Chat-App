import { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom"
import ChatBox from "./ChatBox";
import { useGetChatListQuery } from "../features/api/chatApi";
import {logout} from "../features/user/userSlice"
import { useDispatch, useSelector } from "react-redux";

export default function ChatList() {
  const { userDetails } = useSelector((state) => state.user);
  const isChatSelected= useRef(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const { data, isLoading, isError, error, refetch } = useGetChatListQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();





  useEffect(() => {
    if (data && data.chats) {
      const transformedChatList = data.chats.flatMap((chat) =>
        chat.members
          .filter((user) => user._id !== userDetails._id)
          .map((user) => ({ ...user, chatId: chat._id }))
      );
      setChatList(transformedChatList);
    }
  }, [data, userDetails]);

  useEffect(() => {
    // Fetch data on mount and when userDetails change
    refetch();
  }, [userDetails, refetch]);

  const handleSelectChat = (user) => {
    setSelectedChat(user);
    isChatSelected.current = true;

  };

  const handleLoginRedirect = () => {
    dispatch(logout()); 
    navigate("/login");
  }


  return (
    <div className="flex flex-col md:flex-row h-[600px] overflow-y-auto">
      <div
        className={`border-2 border-slate-300 shadow-lg lg:w-[30%] ${
          isChatSelected.current ? "hidden md:block" : "block"
        }`}
      >
        <div className="sm:w-full flex align-middle justify-start p-5">
          <input
            placeholder="Search Users"
            type="text"
            className="border-b-2 border-slate-500 px-3 focus:border-none w-[80%] py-2"
          />
        </div>
        {isLoading && <p>Loading...</p>}
        {isError && <div className="flex flex-col items-center"><p className="text-center">{error.data.message}</p></div>}
        {!isLoading && !isError && chatList.length === 0 && <p>No chats found.</p>}
        {!isLoading &&
          !isError &&
          chatList.map((user, index) => (
            <div
              key={index}
              className="p-4 border-b cursor-pointer hover:bg-gray-100 "
              onClick={() => handleSelectChat(user)}
            >
              <div className="flex space-x-4 align-middle overflow-auto " >
                <div>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.image}
                    alt="User"
                  />
                </div>
                <div>
                  <p>{user.name}</p>
                  <span className="text-sm text-slate-600">{user.email}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div
        className={`w-full ${
          isChatSelected.current ? "md:w-full" : "md:w-[100%]"
        } border-2 border-slate-300 shadow-lg ${
          !isChatSelected.current ? "hidden md:block" : ""
        }`}
      >
        <ChatBox isChatSelected={isChatSelected} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      </div>
    </div>
  );
}
