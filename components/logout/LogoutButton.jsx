"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Logged out successfully");
                router.push("/admin/login"); // redirect to login page
            } else {
                toast.error("Failed to logout");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </Button>
    );
}
