interface HeaderProps {
  isDestructive: boolean;
}

export default function Header({ isDestructive }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center z-50">
      <div
        className={`relative px-8 py-3 text-2xl font-bold font-mono tracking-widest aircraft-panel ${
          isDestructive ? 'warning' : ''
        }`}
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 97% 65%, 80% 100%, 63% 100%, 60% 95%, 40% 95%, 37% 100%, 20% 100%, 3% 65%)",
          borderRadius: "12px",
        }}
      >
        <div
          className={`aircraft-text ${
            isDestructive ? 'warning' : ''
          } relative z-10`}
        >
          OJASS 2026
        </div>
      </div>
    </div>
  );
}