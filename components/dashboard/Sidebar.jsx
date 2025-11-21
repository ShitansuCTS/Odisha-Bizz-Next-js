"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  List,
  BarChart2,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    {
      name: "Apps",
      icon: <List size={18} />,
      subItems: [
        { name: "All Listings" },
        { name: "Leads", badge: 8 },
        { name: "Users", badge: 4 },
      ],
    },
    {
      name: "Reports",
      icon: <BarChart2 size={18} />,
      subItems: [{ name: "Analytics" }],
    },
    {
      name: "Pages",
      icon: <FileText size={18} />,
      subItems: [{ name: "Profile" }, { name: "Settings" }],
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? "80px" : "260px" }}
      className="h-screen bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex flex-col sticky top-0 shadow-sm transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-[50%]"
                loading="lazy"
              />
            </Link>
          </motion.h1>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {links.map((link) => (
            <li key={link.name} className="mb-2">
              {/* Main Menu Item */}
              <button
                onClick={() =>
                  link.subItems
                    ? toggleMenu(link.name)
                    : setActiveTab(link.name)
                }
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === link.name
                    ? "bg-[#001846] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{link.icon}</span>
                  {!collapsed && <span>{link.name}</span>}
                </div>
                {!collapsed && link.subItems && (
                  <span>
                    {openMenus[link.name] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {/* Sub Items */}
              <AnimatePresence>
                {openMenus[link.name] && !collapsed && link.subItems && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-8 mt-1 space-y-1"
                  >
                    {link.subItems.map((sub) => (
                      <li key={sub.name}>
                        <button
                          onClick={() => setActiveTab(sub.name)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition ${
                            activeTab === sub.name
                              ? "bg-[#001846]/10 text-[#001846] font-medium"
                              : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {sub.name}
                          {sub.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                            >
                              {sub.badge}
                            </Badge>
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      {!collapsed && (
        <>
          <Separator />
          <div className="mt-auto px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Safe Way
          </div>
        </>
      )}
    </motion.aside>
  );
};

export default Sidebar;
