import React from "react";
import "./chat.css";

function ChatWithJobSeeker() {

  const sendMessage = () => {
    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");

    if (input.value.trim() === "") return;

    const time = new Date().toLocaleTimeString();

    // Employer message
    const employerMsg = document.createElement("div");
    employerMsg.className = "chat-message employer";
    employerMsg.innerHTML = `
      <div class="chat-text">${input.value}</div>
      <small class="chat-time">Employer - ${time}</small>
    `;
    chatBox.appendChild(employerMsg);

    input.value = "";

    // Auto reply
    setTimeout(() => {
      const seekerMsg = document.createElement("div");
      seekerMsg.className = "chat-message seeker";
      seekerMsg.innerHTML = `
        <div class="chat-text">Thanks for your message! I'll check it.</div>
        <small class="chat-time">Job Seeker - ${new Date().toLocaleTimeString()}</small>
      `;
      chatBox.appendChild(seekerMsg);

      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);

    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-page">

      <h3>Chat with Job Seeker</h3>

      <div className="chat-box" id="chatBox">
        <div className="chat-empty">
          No messages yet. Start the conversation!
        </div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          id="chatInput"
          placeholder="Type message..."
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}

export default ChatWithJobSeeker;
