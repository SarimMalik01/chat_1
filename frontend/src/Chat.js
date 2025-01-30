import React, { use, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Message from "./message";
import { v4 as uuidv4 } from "uuid";
import "./css/Chat.css"
import messageReceieved from "./sound/messsage_Received.mp3"
import message_Sent from "./sound/message_Sent.mp3"
import user_joined from "./sound/user_joined.mp3"

const socket = io("http://localhost:3000/");

function Chat() {
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [notification,setNotification]=useState("");
    const [isConnect,setConnection]=useState(true);
   
   
    let typingTimer;

    function playMessageReceievedSound(){
        console.log("playNotificationSound triggered")
     const audio=new Audio(messageReceieved);
     audio.play().catch((err)=>{console.log(err)});
    }
     

    function playMessageSentSound(){
        console.log("playNotificationSound triggered")
        const audio=new Audio(message_Sent);
        audio.play().catch((err)=>{console.log(err)});

    }
    
    function playuserJoinedSound(){
        console.log("playUserJoined triggered")
        const audio=new Audio(user_joined);
        audio.play().catch((err)=>{console.log(err)});

    }


    useEffect(() => {
        socket.on("server message", (msg) => {
            if(msg.uid!=socket.id)
            {
            setAllMessages((prevMessages) => [...prevMessages, { id: uuidv4(), text: msg.message, time: new Date().toLocaleTimeString(), sender: "Server" }]);
           playMessageReceievedSound();
            console.log("A new message appeared")
            }
          
        });

        socket.on("user connected",(msg)=>{
            console.log("user connected");
            setNotification("A new user  has joined the chat");
            setTimeout(()=>{
               setNotification("");
            },3000)
            playuserJoinedSound();
        })

        socket.on("user disconnected",(msg)=>{
            console.log("msg ",msg);
            setNotification(msg);
            setTimeout(()=>{
               setNotification("");
            },3000)
        })

        socket.on("typing", (msg) => {
            console.log("caught typing");
        
            if (msg.uid !== socket.id) {
                console.log("user typing ");
        
                if (msg.state) {
                    setAllMessages((prevMessages) => {
                        const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
        
                        if (lastMessage == null || lastMessage.text !== "Typing") {
                            return [
                                ...prevMessages,
                                { id: uuidv4(), text: "Typing", time: new Date().toLocaleTimeString(), sender: "Server" }
                            ];
                        }
                        return prevMessages;
                    });
                } else {
                    setAllMessages((prevMessages) => {
                        return prevMessages.filter((msg) => msg.text !== "Typing");
                    });
                }
            }
        });
        
        return () => {
            socket.off("server message");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("typing");
        };
    }, []);
    

    function handleDisconnect(){
        console.log("diconnect button clciked")
      socket.emit("disconnected","user has left")
      setConnection((prevState)=>!prevState);
      console.log({isConnect})
      socket.disconnect();
    }
    

    function handleChange(e)
    {
       
        setMessage(e.target.value);
        socket.emit("typing",{state:true,uid:socket.id});
        
        clearTimeout(typingTimer);
        typingTimer=setTimeout(()=>{
            socket.emit("typing",{state:false,uid:socket.id})
            
        },2800);
    }




    function handleSubmit(e) {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: uuidv4(),
            text: message,
            time: new Date().toLocaleTimeString(),
            sender: "You"
        };

        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("user message", {message:message , uid:socket.id});
        setMessage("");
        playMessageSentSound();
    }

    return (
        <div className="Chat-container">
            <div className="Disconnect-button">
                <button disabled={isConnect==false}onClick={handleDisconnect}>{isConnect==false?"Refresh the page to join again":"Disconnect"}</button>
            </div>
            {notification!="" && <div className="notification">
                <h1>{notification}</h1> </div>}
            <div className="Chat-messages-container">
               
                      {allMessages.map((msg) => (
                        <Message key={msg.id} message={msg.text} time={msg.time} sender={msg.sender} />
                    ))}
                
            </div>
            <div className="Chat-Type-container">
                <div className="Typing-section">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={message}
                            placeholder="Type a message"
                            onChange={(e) =>handleChange(e) }
                        />
                        <button type="submit"
                        disabled={isConnect==false}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;
