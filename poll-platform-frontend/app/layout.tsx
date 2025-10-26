import "../src/styles/globals.css";
import { ToastProvider } from "../src/components/Toast";
import HeaderNav from "../src/components/HeaderNav"; // client component

export const metadata = {
    title: "Poll Platform",
    description: "Create and vote on polls live",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
                <ToastProvider>
                    <HeaderNav />
                    <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
                    <footer className="bg-gray-100 text-center py-3 text-sm text-gray-500">
                        © {new Date().getFullYear()} Poll Platform — Built by Rajiv Kumar Yadav
                    </footer>
                </ToastProvider>
            </body>
        </html>
    );
}
