export default function ModelDropdown({model, setModel}:{model:string, setModel:React.Dispatch<React.SetStateAction<string>>}) {
    type ModelOptions = {
        name:string;
        APIName:string;
    };
    const options:ModelOptions[] = [
        {"name": "", "APIName": ""},
        {"name": "Llama 3.1 8b", "APIName": "meta-llama/llama-3.1-8b-instruct:free"},
        {"name": "Qwen 30b a3b", "APIName": "qwen/qwen3-30b-a3b:free"},
        {"name":"Deepseek v3 0324", "APIName":"deepseek/deepseek-chat-v3-0324:free"}
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