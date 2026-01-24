
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="overflow-x-hidden min-h-[calc(100vh-80px)]">{children}</main>
            <Footer />
        </>
    );
}
