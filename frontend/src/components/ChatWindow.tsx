import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
  useEffect(() => {
    fetch("http://localhost:8080/api/flush").then((res) => {
      if (!res.ok) {
        alert("Issue with backend");
      }
    });
  }, []);
  const [inputValue, setInputValue] = useState("");
  type Message = {
    role: string;
    content: string;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  async function handlePost() {
    messages.push({ role: "user", content: inputValue });
    setMessages(messages);
    const res = await fetch("http://localhost:8080/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: inputValue }),
    });
    messages.push({ role: "assistant", content: ""});
    setMessages(messages);
    const reader = res.body?.getReader();
    if (reader === undefined) return;
    const decoder = new TextDecoder();
    const { done, value } = await reader.read();
    if (done) {
      //pass
    }
    const decoded = decoder.decode(value, { stream: true });
    const data: Array<Message> = JSON.parse(decoded);
    for (const obj of data) {
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + obj.content },
        ];
      });
    }
    setInputValue("");
  }
  return (
    <div className="flex flex-col w-[30%] h-[80%] border-2 border-gray-200 bg-white rounded-md">
      <div className="flex flex-col mx-[1%] my-[0.5%] h-[89%] overflow-y-scroll rounded-md bg-gray-300 dark:bg-black">
        {messages.map((e, idx) => {
          return <ChatMessage key={idx} role={e.role} content={e.content} />;
        })}
      </div>
      <div className="flex mx-[1%] my-[0.5%] h-[9%] bg-gray-300 dark:bg-black items-center justify-center">
        <input
          value={inputValue}
          placeholder="Message here"
          onChange={(e) => setInputValue(e.target.value)}
          className="m-1 p-2 w-[79%] border-1 border-red-500 rounded-md overflow-scroll"
        />
        <button
          className="w-[19%] h-[50%] m-1 bg-blue-400 rounded-md"
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
}
