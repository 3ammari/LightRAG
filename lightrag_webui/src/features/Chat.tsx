import { useState } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    // Add the user's message to the conversation
    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])

    try {
      // Send the message to the API
      const response = await axios.post('/chat/seed_chat', { text: input })

      // Add the assistant's response to the conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message || 'Response received.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'An error occurred while processing your message.',
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    // Clear the input field
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              message.role === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-black self-start'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input field and send button */}
      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat