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
    const [isMobile, setIsMobile] = useState(false);



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


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
        handleResize(); // check on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


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
    if (isMobile) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center max-w-sm">

                    {/* Icon */}
                    <div className="mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 mx-auto text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                            />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h2 className="text-lg font-medium text-gray-800 mb-2 font-lucid">
                        Desktop Mode Recommended
                    </h2>

                    {/* Subtext */}
                    <p className="text-gray-500 mb-4 text-sm">
                        Please open this dashboard on a desktop for the best experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-3">

                        {/* Back/Home Button */}
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 
               text-sm rounded-lg font-medium transition border"
                        >
                            ← Back to Home
                        </button>

                        {/* List Now Button */}
                        <button
                            onClick={() => (window.location.href = "/listing/create")}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
               text-sm rounded-lg font-medium transition shadow"
                        >
                            + List Now
                        </button>

                    </div>


                </div>
            </div>
        );

    }


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
