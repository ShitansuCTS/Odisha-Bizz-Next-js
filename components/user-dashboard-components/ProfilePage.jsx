// "use client";

// import React, { useEffect } from "react";
// import useProfileStore from "@/store/profileStore";

// export default function ProfilePage() {
//     const { profile, loading, error, fetchProfile } = useProfileStore();

//     useEffect(() => {
//         if (!profile) fetchProfile();
//     }, []);

//     if (loading) return <p className="text-center mt-10">Loading profile...</p>;
//     if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//     if (!profile) return <p className="text-center mt-10">No profile found</p>;

//     const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center items-start">
//             <div className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-2xl p-8 w-full max-w-5xl flex flex-wrap md:flex-nowrap gap-8 transition-all">

//                 {/* Avatar Section */}
//                 <div className="flex flex-col items-center md:items-start md:w-1/4 flex-shrink-0">
//                     <div className="w-24 h-24 rounded-full bg-indigo-600 dark:bg-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
//                         {avatarLetter}
//                     </div>
//                     <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 text-center md:text-left">{profile.name}</h2>
//                     <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
//                 </div>

//                 {/* Details Section */}
//                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
//                         <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
//                     </div>

//                     <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">Role</p>
//                         <p className="text-gray-900 dark:text-white font-medium">{profile.role}</p>
//                     </div>

//                     <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">Account Created</p>
//                         <p className="text-gray-900 dark:text-white font-medium">
//                             {new Date(profile.createdAt).toLocaleDateString()}
//                         </p>
//                     </div>

//                     <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">Last Updated</p>
//                         <p className="text-gray-900 dark:text-white font-medium">
//                             {new Date(profile.updatedAt).toLocaleDateString()}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Actions Section */}
//                 {/* <div className="w-full md:w-auto flex justify-center md:justify-start mt-6 md:mt-0">
//         <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300">
//           Edit Profile
//         </button>
//       </div> */}
//             </div>
//         </div>
//     );

// }


"use client";

import React, { useEffect, useState } from "react";
import useProfileStore from "@/store/profileStore";
import { Edit2, Key } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
    const { profile, loading, error, fetchProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [updating, setUpdating] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (!profile) fetchProfile();
    }, []);

    if (loading)
        return <p className="text-center mt-10">Loading profile...</p>;
    if (error)
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!profile)
        return <p className="text-center mt-10">No profile found</p>;

    const avatarLetter = profile.name?.charAt(0).toUpperCase() || "?";

    const openModal = () => {
        setFormData({ name: profile.name, email: profile.email });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            console.log("Sending update request with:", formData);
            const res = await axios.put("/api/my-profile", formData, {
                withCredentials: true,
            });

            console.log("Response received:", res.data);

            if (res.data.success) {
                toast.success("Profile updated successfully!");
                fetchProfile(); // refresh profile data
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Update error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };




    return (
        <div className="flex justify-center items-center dark:bg-gray-900 pt-25">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-2xl flex flex-col md:flex-row gap-6 items-center">
                {/* Avatar */}
                <div className="shrink-0">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 dark:bg-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                        {avatarLetter}
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 text-center mt-0.5 font-semibold">Role : {profile.role}</p>

                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {profile.name}
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            className="text-blue-600"
                            height="18"
                            width="18"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10.007 2.10377C8.60544 1.65006 7.08181 2.28116 6.41156 3.59306L5.60578 5.17023C5.51004 5.35763 5.35763 5.51004 5.17023 5.60578L3.59306 6.41156C2.28116 7.08181 1.65006 8.60544 2.10377 10.007L2.64923 11.692C2.71404 11.8922 2.71404 12.1078 2.64923 12.308L2.10377 13.993C1.65006 15.3946 2.28116 16.9182 3.59306 17.5885L5.17023 18.3942C5.35763 18.49 5.51004 18.6424 5.60578 18.8298L6.41156 20.407C7.08181 21.7189 8.60544 22.35 10.007 21.8963L11.692 21.3508C11.8922 21.286 12.1078 21.286 12.308 21.3508L13.993 21.8963C15.3946 22.35 16.9182 21.7189 17.5885 20.407L18.3942 18.8298C18.49 18.6424 18.6424 18.49 18.8298 18.3942L20.407 17.5885C21.7189 16.9182 22.35 15.3946 21.8963 13.993L21.3508 12.308C21.286 12.1078 21.286 11.8922 21.3508 11.692L21.8963 10.007C22.35 8.60544 21.7189 7.08181 20.407 6.41156L18.8298 5.60578C18.6424 5.51004 18.49 5.35763 18.3942 5.17023L17.5885 3.59306C16.9182 2.28116 15.3946 1.65006 13.993 2.10377L12.308 2.64923C12.1078 2.71403 11.8922 2.71404 11.692 2.64923L10.007 2.10377ZM6.75977 11.7573L8.17399 10.343L11.0024 13.1715L16.6593 7.51465L18.0735 8.92886L11.0024 15.9999L6.75977 11.7573Z"></path>
                        </svg>
                    </h2>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-10">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Email</p>
                            <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Role</p>
                            <p className="text-gray-900 dark:text-white font-medium">{profile.role}</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Account Created</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Last Updated</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {new Date(profile.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-10">
                        <button
                            onClick={openModal}
                            className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            <Edit2 className="w-4 h-4" />
                            Update Profile
                        </button>
                        <button
                            onClick={() => router.push('/admin/forgot-password')}
                            className="flex items-center justify-center gap-2 flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Key className="w-4 h-4" />
                            Reset Password
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Update Profile
                            </h3>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="p-2 border rounded-md w-full dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-2 border rounded-md w-full dark:bg-gray-700 dark:border-gray-600"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {updating ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}
