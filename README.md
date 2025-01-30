
### Overview:
The app allows users to send and receive messages in real-time. It also supports notifications for when a new user joins or leaves the chat. Additionally, it provides an indicator when a user is typing, and it plays sound notifications for message reception, message sending, and when a user joins the chat.

### Key Features:
1. **Real-time Messaging**: 
   - Users can send and receive messages instantly. Messages are broadcasted to all users connected to the server.
   - The messages are displayed with a timestamp and sender information.

2. **Typing Indicator**:
   - The app shows a "Typing" message when another user is typing. The typing indicator is managed through the `typing` event sent via Socket.IO.

3. **User Notifications**:
   - When a new user joins the chat, a notification is displayed. Similarly, when a user disconnects, the app shows a notification.

4. **Sound Notifications**:
   - Different sounds play for various events:
     - **Message Received**: Plays when a new message is received.
     - **Message Sent**: Plays when a user sends a message.
     - **User Joined**: Plays when a new user joins the chat.

5. **Connection Management**:
   - Users can disconnect from the server via a button. Once disconnected, users can reconnect by refreshing the page.

### Structure:
- **React Frontend**:
  - The app uses React hooks (`useState`, `useEffect`) to manage states like messages, notifications, and connection status.
  - It listens for events from the server (message, user connection, typing, etc.) and updates the UI accordingly.
  - The `Message` component is used to render individual messages.

- **Socket.IO Server**:
  - The backend uses Socket.IO to facilitate real-time communication between the client and the server.
  - The server listens for messages (`user message`), user connection (`user connected`), disconnections (`disconnected`), and typing events (`typing`).
  - On each event, the server broadcasts the relevant information to all connected clients.

### Flow:
1. **User Joins**: When a user joins, a `user connected` event is emitted, notifying all other users that a new user has joined.
2. **Sending a Message**: When a user sends a message, the `user message` event is emitted to the server. The server then broadcasts it to all connected users.
3. **Receiving a Message**: When the server emits a `server message`, the message is displayed on all connected clients.
4. **Typing Event**: When a user starts typing, the app sends a `typing` event to the server, which then broadcasts the "typing" status to other users.
5. **User Disconnects**: When a user disconnects, a `disconnected` event is sent to the server, and the server notifies all clients about the disconnection.

### Files:
- `Chat.js`: The main React component for handling chat interactions, rendering messages, and managing user input.
- `messageReceived.mp3`, `message_Sent.mp3`, `user_joined.mp3`: Audio files used for sound notifications.
- `Chat.css`: CSS file for styling the chat interface.
- `server.js`: The backend file that sets up the Socket.IO server, handling user connections, messages, and typing events.

This project can be used as the base for creating a real-time chat application with the potential to expand its features (such as adding private messages, user authentication, or chat rooms).