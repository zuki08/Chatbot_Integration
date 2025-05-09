import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({model}:{model:string}) {
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
  
  useEffect(() => {
    const container = document.getElementById("chat-window");
    if(container === null) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  function handleDownload() {
    const a = document.createElement("a");
    const objURL = URL.createObjectURL(new Blob([JSON.stringify(messages)], {type:"text"}));
    a.href = objURL;
    a.download = `chat_history+${Date.now()}.txt`
    a.click();
    URL.revokeObjectURL(objURL);
  }

  function handleMsgPush() {
    if(model == "") {
      alert("Select a model!");
      return;
    }
    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputValue },
      { role: "assistant", content: "" }
    ]);
    setInputValue("");
  }
  async function handlePost() {
    if(model === "") return;
    const res = await fetch("http://localhost:8080/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "user", content: inputValue, model}),
    });
    const reader = res.body?.getReader();
    if (reader === undefined) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const data = decoder.decode(value, { stream: true })
      const buffer = data.split("\n");
      for(let objStr of buffer){
        if(objStr.startsWith("data:")) objStr = objStr.substring(5);
        if(objStr.length > 0) {
          // console.log(objStr);
          const obj = JSON.parse(objStr);
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1]
            const otherMessages = messages.slice(0, messages.length - 1)
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + obj.content },
            ]
          })
        }  
      }
    }    
  }
  return (
    <div className="flex flex-col w-[70%] h-[90%] md:w-[35%] md:h-[80%] border-2 border-gray-200 bg-white dark:bg-black dark:border-none rounded-md">
      <div id="chat-window" className="flex flex-col mx-[1%] my-[0.5%] h-[89%] overflow-y-scroll rounded-md bg-gray-300 dark:bg-black scroll-smooth">
        {messages.map((e, idx) => {
          return (
            <div className={e.role === "user" ? "flex flex-row-reverse" : ""} key={e.role+idx}>
              <ChatMessage role={e.role} content={e.content} />
            </div>
          )
        })}
      </div>
      <div className="flex mx-[1%] my-[0.5%] h-[9%] bg-gray-300 dark:bg-black dark:text-white items-center justify-center">
        <input
          value={inputValue}
          placeholder="Message here"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyUp={(e) => {
            if(e.key === "Enter") {
              handleMsgPush();
              handlePost();
            }
          }}
          className="m-1 p-2 w-[79%] border-1 border-red-500 rounded-md overflow-scroll"
        />
        <button
          className="w-[19%] h-[50%] m-1 bg-blue-400 rounded-md"
          onClick={async () => {handleMsgPush(); await handlePost();}}
        >
          Post
        </button>
      </div>
      <button
        className="w-full dark:text-white"
        onClick={handleDownload}
      >
        Download Chat History
      </button>
    </div>
  );
}
