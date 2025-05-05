export default function ChatMessage({role, content}:{role:string, content:string}) {
    return role === "user" ? (
        <div className="w-full items-start">
            <p className="w-[40%]">{content}</p>
        </div>
    ) : (
        <div className="w-full items-end">
            <p className="w-[40%]">{content}</p>
        </div>
    )
}