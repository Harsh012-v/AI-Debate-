import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <span className="text-black font-bold text-xl">R</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight gradient-text">Reflex</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/history" className="text-sm text-secondary hover:text-white transition-colors">History</Link>
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}
