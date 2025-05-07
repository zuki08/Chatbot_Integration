export default function ChatMessage({role, content}:{role:string, content:string}) {
    return role === "assistant" ? (
        <div className="flex w-fit max-w-[90%] m-2 bg-purple-400 rounded-md">
            <p className="w-full p-1">{content}</p>
        </div>
    ) : (
        <div className="flex w-fit max-w-[90%] justify-end text-right m-2 p-2 bg-pink-400 rounded-md">
            <p className="p-1">{content}</p>
        </div>
    )
}