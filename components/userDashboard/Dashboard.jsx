"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { Clock } from "lucide-react";
// import loader from "@/components/loader/Loader"
import Loader from "@/components/loader/Loader";


const UserDashboard = () => {
    const router = useRouter();
    const { checkAuth, role } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAccess = async () => {
            const auth = await checkAuth(); // updates store

            if (!auth) {
                toast.error("You must login first!");
                return router.push("/admin/login"); // normal login page
            }

            if (role === "admin") {
                toast.error("Admins cannot access this page!");
                return router.push("/admin/dashboard");
            }

            setLoading(false); // user is allowed
        };

        verifyAccess();
    }, [router, checkAuth, role]);

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col items-center justify-center bg-red-50 p-20">
            <div className="bg-white shadow-md rounded-xl p-10 flex flex-col items-center space-y-4">
                <Clock className="w-12 h-12 text-blue-500 animate-pulse" />
                <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
                <p className="text-gray-500 text-center">
                    Coming soon! Your dashboard content will appear here shortly.
                </p>
            </div>
        </div>
    );
};

export default UserDashboard;
