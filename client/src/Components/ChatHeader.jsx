import { useState } from "react";
import { useGetUsersListQuery } from "../features/api/chatApi";
import { useSelector } from "react-redux";

export default function ChatHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useGetUsersListQuery({ refetchOnMountOrArgChange: true });
  const {userDetails} = useSelector(state => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateChat = async(memberId) => {
    const members = [userDetails._id, memberId];
    if(members.length !== 2) {
      alert("Alteast 2 members should be present.");
      return;
    }

    try{
      const response = await fetch(`${apiUrl}/api/chat/create`,  {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type" :"application/json"
       },
       body: JSON.stringify(members),
      })

      if(response.status === 400){
        const error = await response.json();
        console.log(error);
        return;
      }

      const data = await response.json();
      console.log("Chat Created Successfully: ", data);

    } catch(err){
      console.log(err);
      return;
    }
  }


  return (
    <>
      <div className="w-full border-2 border-slate-300 rounded-sm shadow-md p-5">
        {/* Modal toggle */}
        <button
          onClick={toggleModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Create Chat
        </button>
        {/* Main modal */}
        {isModalOpen && (
          <div
            id="select-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Users List
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={toggleModal}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal body */}
                <>
                  {/* This is an example component */}
                  <div className="max-w-2xl mx-auto">
                    <div className="p-4 max-w-md bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 dark:divide-gray-700"
                        >
                          {data.users.length > 0 ? (
                            data.users.map((user) => {
                              return (
                                <li className="py-3 sm:py-4" key={user._id}>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="w-8 h-8 rounded-full"
                                        src={user.image}
                                        alt="Neil image"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {user.email}
                                      </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                      <button onClick={() => handleCreateChat(user._id)} className="bg-green-700 p-2 rounded-lg">
                                        <span className="font-medium text-sm">Create Chat</span>
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <p className="text-center text-white">
                              No Users Found
                            </p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
