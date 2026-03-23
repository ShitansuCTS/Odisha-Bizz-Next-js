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
    const [categories, setCategories] = useState([]);

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
            formData.append(
                "category",
                selectedListing.category?._id || selectedListing.category
            );
            formData.append("status", selectedListing.status);
            formData.append("email", selectedListing.email);
            formData.append("phone", selectedListing.phone);

            // Address (nested)
            formData.append("address", JSON.stringify(selectedListing.address));

            // Social media (nested)
            formData.append("socialMedia", JSON.stringify(selectedListing.socialMedia));

            //google review information
            formData.append("googlePlaceId", selectedListing.googlePlaceId || "");
            formData.append("googleLastUpdated", selectedListing.googleLastUpdated || "");
            formData.append("googleRating", selectedListing.googleRating || "");
            formData.append("googleReviewsCount", selectedListing.googleReviewsCount || "");

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

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/category");
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


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
                                                    {listing.category?.name || "-"}
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



            {/* Sidebar sheet is opening  */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent
                    side="right"
                    className="w-[40vw]! max-w-none! bg-white shadow-2xl overflow-y-auto"
                >
                    <SheetHeader className="px-6 py-5 border-b bg-gray-50">
                        <SheetTitle className="text-2xl font-semibold text-[#5156be]">
                            Edit Listing
                        </SheetTitle>
                        <SheetDescription className="text-gray-500 text-sm">
                            Update listing details and save changes.
                        </SheetDescription>
                    </SheetHeader>

                    {selectedListing && (
                        <motion.form
                            onSubmit={handleUpdate}
                            className="px-6 py-6 space-y-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >

                            {/* 🔹 BASIC INFO */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Basic Information
                                </h3>

                                <div className="space-y-4">
                                    <Input
                                        label="Business Title"
                                        name="title"
                                        value={selectedListing.title}
                                        onChange={handleChange}
                                    />

                                    <Textarea
                                        label="Description"
                                        name="description"
                                        value={selectedListing.description}
                                        onChange={handleChange}
                                        rows={4}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-1">Category</Label>
                                            <select
                                                name="category"
                                                value={selectedListing.category?._id || selectedListing.category || ""}
                                                onChange={(e) =>
                                                    setSelectedListing({
                                                        ...selectedListing,
                                                        category: e.target.value, // ✅ ONLY ID
                                                    })
                                                }
                                                className="w-full border rounded-md p-2 text-sm"
                                            >
                                                <option value="">Select Category</option>

                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <Label className="mb-1">Status</Label>
                                            <select
                                                name="status"
                                                value={selectedListing.status}
                                                onChange={handleChange}
                                                className="w-full border rounded-md p-2 text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 CONTACT */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Contact Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Phone" name="phone" value={selectedListing.phone} onChange={handleChange} />
                                    <Input label="Email" name="email" value={selectedListing.email} onChange={handleChange} />
                                </div>
                            </div>

                            {/* 🔹 ADDRESS */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Address
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    {["district", "state", "pincode"].map((field) => (
                                        <Input
                                            key={field}
                                            label={field}
                                            value={selectedListing.address?.[field] || ""}
                                            onChange={(e) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    address: {
                                                        ...selectedListing.address,
                                                        [field]: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 🔹 SOCIAL MEDIA */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Social Media
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {["facebook", "instagram", "twitter", "linkedin", "website"].map((sm) => (
                                        <Input
                                            key={sm}
                                            label={sm}
                                            value={selectedListing.socialMedia?.[sm] || ""}
                                            onChange={(e) =>
                                                setSelectedListing({
                                                    ...selectedListing,
                                                    socialMedia: {
                                                        ...selectedListing.socialMedia,
                                                        [sm]: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 🔹 GOOGLE DATA */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Google Data
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Place ID"
                                        name="googlePlaceId"
                                        value={selectedListing.googlePlaceId}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Last Updated"
                                        name="googleLastUpdated"
                                        value={selectedListing.googleLastUpdated}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Rating"
                                        name="googleRating"
                                        value={selectedListing.googleRating}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Total Reviews"
                                        name="googleReviewsCount"
                                        value={selectedListing.googleReviewsCount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* 🔹 IMAGE */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Image
                                </h3>

                                {selectedListing.imageUrl && (
                                    <img
                                        src={selectedListing.imageUrl}
                                        className="w-32 h-32 object-cover rounded-lg border mb-3"
                                    />
                                )}

                                <Input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSelectedListing({
                                                ...selectedListing,
                                                image: file,
                                                imageUrl: URL.createObjectURL(file),
                                            });
                                        }
                                    }}
                                />
                            </div>

                            {/* 🔹 FOOTER */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline">Cancel</Button>
                                <Button type="submit" className="bg-[#5156be] text-white">
                                    Save Changes
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </SheetContent>
            </Sheet>
        </div >
    );

};

export default AllListingWithFilter;
