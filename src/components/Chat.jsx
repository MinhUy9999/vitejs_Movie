import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Drawer, List, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Fetch user ID from local storage
const userID = parseInt(localStorage.getItem('userID'), 10);
if (isNaN(userID)) {
  console.error("Invalid User ID in localStorage");
}

const otherUserID = 2;
const room = `chat_${Math.min(userID, otherUserID)}_${Math.max(userID, otherUserID)}`;
const isAdmin = false;

const wsUrl = `ws://localhost:8080/ws?room=${encodeURIComponent(room)}&admin=${isAdmin}&userID=${userID || ''}`;

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const scrollAreaRef = useRef(null);
  const ws = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/chat/messages?room=${room}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        console.error('Failed to fetch messages:', data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to chat server in room:', room);
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [room]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open');
        return;
      }

      const msgObject = {
        userID: userID || null,
        messageText: message,
        room: room,
      };

      try {
        ws.current.send(JSON.stringify(msgObject));
        setMessages((prevMessages) => [...prevMessages, { ...msgObject, isAdmin }]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <div className="chat-container">
      {/* Chat Toggle Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        style={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={toggleDrawer}
      />

      {/* Chat Drawer */}
      <Drawer
        title="Chat Room"
        placement="right"
        width={320}
        onClose={toggleDrawer}
        visible={isDrawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <div ref={scrollAreaRef} className="h-80 overflow-y-auto p-4">
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Typography.Text type={msg.isAdmin ? 'danger' : 'secondary'}>
                      {msg.isAdmin ? 'Admin' : `User ${msg.userID || 'Guest'}`}
                    </Typography.Text>
                  }
                  description={msg.text || msg.messageText}
                />
              </List.Item>
            )}
          />
        </div>
        <div className="p-4 border-t">
          <TextArea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onPressEnter={sendMessage}
          />
          <Button type="primary" block onClick={sendMessage} className="mt-2">
            Send
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
