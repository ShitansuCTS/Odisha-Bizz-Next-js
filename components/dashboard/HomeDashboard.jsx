"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  List,
  BarChart3,
  Building2,
} from "lucide-react";
import Leads from "./Leads";
import AllListingWithFilter from "@/components/admin/AllListingWithFilter";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";

const stats = [
  {
    title: "Total Listings",
    value: "1,245",
    change: "+120",
    positive: true,
    icon: <List size={18} className="text-[#5156be]" />,
  },
  {
    title: "Total Users",
    value: "432",
    change: "-12",
    positive: false,
    icon: <Users size={18} className="text-[#5156be]" />,
  },
  {
    title: "Leads Generated",
    value: "980",
    change: "+45",
    positive: true,
    icon: <BarChart3 size={18} className="text-[#5156be]" />,
  },
  {
    title: "Total Comments",
    value: "150",
    change: "+2",
    positive: true,
    icon: <Building2 size={18} className="text-[#5156be]" />,
  },
];

const HomeDashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((item, index) => (
          <Card
            key={index}
            className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#5156be]/10 rounded-md">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {item.title}
                  </span>
                </div>
                <Badge
                  className={`${item.positive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    } px-1.5 py-0.5 text-[10px] font-semibold rounded-full`}
                >
                  {item.positive ? (
                    <TrendingUp size={10} className="inline mr-1" />
                  ) : (
                    <TrendingDown size={10} className="inline mr-1" />
                  )}
                  {item.change}
                </Badge>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <h3 className="text-xl font-semibold text-gray-900 leading-none">
                  {item.value}
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                  {item.positive ? "Up from last week" : "Down from last week"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Sections */}
      <AnalyticsDashboard />
      <AllListingWithFilter />
      {/* <Leads /> */}
    </>
  );
};

export default HomeDashboard;
