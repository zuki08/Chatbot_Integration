import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
    useEffect(() => {
        fetch("http://localhost:8080/api/flush")
        .then(res => {
            if(!res.ok) {
                alert("Issue with backend");
            }
        });
    }, [])
    const [value, setValue] = useState("");
    type Message = {
        role: string,
        content: string
    }
    const [messages, setMessages] = useState<Message[]>([]);
    async function handlePost() {
        messages.push({"role": "user", "content": value})
        setMessages(messages);
        const res = await fetch("http://localhost:8080/api/message", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"role": "user", "content": value})
        })
        const reader = res.body?.getReader();
        if(reader === undefined) return;
        const decoder = new TextDecoder('utf-8');
        let partialText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            partialText += JSON.parse(chunk.trim().split("\n")[0]).choices?.[0].delta?.content;

            // Update the last assistant message or add a new one
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                    return [...prev.slice(0, -1), { ...last, content: partialText }];
                } else {
                    return [...prev, { role: 'assistant', content: chunk }];
                }
            });
        }
    }
    return (
        <div className="flex flex-col w-[30%] h-[80%] border-2 border-gray-200 bg-white rounded-md">
            <div className="flex flex-col mx-[1%] my-[0.5%] h-[89%] overflow-y-scroll rounded-md bg-gray-300 dark:bg-black w-full">
                {messages.map((e, idx) => {
                    return (
                        <ChatMessage key={idx} role={e.role} content={e.content} />
                    )
                })}
            </div>
            <div className="flex mx-[1%] my-[0.5%] h-[9%] bg-gray-300 dark:bg-black items-center justify-center">
                <input 
                    value={value} 
                    placeholder="Message here" 
                    onChange={e => setValue(e.target.value)}
                    className="m-1 p-2 w-[79%] border-1 border-red-500 rounded-md" />
                <button className="w-[19%] h-[50%] m-1 bg-blue-400 rounded-md" onClick={handlePost}>Post</button>
            </div>
        </div>
    );
}