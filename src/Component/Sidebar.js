import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";

function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    function joinRoom(room, isPublic = true) {
        if (!user) {
            alert("Please login");
            return;
        }
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);

        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        dispatch(resetNotifications(room));
    }

    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
        }
    }, []);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
        return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
    }

    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId, false);
    }

    if (!user) return null;

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg space-y-6">
            <div className="text-lg font-semibold text-gray-800 dark:text-white">Available Rooms</div>
            <div className="space-y-2">
                {rooms.map((room, idx) => (
                    <div
                        key={idx}
                        onClick={() => joinRoom(room)}
                        className={`p-2 flex justify-between items-center rounded-lg cursor-pointer transition ${
                            room === currentRoom ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        <span>{room}</span>
                        {currentRoom !== room && user.newMessages[room] && (
                            <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                                {user.newMessages[room]}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-lg font-semibold text-gray-800 dark:text-white">Members</div>
            <div className="space-y-2">
                {members.map((member) => (
                    <div
                        key={member.id}
                        onClick={() => handlePrivateMemberMsg(member)}
                        className={`p-2 flex items-center rounded-lg cursor-pointer transition ${
                            privateMemberMsg?._id === member?._id ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        disabled={member._id === user._id}
                    >
                        <div className="flex items-center space-x-3">
                            <img src={member.picture} alt={member.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-sm font-medium">{member.name} {member._id === user._id && "(You)"}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{member.status === "online" ? "Online" : "Offline"}</p>
                            </div>
                        </div>
                        {user.newMessages[orderIds(member._id, user._id)] > 0 && (
                            <span className="ml-auto px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                                {user.newMessages[orderIds(member._id, user._id)]}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
