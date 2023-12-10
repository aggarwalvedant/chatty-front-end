import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Cookies from 'js-cookie';

const SERVER_URL = 'https://chattyserver-8wwk.onrender.com';  // Replace with your actual server URL

function App() {
    const [chats, setChats] = useState([]);
    const [name, setName] = useState([]);


    const requestNotificationPermission = () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then((permission) => {
                console.log('Notification permission:', permission);
            });
        }
    };

    const showNotification = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Chat App', {
                body: message,
            });
        }   else {
            requestNotificationPermission();
        }
    };


    const setCookie = () => {
        const username = prompt("Please enter your name:");
        if (username) {
            Cookies.set('username', username);
            setName(username);
            showNotification('Username set successfully!');
        }

    }
    const fetchChats = async () => {
        try {
            await axios.get(`${SERVER_URL}/`).then((response) => {
                setChats(response.data);
            });
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }

    const postChat = async (message) => {
        try {
            await axios.post(`${SERVER_URL}/chats`, {
                name: name,
                message,
                time: new Date().toLocaleTimeString()
            });
            fetchChats()
            showNotification('Message sent successfully!');
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const nameWithCookies = () => {
        const username = Cookies.get('username');
        if (username) {
            setName(username)
        } else {
            setCookie()
        }
    }

    useEffect(() => {
        nameWithCookies()
        fetchChats().then();
        requestNotificationPermission()
    }, );


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome {name}</h1>

            <div className="border p-4 rounded shadow">
                {/* Chat Messages */}
                <div className="mb-4">
                    {chats.map((chat, index) => (
                        <div key={index} className="mb-2">
                            <strong>{chat.name}:</strong> {chat.message} <span
                            className="text-gray-500">{chat.time}</span>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="border p-2 w-full rounded"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                postChat(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                        onClick={() => {
                            const messageInput = document.querySelector('input');
                            postChat(messageInput.value);
                            messageInput.value = '';
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
