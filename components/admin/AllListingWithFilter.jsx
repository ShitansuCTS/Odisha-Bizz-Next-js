"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Filter, Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/loader/Loader";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";



const AllListingWithFilter = () => {
    const API = "/api/all-products-dashboard";

    const [listings, setListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [status, setStatus] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchData = async (cat = "", statusVal = "", stateVal = "", pageNum = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(API, {
                params: { category: cat, status: statusVal, state: stateVal, page: pageNum, limit: 10 },
            });
            setListings(res.data.listings || []);
            setTotalPages(res.data.totalPages || 1);
            setTotal(res.data.total || 0);
        } catch (error) {
            toast.error("Failed to fetch listings");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchData(selectedCategory, status, stateFilter, 1);
    };

    const handleEditClick = (listing) => {
        setSelectedListing(listing);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/delete-listing/${id}`, {
                withCredentials: true, // if using cookies/session
            });

            if (res.status === 200) {
                toast.success(res.data.message || "Listing deleted successfully!");
                fetchData(); // refresh your listings
            } else {
                toast.error(res.data.message || "Failed to delete listing.");
            }
        } catch (err) {
            console.error("Error deleting listing:", err);
            // Axios error handling: err.response?.data?.message
            toast.error(err.response?.data?.message || "Failed to delete listing.");
        }
    };


    const handleChange = (e) => {
        setSelectedListing({ ...selectedListing, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            // Basic fields
            formData.append("title", selectedListing.title);
            formData.append("description", selectedListing.description);
            formData.append("category", selectedListing.category);
            formData.append("status", selectedListing.status);
            formData.append("email", selectedListing.email);
            formData.append("phone", selectedListing.phone);

            // Address (nested)
            formData.append("address[district]", selectedListing.address?.district || "");
            formData.append("address[state]", selectedListing.address?.state || "");
            formData.append("address[pincode]", selectedListing.address?.pincode || "");

            // Social media (nested)
            formData.append("socialMedia[facebook]", selectedListing.socialMedia?.facebook || "");
            formData.append("socialMedia[instagram]", selectedListing.socialMedia?.instagram || "");
            formData.append("socialMedia[twitter]", selectedListing.socialMedia?.twitter || "");
            formData.append("socialMedia[linkedin]", selectedListing.socialMedia?.linkedin || "");
            formData.append("socialMedia[website]", selectedListing.socialMedia?.website || "");

            // Image (only if user selected new)
            if (selectedListing.image instanceof File) {
                formData.append("image", selectedListing.image);
            }

            const res = await axios.put(
                `/api/update-listing/${selectedListing._id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success("Listing updated successfully!");
            setOpen(false);
            fetchData(selectedCategory, status, stateFilter, page);

        } catch (error) {
            console.error(error);
            toast.error("Failed to update listing.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData(selectedCategory, status, stateFilter, page);
    }, [page]);



    return (
        <div className="lg:mt-14">
            {/* Header */}
            <div className="flex items-center gap-3 lg:mb-6">
                <span className="text-2xl font-bold text-slate-800">Listings Details</span>
            </div>

            <Card className="bg-white border-none shadow-none">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-around mb-0 gap-4">
                    <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-2 lg:mb-7">
                        <div className="flex items-center gap-3">
                            <Filter size={24} className="text-blue-500" />
                            <span className="text-lg font-semibold text-[#5156be]">Total Listings</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-sm shadow-md">
                            {total}
                        </span>
                    </CardTitle>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Category */}
                        <Select
                            value={selectedCategory || "all"}
                            onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="w-40 border-slate-300 focus:ring-2 focus:ring-blue-400">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Hotels & Resorts">Hotels & Resorts</SelectItem>
                                <SelectItem value="Jewellery">Jewellery</SelectItem>
                                <SelectItem value="Hotel">Hotel</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status */}
                        <Select
                            value={status || "all"}
                            onValueChange={(val) => setStatus(val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="w-[140px] border-slate-300 focus:ring-2 focus:ring-blue-400">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* State */}
                        <Select
                            value={stateFilter || "all"}
                            onValueChange={(val) => setStateFilter(val === "all" ? "" : val)}
                        >
                            <SelectTrigger className="w-[140px] border-slate-300 focus:ring-2 focus:ring-blue-400">
                                <SelectValue placeholder="All States" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="Odisha">Odisha</SelectItem>
                                {/* <SelectItem value="Delhi">Delhi</SelectItem>
                                <SelectItem value="Pune">Pune</SelectItem> */}
                            </SelectContent>
                        </Select>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            className="bg-[#5156be] hover:bg-[#5156be] text-white flex items-center gap-2 shadow-sm rounded-md"
                        >
                            <Search size={16} /> Filter Listings
                        </Button>
                    </div>
                </div>

                {/* Table Content */}
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : listings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
                            <img
                                src="/images/data-not-found.png"
                                alt="No products"
                                loading="lazy"
                                className="w-40 h-40 mb-4 opacity-80"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">Opps! No Listing Found</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Try checking another category with another state or come back later.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-sm border border-slate-200 lg:pb-5">
                            <Table>
                                <TableHeader className="bg-[#5156be] text-white">
                                    <TableRow className="hover:bg-[#5156be]/80">
                                        <TableHead className="py-3 text-white">No</TableHead>
                                        <TableHead className="text-white">Image</TableHead>
                                        <TableHead className="text-white">Title</TableHead>
                                        <TableHead className="text-white">Category</TableHead>
                                        <TableHead className="text-white">State</TableHead>
                                        <TableHead className="text-white">Status</TableHead>
                                        <TableHead className="text-white">Created At</TableHead>
                                        <TableHead className="text-white text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {listings.map((listing, index) => (
                                        <TableRow
                                            key={listing._id || index}
                                            className="hover:bg-slate-50 transition-colors text-slate-700"
                                        >
                                            <TableCell className="py-2">{index + 1}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={listing.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60"}
                                                    alt={listing.title}
                                                    className="w-10 h-10 rounded-md object-cover border border-slate-200"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-800">{listing.title}</TableCell>
                                            <TableCell>
                                                <span className="text-xs capitalize px-3 py-1 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-medium">
                                                    {listing.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="capitalize text-slate-600 flex items-center gap-1.5 pt-4">
                                                <MapPin className="w-4 h-4 text-[#5156be]" />
                                                {listing.address?.state || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${listing.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : listing.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {listing.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                                                    {new Date(listing.createdAt).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                                    onClick={() => handleEditClick(listing)}
                                                >
                                                    <Pencil size={14} /> Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-[#5156be]">
                                                                Are you sure to delete?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-black">
                                                                Are you sure you want to delete this listing? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-[#5156be] text-white hover:bg-[#5156be]/90 cursor-pointer hover:text-white">
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(listing._id)}
                                                                className="bg-[#5156be] text-white hover:bg-[#5156be]/90 cursor-pointer"
                                                            >
                                                                Yes, Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 rounded-full px-3"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>
                                <span className="text-sm text-slate-700">
                                    Page <span className="font-semibold text-[#5156be]">{page}</span> of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 rounded-full px-3"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-full max-w-lg bg-white shadow-xl rounded-xs overflow-hidden">
                    <SheetHeader className="px-6 py-4 border-b">
                        <SheetTitle className="text-[#5156be] text-2xl font-semibold">Edit Listing</SheetTitle>
                        <SheetDescription className="text-gray-500 mt-1 text-sm">
                            Update the listing details below and click save when finished.
                        </SheetDescription>
                    </SheetHeader>

                    {selectedListing && (
                        <motion.form
                            onSubmit={handleUpdate}
                            className="space-y-5 px-6 py-4 overflow-y-auto max-h-[75vh]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Title */}
                            <div className="flex flex-col">
                                <Label htmlFor="title" className="mb-2 font-medium text-gray-700">Buisness Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={selectedListing.title}
                                    onChange={handleChange}
                                    placeholder="Enter title"
                                    className="shadow-sm focus:ring-[#b6985a] focus:border-[#b6985a]"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col">
                                <Label htmlFor="description" className="mb-2 font-medium text-gray-700">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={selectedListing.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter description"
                                    className="shadow-sm focus:ring-[#b6985a] focus:border-[#b6985a]"
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col">
                                <Label htmlFor="category" className="mb-1 font-medium text-gray-700">Category</Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={selectedListing.category || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-[#b6985a] focus:border-[#b6985a]"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Hotels & Resorts">Hotels & Resorts</option>
                                    <option value="Restaurants & Cafes">Restaurants & Cafes</option>
                                    <option value="Travel & Tourism Services">Travel & Tourism Services</option>
                                    <option value="Real Estate & Properties">Real Estate & Properties</option>
                                    <option value="Healthcare Services">Healthcare Services</option>
                                    <option value="Education & Coaching">Education & Coaching</option>
                                    <option value="Salons, Spas & Wellness">Salons, Spas & Wellness</option>
                                    <option value="Grocery & Supermarkets">Grocery & Supermarkets</option>
                                    <option value="Fashion & Clothing Stores">Fashion & Clothing Stores</option>
                                    <option value="Electronics & Mobile Stores">Electronics & Mobile Stores</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col">
                                <Label htmlFor="status" className="mb-2 font-medium text-gray-700">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={selectedListing.status}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-[#b6985a] focus:border-[#b6985a]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Contact */}
                            <Input label="Phone" name="phone" value={selectedListing.phone} onChange={handleChange} />
                            <Input label="Email" name="email" value={selectedListing.email} onChange={handleChange} />

                            {/* Address */}
                            {["district", "state", "pincode"].map((field) => (
                                <Input
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    name={field}
                                    value={selectedListing.address?.[field] || ""}
                                    onChange={(e) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            address: { ...selectedListing.address, [field]: e.target.value },
                                        })
                                    }
                                />
                            ))}

                            {/* Social Media */}
                            {["facebook", "instagram", "twitter", "linkedin", "website"].map((sm) => (
                                <Input
                                    key={sm}
                                    label={sm.charAt(0).toUpperCase() + sm.slice(1)}
                                    name={sm}
                                    value={selectedListing.socialMedia?.[sm] || ""}
                                    onChange={(e) =>
                                        setSelectedListing({
                                            ...selectedListing,
                                            socialMedia: { ...selectedListing.socialMedia, [sm]: e.target.value },
                                        })
                                    }
                                />
                            ))}

                            {/* Image */}
                            <div className="flex flex-col">
                                <Label htmlFor="image" className="mb-2 font-medium text-gray-700">Upload Image</Label>
                                {selectedListing.imageUrl && (
                                    <img
                                        src={selectedListing.imageUrl}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-md object-cover mb-2 border shadow-sm"
                                        loading="lazy"
                                    />
                                )}
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setSelectedListing({ ...selectedListing, image: file, imageUrl: URL.createObjectURL(file) });
                                    }}
                                    className="shadow-sm focus:ring-[#5156be] focus:border-[#b6985a]"
                                />
                            </div>

                            {/* Footer */}
                            <SheetFooter className="flex justify-end gap-3 mt-4">
                                <SheetClose asChild>
                                    <Button variant="outline" className="hover:bg-gray-100 transition">Cancel</Button>
                                </SheetClose>
                                <Button type="submit" className="bg-[#5156be] hover:bg-[#5156be] text-white transition-all shadow-md">
                                    Save Changes
                                </Button>
                            </SheetFooter>
                        </motion.form>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );

};

export default AllListingWithFilter;
