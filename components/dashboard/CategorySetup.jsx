"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CategorySetup() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ name: "", image: null });

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        name: "",
        image: null,
        imageUrl: "",
        metaTitle: "",
        metaDescription: "",
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/category");
            if (res.data.success) setCategories(res.data.categories);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name) return toast.error("Name required");

        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", form.name);
            if (form.image) data.append("image", form.image);

            await axios.post("/api/category", data);

            toast.success("Category added");
            setForm({ name: "", image: null });
            fetchCategories();
        } catch {
            toast.error("Create failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this category?")) return;
        try {
            await axios.delete(`/api/category/${id}`);
            toast.success("Deleted");
            fetchCategories();
        } catch {
            toast.error("Delete failed");
        }
    };

    const openEdit = (cat) => {
        setEditData({
            id: cat._id,
            name: cat.name,
            image: null,
            imageUrl: cat.imageUrl,
            metaTitle: cat.metaTitle || "",
            metaDescription: cat.metaDescription || "",
        });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append("name", editData.name);
            if (editData.image) data.append("image", editData.image);
            
            // ✅ ADD THESE
            data.append("metaTitle", editData.metaTitle);
            data.append("metaDescription", editData.metaDescription);

            await axios.put(`/api/category/${editData.id}`, data);

            toast.success("Updated");
            setEditOpen(false);
            fetchCategories();
        } catch {
            toast.error("Update failed");
        }
    };

    return (
        <div className="p-6 space-y-10">

            {/* CREATE */}
            <div className="bg-white p-5 rounded-2xl shadow">
                <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Image</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setForm({ ...form, image: e.target.files[0] })
                            }
                        />
                    </div>

                    <Button className="bg-blue-600 text-white mt-6" disabled={loading}>
                        <Plus className="mr-2" /> Add
                    </Button>
                </form>
            </div>



            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-blue-600">Our Categories</h1>
                <p className="text-sm text-gray-500">Manage categories easily</p>
            </div>


            {/* LIST */}
            <div className="grid md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="group p-4 bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center"
                    >
                        {/* LEFT */}
                        <div className="flex items-center gap-4">

                            {/* IMAGE */}
                            <div className="w-12 h-12 rounded-sm overflow-hidden border bg-gray-50 flex items-center justify-center">
                                {cat.imageUrl ? (
                                    <img
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">No Img</span>
                                )}
                            </div>

                            {/* TEXT */}
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                    {cat.name}
                                </p>
                                <p className="text-xs text-gray-400 tracking-wide">
                                    /{cat.slug}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT ACTIONS */}
                        <div className="flex items-center gap-2">

                            {/* EDIT */}
                            <button
                                onClick={() => openEdit(cat)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition"
                            >
                                <Pencil size={16} className="text-blue-600" />
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition"
                            >
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT DRAWER */}
            <AnimatePresence>
                {editOpen && (
                    <>


                        {/* 🔹 DRAWER */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {/* 🔹 HEADER */}
                            <div className="flex items-center justify-between p-5 border-b">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Edit Category
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Update category details
                                    </p>
                                </div>

                                {/* CLOSE BUTTON */}
                                <button
                                    onClick={() => setEditOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-gray-100 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 🔹 CONTENT */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">

                                {/* NAME */}
                                <div className="space-y-1">
                                    <Label >Category Name</Label>
                                    <Input
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData({ ...editData, name: e.target.value })
                                        }
                                        placeholder="Enter category name"
                                    />
                                </div>

                                {/* IMAGE */}
                                <div className="space-y-2">

                                    <div>
                                        <Label>Category Image</Label>

                                        {/* 🔹 Preview Section */}
                                        <div className="mt-2">
                                            {editData.image ? (
                                                // NEW IMAGE PREVIEW
                                                <img
                                                    src={URL.createObjectURL(editData.image)}
                                                    className="w-full h-40 object-cover rounded-xl border"
                                                />
                                            ) : editData.imageUrl ? (
                                                // OLD IMAGE
                                                <img
                                                    src={editData.imageUrl}
                                                    className="w-full h-40 object-cover rounded-xl border"
                                                />
                                            ) : (
                                                <div className="w-full h-40 flex items-center justify-center border rounded-xl text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* 🔹 Upload */}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="mt-3"
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    image: e.target.files[0], // NEW FILE
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                {/* META TITLE */}
                                <div className="space-y-1">
                                    <Label>Meta Title</Label>
                                    <Input
                                        value={editData.metaTitle}
                                        onChange={(e) =>
                                            setEditData({ ...editData, metaTitle: e.target.value })
                                        }
                                        placeholder="Enter SEO title"
                                    />
                                </div>

                                {/* META DESCRIPTION */}
                                <div className="space-y-1">
                                    <Label>Meta Description</Label>
                                    <textarea
                                        value={editData.metaDescription}
                                        onChange={(e) =>
                                            setEditData({ ...editData, metaDescription: e.target.value })
                                        }
                                        placeholder="Enter SEO description"
                                        className="w-full border rounded-lg p-2 text-sm"
                                        rows={4}
                                    />
                                </div>

                            </div>

                            {/* 🔹 FOOTER */}
                            <div className="p-5 border-t flex gap-3">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleUpdate}
                                >
                                    Update Category
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setEditOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
