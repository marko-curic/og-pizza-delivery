import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {Bell} from "lucide-react";
import useWebSocket from "../webhook/useWebSocket";
import "./Notifications.css";

const Notifications = () => {
    const user = useContext(AuthContext)?.user;
    const messages = useWebSocket(user!!.role);

    const [isOpen, setIsOpen] = useState(false);
    const [seenCount, setSeenCount] = useState(0);

    const toggleNotifications = () => {
        if (!isOpen) setSeenCount(messages.length);
        setIsOpen(!isOpen);
    };

    const unseenCount = messages.length - seenCount;

    return (
        <div className="notification-container">
            <button onClick={toggleNotifications} className="notification-icon">
                <Bell size={20} className="icon" />
                {unseenCount > 0 && <span className="notification-badge">{unseenCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <h3 className="dropdown-header">{messages.length === 0 ? "No new notifications" : ""}</h3>
                    <ul className="notification-list">
                        {messages.map((msg, index) => (
                            <li key={index} className="notification-item">{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;
