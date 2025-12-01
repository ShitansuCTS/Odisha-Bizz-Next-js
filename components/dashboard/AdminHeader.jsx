"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  KeyRound,
  ChevronDown,
  PlusCircle,
  List,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast"; // react-toastify can be replaced
import useProfileStore from "@/store/profileStore";


const AdminHeader = ({ activeTab }) => {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) fetchProfile(); // fetch profile if not loaded
  }, [profile, fetchProfile]);

  // Generate avatar URL dynamically
  const avatarName = profile?.name || "Admin"; // fallback to Admin
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    avatarName
  )}&background=5156be&color=fff`;




  // Theme toggling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Logged out successfully!");
        router.push("/admin/login"); // redirect to login
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <h1 className="text-xl font-semibold text-[#5156be] hidden md:block">
          {activeTab}
        </h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#5156be]"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Flag */}
        <img
          src="https://flagcdn.com/w20/in.png"
          alt="India Flag"
          loading="lazy"
          className="w-6 h-4 rounded-sm border"
        />

        {/* Options Dropdown */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-gray-700 hover:text-[#5156be]"
            >
              Options <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-1 rounded-md shadow-lg bg-white dark:bg-gray-800"
          >
            <DropdownMenuLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="px-2 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer rounded-md">
              <Link href="/listing/create" className="flex items-center gap-3 w-full">
                <PlusCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>New Post</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-2 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer rounded-md">
              <Link href="/categories" className="flex items-center gap-3 w-full">
                <List className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span>All Listings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="px-2 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer rounded-md">
              <Link href="/" className="flex items-center gap-3 w-full">
                <Home className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Back to Home</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none ">
              <img
                src={avatarUrl}
                alt="Profile"
                loading="lazy"
                className="w-9 h-9 rounded-full border"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link
                href="/admin/forgot-password"
                className="flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-[#5156be]" /> Forgot Password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left"
              >
                <LogOut className="w-4 h-4 mr-2 text-red-500" /> Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark/Light Toggle */}
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </Button> */}
      </div>
    </header>
  );
};

export default AdminHeader;
