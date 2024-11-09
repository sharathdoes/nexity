import React from "react";
import Sidebar from "../../Component/Sidebar";
import MessageForm from "../../Component/Messageform";

const Chat = () => (
    <div className="flex h-screen">
        <div className="w-full md:w-1/4 bg-gray-100 p-4">
            <Sidebar />
        </div>
        <div className="w-full md:w-3/4 flex flex-col p-4">
            <MessageForm />
        </div>
    </div>
);

export default Chat;
