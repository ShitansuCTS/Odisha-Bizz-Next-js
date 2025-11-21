"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("/api/contact", { withCredentials: true });
        const sortedLeads = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLeads(sortedLeads);
      } catch (error) {
        console.error("❌ Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [0]);

  const filteredLeads = leads.filter((lead) =>
    `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const purposeColors = {
    project: "bg-indigo-100 text-indigo-700 border-indigo-200",
    support: "bg-green-100 text-green-700 border-green-200",
    partnership: "bg-purple-100 text-purple-700 border-purple-200",
    career: "bg-yellow-100 text-yellow-800 border-yellow-300",
    other: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 lg:mb-3.5">
        <span className="text-2xl font-bold text-slate-800">Leads from our website</span>
      </div>
      <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 lg:mt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-[#5156be] flex items-center gap-2">
            <Clock size={20} /> Leads Overview
          </CardTitle>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="text-gray-400" size={18} />
            <Input
              placeholder="Search name.."
              className="w-full sm:w-64 border-gray-300 focus:border-[#5156be] focus:ring-[#5156be]/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-[#5156be] text-white">
                <tr>
                  {["Name", "Email", "Phone", "Purpose", "Message", "Date"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left font-medium uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, i) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={`border-b last:border-0 transition-colors cursor-pointer 
                  ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} 
                  `}
                    >
                      <td className="px-4 py-3 font-medium">
                        {lead.firstName} {lead.lastName}
                      </td>

                      <td className="px-4 py-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <Mail
                                  size={14}
                                  className="text-[#5156be] group-hover:text-white"
                                />
                                <span>{lead.email}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{lead.email}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      <td className="px-4 py-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <Phone
                                  size={14}
                                  className="text-green-600 group-hover:text-white"
                                />
                                <span>{lead.phone || "-"}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{lead.phone}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`capitalize border font-medium px-2.5 py-1 text-xs rounded-full ${purposeColors[lead.purpose] || purposeColors.other
                            }`}
                        >
                          {lead.purpose}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 max-w-xs truncate">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <MessageSquare
                                  size={14}
                                  className="text-gray-500"
                                />
                                <span>{lead.message}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{lead.message}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>

                      <td className="px-2 py-1">
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                          {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
                        <img
                          src="/images/data-not-found.png"
                          alt="No leads"
                          loading="lazy"
                          className="w-40 h-40 mb-4 opacity-80"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          No Leads Found
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Try checking another filter or come back later.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
