import React from "react";
import "./css/message.css";

function Message({ message, time, sender }) {
    return (
        <div className={`message ${sender === "You" ? "user" : "server"}`}>
            {sender === "You" ? (
                <>
                    <p>{message} : <strong>{sender}</strong></p>
                    <span className="user-message-time">{time}</span>
                </>
            ) : (
                <>
                    <p><strong>{sender}:</strong> {message}</p>
                    <span className="server-message-time">{time}</span>
                </>
            )}
        </div>
    );
}

export default Message;
