import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);

    useEffect(() => {
        socket.off("room-messages").on("room-messages", (roomMessages) => {
            setMessages(roomMessages);
        });
    }, [socket, setMessages]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;

        const today = new Date();
        const time = `${today.getHours()}:${today.getMinutes().toString().padStart(2, "0")}`;
        const todayDate = today.toLocaleDateString("en-US");
        const roomId = currentRoom;

        socket.emit("message-room", roomId, message, user, time, todayDate);
        setMessage("");
    }

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto">
            <header className="p-4 border-b">
                <h1 className="text-2xl font-bold">Chat</h1>
            </header>

            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {/* Displaying Messages */}
                {user && !privateMemberMsg?._id && (
                    <div className="text-center text-sm text-gray-500">
                        You are in the <span className="font-semibold">{currentRoom}</span> room
                    </div>
                )}

                {user && privateMemberMsg?._id && (
                    <div className="text-center text-sm text-gray-500">
                        Your conversation with <span className="font-semibold">{privateMemberMsg.name}</span>
                    </div>
                )}

                {!user && (
                    <div className="text-center text-red-500">
                        Please login to send messages
                    </div>
                )}

                {user && messages.map(({ _id: date, messagesByDate }, idx) => (
                    <div key={idx}>
                        <p className="text-center text-sm text-gray-500">{date}</p>
                        {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (
                            <div
                                key={msgIdx}
                                className={`flex mb-4 ${sender.email === user.email ? "justify-end" : "justify-start"}`}
                            >
                                {sender.email !== user.email && (
                                    <div className="w-8 h-8 mr-2 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                        <img src={sender.picture} alt={sender.name} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                )}
                                <div
                                    className={`p-2 rounded-lg ${
                                        sender.email === user.email ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    {content}
                                    <div className="text-xs text-gray-400">{time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t flex">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit(e);
                        }
                    }}
                    className="flex-grow mr-2 p-2 border rounded-lg"
                    disabled={!user}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!user}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default MessageForm;
