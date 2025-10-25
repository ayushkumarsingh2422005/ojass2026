// Example component showing how to use the DestructiveContext in any page/component
"use client";
import { useDestructive } from "../contexts/DestructiveContext";

export default function ExampleComponent() {
  const { isDestructive, setIsDestructive, toggleDestructive } = useDestructive();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Destructive State Example</h2>
      
      <div className="space-y-4">
        <p>Current state: {isDestructive ? "DESTRUCTIVE MODE" : "Normal Mode"}</p>
        
        <div className="space-x-2">
          <button 
            onClick={() => setIsDestructive(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Enable Destructive Mode
          </button>
          
          <button 
            onClick={() => setIsDestructive(false)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Disable Destructive Mode
          </button>
          
          <button 
            onClick={toggleDestructive}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Mode
          </button>
        </div>
      </div>
    </div>
  );
}
