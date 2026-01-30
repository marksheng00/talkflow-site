export default function FluentBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Emerald Blob (Top Left) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/15 rounded-full blur-[120px] animate-blob-one" />

            {/* Teal Blob (Top Right) */}
            <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-teal-500/15 rounded-full blur-[120px] animate-blob-two" style={{ animationDelay: '2s' }} />

            {/* Blue Blob (Bottom Left) */}
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-500/15 rounded-full blur-[120px] animate-blob-three" style={{ animationDelay: '4s' }} />

            {/* Grid Texture Overlay - CSS Based to avoid 404 */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
    );
}
