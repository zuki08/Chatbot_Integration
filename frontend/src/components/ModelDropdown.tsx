export default function ModelDropdown({model, setModel}:{model:string, setModel:React.Dispatch<React.SetStateAction<string>>}) {
    type ModelOptions = {
        name:string;
        APIName:string;
    };
    const options:ModelOptions[] = [
        {"name": "", "APIName": ""},
        {"name": "Llama 3.1 8b", "APIName": "meta-llama/llama-3.1-8b-instruct:free"},
        {"name": "Qwen 1.7b", "APIName":"qwen/qwen3-1.7b:free"},
        {"name": "Qwen 30b a3b", "APIName": "qwen/qwen3-30b-a3b:free"},
        {"name": "Deepseek v3 0324", "APIName":"deepseek/deepseek-chat-v3-0324:free"},
        {"name": "Mistral Small 24b", "APIName":"mistralai/mistral-small-24b-instruct-2501:free"}
    ]
    return (
        <div>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
                {options.map((e, idx) => {
                    return <option value={e.APIName} key={e.name+idx}>{e.name}</option>
                })}
            </select>
        </div>
    )
}