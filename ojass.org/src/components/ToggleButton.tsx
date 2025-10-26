interface FooterProps {
  isDestructive: boolean;
  onToggle: () => void;
}

export default function ToggleButton({ isDestructive, onToggle }: FooterProps) {
  return (
    <button 
      className={`fixed top-4 right-4 p-3 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
        isDestructive 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-red-600 hover:bg-red-700'
      }`}
      onClick={onToggle}
      title={isDestructive ? "Constructive Mode" : "Destructive Mode"}
    >
      {isDestructive ? (
        // Constructive Icon (Repair/Tool)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      ) : (
        // Destructive Icon (Warning)
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
      )}
    </button>
  );
}