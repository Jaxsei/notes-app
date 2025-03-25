import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ command, lang }) => {  // Proper destructuring
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command)    // Use the command as a string
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="bg-gray-950 text-gray-200 rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 px-4 py-3">
        <span className="text-sm text-gray-400">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Block */}
      <div className="p-6">
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          $ {command}
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
