export default function ChatMessage({role, content}:{role:string, content:string}) {
    return role === "assistant" ? (
        <div className="flex w-full text-start m-2">
            <p className="w-[90%]">{content}</p>
        </div>
    ) : (
        <div className="flex w-full justify-end text-right p-2">
            <p className="w-[90%]">{content}</p>
        </div>
    )
}