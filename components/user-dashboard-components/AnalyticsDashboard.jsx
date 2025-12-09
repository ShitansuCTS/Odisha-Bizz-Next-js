"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const COLORS = ["#5156be", "#34d399", "#facc15", "#f87171", "#a855f7"];

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get("/api/analytics-dashboard", {
                    withCredentials: true,
                });
                if (res.data.success) setAnalytics(res.data.data);
            } catch (err) {
                if (err.response?.status === 401) setError("unauthorized");
                else setError("fetch_error");
            }
        };

        fetchAnalytics();
    }, []);

    if (error === "unauthorized")
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-[#5156be]" />
                <h2 className="text-2xl font-semibold text-slate-800">Unauthorized Access</h2>
                <p className="text-gray-500 max-w-sm">
                    You’re not authorized to view analytics. Please log in or contact the administrator.
                </p>
            </div>
        );

    if (error === "fetch_error")
        return (
            <p className="text-center py-10 text-red-500">
                Failed to load analytics. Please try again later.
            </p>
        );

    if (!analytics)
        return (
            <p className="text-center py-10 text-gray-500">Loading analytics...</p>
        );





    return (
        <div className="space-y-6 lg:mt-14">
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-800">Analytics Dashboard</span>
            </div>
            {
                analytics.byCategory.length === 0 &&
                    analytics.byStatus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[30vh] space-y-3">
                        <AlertTriangle className="h-12 w-12 text-yellow-500" />
                        <p className="text-gray-500 text-lg font-semibold">
                            No analytics found
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Listings by Category */}
                        <Card className="shadow-lg border border-gray-100 rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-[#5156be]">
                                    Listings by Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.byCategory}>
                                        <XAxis
                                            dataKey="_id"
                                            tick={{ fontSize: 12, fill: "#4b5563" }}
                                            interval={0}
                                            angle={-15}
                                            textAnchor="end"
                                            tickFormatter={(value) => value?.split(" ")[0]}
                                        />
                                        <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
                                        <Tooltip />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {analytics.byCategory.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="#fff"
                                                    strokeWidth={1}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Listings by Status */}
                        <Card className="shadow-lg border border-gray-100 rounded-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-[#5156be]">
                                    Listings by Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.byStatus}
                                            dataKey="count"
                                            nameKey="_id"
                                            outerRadius={80}
                                            label={({ name, percent }) =>
                                                `${name} (${(percent * 100).toFixed(0)}%)`
                                            }
                                        >
                                            {analytics.byStatus.map((entry) => {
                                                let color = "#34d399";
                                                if (entry._id === "pending") color = "#facc15";
                                                else if (entry._id === "inactive") color = "#f87171";
                                                return <Cell key={entry._id} fill={color} />;
                                            })}
                                        </Pie>
                                        <Legend verticalAlign="bottom" />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )
            }




        </div>
    );
}
