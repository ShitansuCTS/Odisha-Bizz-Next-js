'use client'
import React, { useState } from 'react'
import { MdCheckCircle, MdPending, MdSync, MdStorage } from "react-icons/md";
import toast from 'react-hot-toast'

export default function GoogleSync() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const runSync = async () => {
        try {
            setLoading(true)
            setShowModal(false)

            toast.loading("Syncing data...")

            const res = await fetch('/api/sync-google-rating')
            const json = await res.json()

            toast.dismiss()

            if (json.success) {
                setData(json)
                toast.success("Sync completed successfully ✅")
            } else {
                toast.error("Sync failed ❌")
            }

        } catch (err) {
            toast.dismiss()
            toast.error("Something went wrong ❌")
        } finally {
            setLoading(false)
        }
    }

    const progress = data?.total
        ? Math.round((data.updated / data.total) * 100)
        : 0

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    Google Sync Dashboard
                </h2>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#5156be] text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                    <MdSync className={`${loading ? "animate-spin" : ""}`} />
                    Run Sync
                </button>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">

                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-[#5156be] flex items-center gap-2">
                        <MdSync size={18} /> Sync Overview
                    </h3>

                    {data && (
                        <span className="text-xs text-gray-400">
                            Last run: {new Date().toLocaleTimeString()}
                        </span>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-6">

                    {!data ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <img
                                src="/images/data-not-found.png"
                                className="w-36 mb-4 opacity-80"
                            />
                            <p className="text-gray-500">
                                No sync data yet. Click "Run Sync" 🚀
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                {/* Updated */}
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4 hover:scale-[1.02] transition">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <MdCheckCircle size={20} />
                                        <span className="text-sm">Updated</span>
                                    </div>
                                    <p className="text-xl font-bold mt-2">{data.updated}</p>
                                </div>

                                {/* Pending */}
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 hover:scale-[1.02] transition">
                                    <div className="flex items-center gap-2 text-yellow-600">
                                        <MdPending size={20} />
                                        <span className="text-sm">Pending</span>
                                    </div>
                                    <p className="text-xl font-bold mt-2">{data.pending}</p>
                                </div>

                                {/* Total */}
                                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 hover:scale-[1.02] transition">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MdStorage size={20} />
                                        <span className="text-sm">Total</span>
                                    </div>
                                    <p className="text-xl font-bold mt-2">{data.total}</p>
                                </div>

                                {/* This Run */}
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 hover:scale-[1.02] transition">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <MdSync size={20} />
                                        <span className="text-sm">This Run</span>
                                    </div>
                                    <p className="text-xl font-bold mt-2">{data.updatedNow}</p>
                                </div>

                            </div>

                            {/* Progress Section */}
                            <div className="mt-8">

                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Sync Progress</span>
                                    <span className="font-medium text-[#5156be]">
                                        {progress}%
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#5156be] h-3 rounded-full transition-all duration-700"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                {/* Status Message */}
                                <p className="text-xs text-gray-400 mt-2">
                                    {data.message}
                                </p>

                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Confirm Sync
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            This will update Google ratings for listings. Continue?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-1.5 rounded-lg border hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={runSync}
                                className="bg-[#5156be] text-white px-4 py-1.5 rounded-lg hover:bg-[#4044a8]"
                            >
                                Yes, Sync
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}