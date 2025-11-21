"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Menu,
    Plus,
    User,
    LogIn,
    LogOut,
    KeyRound,
    ChevronDown,
    MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



export default function Navbar() {
    const { isAuthenticated } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    // Scroll to top on route change (optional)
    useEffect(() => {
        const handleRouteChange = () => window.scrollTo({ top: 0, behavior: "smooth" });
        window.addEventListener("hashchange", handleRouteChange);
        return () => window.removeEventListener("hashchange", handleRouteChange);
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Logged out successfully");
                router.push("/login"); // redirect to login page
            } else {
                toast.error("Failed to logout");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
        toast.success("Logout successful!");
    };

    return (
        <>
            {loading && <Loader />}
            <header className="w-full bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/images/logo.png"
                                alt="Odisha Bizz"
                                loading="lazy"
                                className="h-[50px] w-[140px] object-contain hidden sm:block"
                            />
                            <img
                                src="/images/logo.png"
                                alt="Odisha Bizz"
                                loading="lazy"
                                className="h-10 object-contain sm:hidden"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="font-medium text-gray-900 hover:text-[#249732]">
                            Home
                        </Link>
                        <Link href="/about" className="font-medium text-gray-900 hover:text-[#249732]">
                            About
                        </Link>
                        <Link href="/categories" className="font-medium text-gray-900 hover:text-[#249732]">
                            Categories
                        </Link>

                        <Button
                            asChild
                            className="flex items-center gap-2 bg-[#249732] hover:bg-green-700 text-white rounded-full px-5 py-2 font-medium shadow-md transition-all"
                        >
                            <Link href="/contact">
                                <MessageCircle className="w-5 h-5" /> Get In Touch
                            </Link>
                        </Button>

                        <div className="flex items-center gap-4">
                            {/* {isAuthenticated && (
                                <>
                                    <Button
                                        asChild
                                        className="flex items-center gap-2 bg-[#249732] hover:bg-green-700 text-white rounded-full px-5 py-2 font-medium shadow-md transition-all"
                                    >
                                        <Link href="/listing/create">
                                            <Plus className="w-5 h-5" /> Add Your One
                                        </Link>
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="cursor-pointer flex items-center gap-2 bg-[#012a7a] hover:bg-[#001846] text-white rounded-full px-6 py-2 shadow-md transition-all">
                                                <User className="w-5 h-5" />
                                                <span className="font-medium">Dashboard</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="mt-2 w-44 rounded-xl shadow-lg border bg-white">
                                            <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
                                                Account
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                                                    <User className="w-4 h-4" /> My Dashboard
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/forgot-password" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                                                    <KeyRound className="w-4 h-4" /> Reset Password
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer">
                                                <LogOut className="w-4 h-4" /> Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )} */}

                            {/* {!isAuthenticated && (
                                <Button
                                    onClick={() => alert("Go to login")}
                                    className="bg-[#012a7a] hover:bg-[#012a7a] text-white rounded-full px-6 py-2 shadow-md flex items-center gap-2"
                                >
                                    <LogIn className="w-5 h-5" /> Sign In
                                </Button>
                            )} */}
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6 text-gray-800" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-6 bg-white">
                                <nav className="flex flex-col gap-6 text-lg">
                                    <Link href="/" onClick={() => setOpen(false)} className="text-gray-900 hover:text-[#249732]">
                                        Home
                                    </Link>
                                    <Link href="/about" onClick={() => setOpen(false)} className="text-gray-900 hover:text-[#249732]">
                                        About
                                    </Link>
                                    <Link href="/categories" onClick={() => setOpen(false)} className="text-gray-900 hover:text-[#249732]">
                                        Categories
                                    </Link>
                                    <Link href="/contact" onClick={() => setOpen(false)} className="text-gray-900 hover:text-[#249732]">
                                        Contact
                                    </Link>

                                    {/* {isAuthenticated && (
                                        <Button
                                            onClick={() => setOpen(false)}
                                            className="bg-[#249732] hover:bg-green-700 text-white rounded-full px-5 py-2 shadow-md flex items-center gap-2"
                                        >
                                            <Plus className="w-5 h-5 mr-1" /> Add Your One
                                        </Button>
                                    )}

                                    {isAuthenticated ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="bg-[#012a7a] hover:bg-[#001846] text-white rounded-full px-6 py-2 shadow-md flex items-center gap-2">
                                                    <User className="w-5 h-5" />
                                                    Dashboard
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="mt-2 w-44 rounded-xl border bg-white shadow-lg">
                                                <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
                                                    Account
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-[#b6985a]">
                                                        <User className="w-4 h-4" /> My Dashboard
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin/forgot-password" className="flex items-center gap-2 text-gray-700 hover:text-[#b6985a]">
                                                        <KeyRound className="w-4 h-4" /> Reset Password
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer">
                                                    <LogOut className="w-4 h-4" /> Logout
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Button
                                            onClick={() => alert("Go to login")}
                                            className="bg-[#b6985a] hover:bg-[#a58648] text-white rounded-full px-6 py-2 shadow-md flex items-center gap-2"
                                        >
                                            <LogIn className="w-5 h-5" /> Sign In
                                        </Button>
                                    )} */}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}
