
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { NavbarButton } from "@/components/ui/SiteNavbar";

export default function NotFound() {
    return (
        <AuroraBackground className="flex min-h-screen flex-col items-center justify-center text-center">
            <div className="z-10 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-6xl font-black text-white md:text-8xl">404</h2>
                <p className="text-xl text-slate-400">Page not found</p>
                <p className="max-w-md text-slate-500 text-balance">
                    Sorry, we couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
                </p>
                <NavbarButton
                    href="/"
                    variant="primary"
                    className="mt-4 rounded-xl px-8 py-3 text-base"
                >
                    Return Home
                </NavbarButton>
            </div>
        </AuroraBackground>
    )
}
