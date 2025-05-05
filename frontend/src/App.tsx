import './App.css'
import ChatWindow from './components/ChatWindow'

function App() {
  document.title = "Chatbot"
  return (
    <div className='flex flex-col w-full h-screen bg-blue-200 dark:bg-black items-center justify-center'>
      <ChatWindow />
    </div>
  )
}

export default App
