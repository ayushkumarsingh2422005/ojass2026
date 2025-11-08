
const Button = ({ onClick, content }: { onClick?: () => void, content?: string }) => {
    return (
        <button
            onClick={ onClick}
            className="px-4 py-2.5 text-xs font-mono uppercase transition-all backdrop-blur-sm border border-cyan-400/30 text-cyan-400/60  bg-cyan-400/20  hover:border-cyan-400/60 hover:bg-cyan-400/10 font-bold"
            style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
        >
            {content}
        </button >
    )
}

export default Button
