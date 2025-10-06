// "use client"
// import { useState, useEffect, useRef } from 'react';
//
// const Index = () => {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef<WebSocket | null>(null);
//     const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//
//     useEffect(() => {
//         const connectWebSocket = () => {
//             if (typeof window === "undefined") return;
//
//             // Connect directly to port 3001 where WebSocket server is running
//             const ws = new WebSocket('ws://localhost:3001');
//
//             ws.onopen = () => {
//                 console.log('WebSocket connected to port 3001');
//                 setIsConnected(true);
//
//                 pingIntervalRef.current = setInterval(() => {
//                     if (ws.readyState === WebSocket.OPEN) {
//                         ws.send(JSON.stringify({ event: "ping" }));
//                     }
//                 }, 29000);
//             };
//
//             ws.onmessage = (event) => {
//                 if (event.data === "connection established") return;
//                 console.log('Message received:', event.data);
//                 setMessages((prevMessages) => [...prevMessages, event.data]);
//             };
//
//             ws.onerror = (error) => {
//                 console.error('WebSocket error:', error);
//             };
//
//             ws.onclose = (event) => {
//                 console.log('WebSocket closed:', event.code, event.reason);
//                 setIsConnected(false);
//
//                 if (pingIntervalRef.current) {
//                     clearInterval(pingIntervalRef.current);
//                 }
//
//                 reconnectTimeoutRef.current = setTimeout(() => {
//                     console.log('Attempting to reconnect...');
//                     connectWebSocket();
//                 }, 3000);
//             };
//
//             wsRef.current = ws;
//         };
//
//         connectWebSocket();
//
//         return () => {
//             if (reconnectTimeoutRef.current) {
//                 clearTimeout(reconnectTimeoutRef.current);
//             }
//             if (pingIntervalRef.current) {
//                 clearInterval(pingIntervalRef.current);
//             }
//             if (wsRef.current) {
//                 wsRef.current.close();
//             }
//         };
//     }, []);
//
//     const sendMessage = () => {
//         if (wsRef.current?.readyState === WebSocket.OPEN && newMessage.trim()) {
//             wsRef.current.send(newMessage);
//             setNewMessage('');
//         }
//     };
//
//     return (
//         <div className="p-8">
//             <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>
//             <div className="mb-4">
//                 Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
//             </div>
//             <div className="border border-gray-300 rounded p-4 mb-4 h-64 overflow-y-auto bg-white">
//                 {messages.length === 0 ? (
//                     <p className="text-gray-500">No messages yet...</p>
//                 ) : (
//                     messages.map((message, index) => (
//                         <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
//                             {message}
//                         </div>
//                     ))
//                 )}
//             </div>
//             <div className="flex gap-2">
//                 <input
//                     type="text"
//                     className="border border-gray-400 rounded p-2 flex-1"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                     placeholder="Type your message..."
//                     disabled={!isConnected}
//                 />
//                 <button
//                     onClick={sendMessage}
//                     disabled={!isConnected}
//                     className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600 disabled:hover:bg-gray-400"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default Index;
"use client"
import SignIn from "@/components/SignIn";

const Index = () => {
    return (
        <div>
            <h1>Sign in</h1>
            <SignIn/>
        </div>
    );
};

export default Index;
