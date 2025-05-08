import { useState } from 'react'
import './App.css'
import ChatWindow from './components/ChatWindow'
import ModelDropdown from './components/ModelDropdown';

function App() {
  document.title = "Chatbot"
  const [model, setModel] = useState("");
  return (
    <div className='flex flex-col w-full h-screen bg-blue-200 dark:bg-black items-center justify-center'>
      <ModelDropdown setModel={setModel} model={model}/>
      <ChatWindow model={model}/>
    </div>
  )
}

export default App
