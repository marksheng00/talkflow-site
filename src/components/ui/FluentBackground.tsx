export default function FluentBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Emerald Blob (Top Left) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] animate-blob-one mix-blend-screen" />

            {/* Teal Blob (Top Right) */}
            <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-teal-600/10 rounded-full blur-[120px] animate-blob-two mix-blend-screen" style={{ animationDelay: '2s' }} />

            {/* Blue Blob (Bottom Left) */}
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] animate-blob-three mix-blend-screen" style={{ animationDelay: '4s' }} />

            {/* Grid Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}
