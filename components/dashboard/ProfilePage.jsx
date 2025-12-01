"use client";

import React, { useEffect } from "react";
import useProfileStore from "@/store/profileStore";

export default function ProfilePage() {
  const { profile, loading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!profile) return <p className="text-center mt-10">No profile found</p>;

  const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center items-start">
      <div className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-2xl p-8 w-full max-w-5xl flex flex-wrap md:flex-nowrap gap-8 transition-all">

        {/* Avatar Section */}
        <div className="flex flex-col items-center md:items-start md:w-1/4 flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-indigo-600 dark:bg-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
            {avatarLetter}
          </div>
          <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 text-center md:text-left">{profile.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
        </div>

        {/* Details Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
            <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Role</p>
            <p className="text-gray-900 dark:text-white font-medium">{profile.role}</p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Account Created</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Last Updated</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions Section */}
        {/* <div className="w-full md:w-auto flex justify-center md:justify-start mt-6 md:mt-0">
        <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300">
          Edit Profile
        </button>
      </div> */}
      </div>
    </div>
  );

}
