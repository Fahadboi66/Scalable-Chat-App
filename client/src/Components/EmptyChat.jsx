export default function ChatBox() {
    return (
      <div
        className={`flex-grow w-full border-2
        }`}
      >
        <button
          className="md:hidden text-blue-500 p-32 mb-2" >
          Back
        </button>
        <div className="p-4 w-full">
            <h3 className="text-center">Lets chat with your friends.</h3>
        </div>
      </div>
    );
  }
  