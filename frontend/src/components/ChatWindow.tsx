import { useState } from "react";

export default function ChatWindow() {
    const [value, setValue] = useState("");
    return (
        <div className="flex flex-col w-[30%] h-[80%] border-2 border-gray-200 bg-white rounded-md">
            <div className="flex flex-col mx-[1%] my-[0.5%] h-[89%] overflow-y-scroll rounded-md bg-gray-300 dark:bg-black">

            </div>
            <div className="flex mx-[1%] my-[0.5%] h-[9%] bg-gray-300 dark:bg-black">
                <input 
                    value={value} 
                    placeholder="Message here" 
                    onChange={e => setValue(e.target.value)}
                    className="p-2 w-[80%] border-1 border-red-500 rounded-md" />
                <button className="w-[20%] m-1 bg-blue-400">Post</button>
            </div>
        </div>
    );
}