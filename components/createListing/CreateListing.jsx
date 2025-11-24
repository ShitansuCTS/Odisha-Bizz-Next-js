"use client"; // 👈 Client component for Next.js App Router

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/Loader";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import useAuthStore from "@/store/authStore";



export default function CreateListing() {
    //   const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        const verify = async () => {
            const auth = await checkAuth();  // wait for auth result

            if (!auth) {
                router.push("/admin/login");
            }
        };

        verify();
    }, []); // run once only


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        email: "",
        phone: "",
        address: { district: "", state: "", pincode: "" },
        socialMedia: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            website: "",
        },
    });



    // Fetch all states
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch(
                    "https://www.india-location-hub.in/api/locations/states"
                );
                const data = await res.json();
                if (data.success) setStates(data.data.states);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, []);

    // Fetch districts for selected state
    const fetchDistricts = async (stateName) => {
        setSelectedState(stateName);
        setDistricts([]);
        try {
            const res = await fetch(
                `https://www.india-location-hub.in/api/locations/districts?state=${encodeURIComponent(
                    stateName
                )}`
            );
            const data = await res.json();
            if (data.success) setDistricts(data.data.districts);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("address", JSON.stringify(formData.address));
            data.append("socialMedia", JSON.stringify(formData.socialMedia));
            if (image) data.append("image", image);

            await axios.post("/api/post-listing", data, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Listing created successfully!");
            setFormData({
                title: "",
                description: "",
                category: "",
                email: "",
                phone: "",
                address: { district: "", state: "", pincode: "" },
                socialMedia: { facebook: "", instagram: "", twitter: "", linkedin: "", website: "" },
            });
            setImage(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create listing!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-50 px-6 py-10">
                <div className="hidden md:flex md:w-1/2 justify-center">
                    <img
                        src="https://illustrations.popsy.co/gray/product-launch.svg"
                        alt="Listing Illustration"
                        className="w-4/5 h-auto"
                        loading="lazy"
                    />
                </div>

                <div className="w-full md:w-1/2 shadow-md rounded-lg bg-white p-8">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                        Create Your Listings
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            name="title"
                            placeholder="Enter Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-xl"
                                loading="lazy"
                            />
                        )}
                        <Textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                        {/* Category & Pincode */}
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange({ target: { name: "category", value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "Hotels & Resorts",
                                        "Restaurants & Cafes",
                                        "Travel & Tourism Services",
                                        "Real Estate & Properties",
                                        "Healthcare Services",
                                        "Education & Coaching",
                                        "Salons, Spas & Wellness",
                                        "Grocery & Supermarkets",
                                        "Fashion & Clothing Stores",
                                        "Electronics & Mobile Stores"
                                    ].map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                            <Input
                                type="text"
                                name="address.pincode"
                                placeholder="Pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Email & Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <Input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        {/* State & District */}
                        <div className="grid grid-cols-2 gap-4">
                            <Select value={selectedState} onValueChange={(val) => {
                                fetchDistricts(val);
                                handleChange({ target: { name: "address.state", value: val } });
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>

                                <SelectContent className="max-h-60 overflow-y-auto"> {/* 👈 scrollable */}
                                    {states.map((state) => (
                                        <SelectItem key={state.code} value={state.name}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={formData.address.district}
                                onValueChange={(val) =>
                                    handleChange({ target: { name: "address.district", value: val } })
                                }
                                disabled={!districts.length}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            districts.length === 0 ? "Select State First" : "Select District"
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent className="max-h-60 overflow-y-auto"> {/* scrollable */}
                                    {districts.map((dist) => (
                                        <SelectItem key={dist.name} value={dist.name}>
                                            {dist.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                        {/* Social Media */}
                        <div className="grid grid-cols-2 gap-4">
                            {["facebook", "instagram", "twitter", "linkedin"].map((sm) => (
                                <Input key={sm} type="text" name={`socialMedia.${sm}`} placeholder={sm.charAt(0).toUpperCase() + sm.slice(1)} value={formData.socialMedia[sm]} onChange={handleChange} />
                            ))}
                            <Input type="text" name="socialMedia.website" placeholder="Website" value={formData.socialMedia.website} onChange={handleChange} className="col-span-2" />
                        </div>
                        <button type="submit" className="bg-[#012a7a] text-white px-4 py-2 rounded-full w-full">Create Listing</button>
                    </form>
                </div>
            </div>
        </>
    );
}
