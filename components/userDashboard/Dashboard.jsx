"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // or react-toastify if installed
import axios from "axios";

// Components
import Sidebar from "@/components/user-dashboard-components/Sidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import HomeDashboard from "@/components/user-dashboard-components/HomeDashboard";
import AllListingWithFilter from "@/components/user-dashboard-components/AllListingWithFilter";
import ProfilePage from "@/components/user-dashboard-components/ProfilePage";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import useAuthStore from "@/store/authStore";


export default function MainDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { checkAuth, role } = useAuthStore();


    useEffect(() => {
        const verifyAccess = async () => {
            const auth = await checkAuth(); // updates store

            if (!auth) {
                toast.error("You must login first!");
                return router.push("/admin/login");
            }

            if (role !== "user") {
                toast.error("Access denied! Redirecting...");
                return router.push("/admin/dashboard");     // redirect non-admins
            }

            setLoading(false); // user is admin, allow access
        };

        verifyAccess();
    }, [router, checkAuth, role]);

    //   useEffect(() => {
    //     const checkAuth = async () => {
    //       setLoading(true);
    //       try {
    //         const res = await axios.get(`${API}/check-auth`, {
    //           withCredentials: true,
    //         });

    //         if (res.status === 200) setLoading(false);
    //       } catch (err) {
    //         toast.error("Unauthorized access!");
    //         router.push("/admin/login");
    //       } finally {
    //         setLoading(false);
    //       }
    //     };

    //     checkAuth();
    //   }, [router, API]);

    const renderContent = () => {
        switch (activeTab) {
            case "All Listings":
                return <AllListingWithFilter />;

            case "Profile":
                return <ProfilePage />;

            case "Analytics":
                return <AnalyticsDashboard />;
            case "Revenue":
                return <div>Revenue Tab</div>;
            default:
                return <HomeDashboard />;
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 fixed inset-y-0 left-0 z-30">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
                {/* Topbar */}
                <AdminHeader />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
            </div>
        </div>
    );
}
