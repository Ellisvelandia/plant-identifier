import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function Chat({ plants, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generatePrompt = (userInput) => {
    if (!plants || plants.length === 0) {
      return `I apologize, but I don't see any plants in your gallery to provide information about. Please add some plants first!`;
    }

    const plantsContext = plants
      .map(
        (plant, index) => `
Plant ${index + 1}:
- Name: ${plant.name}
- Scientific Name: ${plant.scientificName}
- Description: ${plant.description}
- Care Instructions: ${plant.care.join(", ")}
      `
      )
      .join("\n");

    return `You are a helpful plant expert assistant. You have access to the following plants in the user's gallery:

${plantsContext}

User Question: "${userInput}"

Please provide a detailed but concise response focusing on:
1. Specific information about the plants in their gallery
2. Care tips and recommendations
3. Common issues and solutions
4. Interesting facts when relevant

If the question isn't about plants in their gallery, politely mention you can only discuss plants they've identified.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = generatePrompt(input);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botMessage = response.text();

      setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I'm having trouble processing your request. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Plant Assistant</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center">
            {plants.length > 0
              ? "Ask me anything about the plants in your gallery!"
              : "Add some plants to your gallery first!"}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your plants..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          disabled={isLoading || plants.length === 0}
        />
        <button
          type="submit"
          className={`p-2 rounded-lg ${
            isLoading || plants.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
          disabled={isLoading || plants.length === 0}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default Chat;
