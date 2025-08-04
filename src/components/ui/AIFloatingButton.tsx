
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

const AIFloatingButton = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the button after 3 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate("/ai");
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-[#2E5BFF] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 animate-fade-in"
      aria-label="AI Assistant"
    >
      <Bot size={20} />
      <span>Ask AI</span>
    </button>
  );
};

export default AIFloatingButton;
