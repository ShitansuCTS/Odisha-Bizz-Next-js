"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, ImageIcon, UploadCloud } from "lucide-react";
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
import { Button } from "@/components/ui/button";

import useAuthStore from "@/store/authStore";
import { Label } from "@/components/ui/label";

/**
 * CreateListing - Multi-step wizard
 * - Tailwind + ShadCN components
 * - Lucide icons
 * - No page refreshes
 * - step lock/unlock + validation
 *
 * Drop into your pages or components folder as a client component.
 */

export default function CreateListing() {
    const router = useRouter();
    const { checkAuth } = useAuthStore();

    // loading for submit
    const [loading, setLoading] = useState(false);

    // image preview
    const [image, setImage] = useState(null);

    // location data
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedState, setSelectedState] = useState("");

    // steps: 1..5 (1 default open)
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    // completed map for showing checkmarks
    const [completed, setCompleted] = useState({});

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

    // ================= AUTH CHECK =================
    useEffect(() => {
        (async () => {
            const ok = await checkAuth();
            if (!ok) router.push("/admin/login");
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ================ FETCH STATES ================
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch(
                    "https://www.india-location-hub.in/api/locations/states"
                );
                const data = await res.json();
                if (data?.success && data.data?.states) setStates(data.data.states);
            } catch (err) {
                console.error("states fetch error", err);
            }
        };
        fetchStates();
    }, []);

    // fetch districts for a state
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
            if (data?.success && data.data?.districts) setDistricts(data.data.districts);
        } catch (err) {
            console.error("districts fetch error", err);
        }
    };

    // ================ helpers =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((p) => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
        } else {
            setFormData((p) => ({ ...p, [name]: value }));
        }
    };

    // step validators - only allow moving forward if validations pass
    const validateStep = (s) => {
        switch (s) {
            case 1:
                return formData.title.trim().length > 0 && formData.description.trim().length > 0;
            case 2:
                return (
                    formData.category.trim().length > 0 &&
                    /\S+@\S+\.\S+/.test(formData.email) &&
                    formData.phone.trim().length >= 6
                );
            case 3:
                return (
                    formData.address.state.trim().length > 0 &&
                    formData.address.district.trim().length > 0 &&
                    formData.address.pincode.trim().length >= 3
                );
            case 4:
                // social optional — just allow
                return true;
            default:
                return false;
        }
    };

    const goNext = () => {
        if (step < totalSteps) {
            if (!validateStep(step)) {
                toast.error("Please fill required fields in this step.");
                return;
            }
            setCompleted((c) => ({ ...c, [step]: true }));
            setStep((s) => s + 1);
        }
    };

    const goBack = () => {
        if (step > 1) setStep((s) => s - 1);
    };

    // submit final
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        // final validation: ensure steps 1..3 valid at least
        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            toast.error("Please complete all required steps before submit.");
            return;
        }
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
            router.push('/thanks')
            // reset and show success step
            setCompleted({ 1: true, 2: true, 3: true, 4: true });
            setStep(5);
            setImage(null);
            setFormData({
                title: "",
                description: "",
                category: "",
                email: "",
                phone: "",
                address: { district: "", state: "", pincode: "" },
                socialMedia: { facebook: "", instagram: "", twitter: "", linkedin: "", website: "" },
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to create listing!");
        } finally {
            setLoading(false);

        }
    };

    // computed progress percentage
    const progressPercent = useMemo(() => {
        const done = Object.keys(completed).filter(Boolean).length + (step > Object.keys(completed).length ? 1 : 0);
        return Math.round((Math.min(step, totalSteps) / totalSteps) * 100);
    }, [completed, step]);

    // ================== RENDER ====================
    return (
        <>
            {/* set the blue var for consistent color usage */}
            <style jsx global>{`
        :root { --color-blue-600: #0b5fff; }
        /* small utility for floating label in pure inputs */
      `}</style>

            {loading && <Loader />}

            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 md:py-0  px-1.5 md:px-4 ">
                <div className="w-full max-w-5xl  rounded-sm md:rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* LEFT: info / progress (hidden on small screens) */}
                        <aside className="hidden md:block md:w-1/3 bg-blue-600 p-6 text-white">
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold tracking-tight">Create Listing</h3>
                                    <p className="text-sm opacity-90 mt-1">Follow steps to publish your business</p>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-full bg-blue-600 rounded-full h-2 overflow-hidden">
                                        <div
                                            aria-hidden
                                            className="h-2 bg-white"
                                            style={{ width: `${progressPercent}%`, transition: "width 400ms ease" }}
                                        />
                                    </div>
                                    <div className="text-sm font-medium">{progressPercent}%</div>
                                </div>

                                <ol className="flex-1 space-y-6">
                                    {[
                                        "Basic Info",
                                        "Category & Contact",
                                        "Address",
                                        "Social",
                                        "Review",
                                    ].map((label, i) => {
                                        const idx = i + 1;
                                        const isActive = step === idx;
                                        const done = completed[idx];
                                        return (
                                            <li
                                                key={label}
                                                className={`flex items-start gap-3 ${isActive ? "opacity-100" : "opacity-80"}`}
                                                aria-current={isActive ? "step" : undefined}
                                            >
                                                <div
                                                    className={`flex-shrink-0 w-9 h-9 rounded-full grid place-items-center text-white ${done ? "bg-green-500" : isActive ? "bg-[var(--color-blue-600)]" : "bg-white/10"
                                                        }`}
                                                >
                                                    {done ? <CheckCircle size={18} /> : <span className="font-medium">{idx}</span>}
                                                </div>

                                                <div>
                                                    <div className="text-sm font-semibold">{label}</div>
                                                    <div className="text-xs opacity-90 mt-1">
                                                        {idx === 1 && "Title & description"}
                                                        {idx === 2 && "Category, email & phone"}
                                                        {idx === 3 && "State / district / pincode"}
                                                        {idx === 4 && "Social links (optional)"}
                                                        {idx === 5 && "Confirm & submit"}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>

                                <div className="mt-6">
                                    <div className="text-xs opacity-90">Tip</div>
                                    <div className="text-sm mt-2">Complete earlier steps to unlock next ones. Reviews help conversions.</div>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT: form content */}
                        <main className="w-full md:w-2/3  md:p-6 shadow-none md:shadow-2xl">
                            <div className="max-w-2xl mx-auto">
                                {/* Header */}
                                <div className="mb-6">

                                    {/* Top: Title + Step info */}
                                    <div className="flex items-start justify-between sm:items-center sm:flex-row flex-col gap-2">
                                        <div>
                                            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                                Add a new listing
                                            </h1>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Step {step} of {totalSteps}
                                            </p>
                                        </div>


                                    </div>

                                    {/* Mobile: large progress bar below header */}
                                    <div className="mt-4 md:hidden lg:hidden">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                                            <div
                                                style={{ width: `${progressPercent}%` }}
                                                className="h-2.5 bg-blue-600 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                </div>


                                {/* -------- STEP CONTENT (animated) -------- */}
                                <AnimatePresence mode="wait" initial={false}>
                                    {/* STEP 1 - Basic Info */}
                                    {step === 1 && (
                                        <motion.section
                                            key="s1"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className="rounded-xl border border-slate-100 p-4">
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-semibold text-slate-900">
                                                        Basic Details
                                                        <span className="text-sm font-normal text-gray-500"> (required)</span>
                                                    </h2>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Enter the title, short description, and upload an image for your business listing.
                                                    </p>
                                                    <hr className="border-t border-gray-300 my-2 " />
                                                </div>


                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-medium text-slate-700">Your Title <span className="text-red-500 ml-0.5">*</span></Label>
                                                    <Input
                                                        name="title"
                                                        placeholder="Hotel Kalinga Ashok"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <Label className="font-medium text-slate-700 mt-1">Your Description <span className="text-red-500 ml-0.5">*</span> </Label>
                                                    <Textarea
                                                        name="description"
                                                        placeholder="A well-established hotel offering .."
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows={2}
                                                    />

                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-medium text-slate-700">Upload Logo / Image <span className="text-red-500 ml-0.5">*</span> </Label>

                                                        <div className="relative w-full h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors">
                                                            {image ? (

                                                                <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt="preview"
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                                    <UploadCloud className="h-10 w-10 mb-2 text-blue-600" />
                                                                    <span className="text-sm">Click or drag to upload</span>
                                                                </div>
                                                            )}

                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                                                            />
                                                        </div>

                                                        <div className="text-xs text-slate-500">Recommended: 800×600</div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                {/* Cancel Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => router.back()}
                                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                                    >
                                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                                        Cancel
                                                    </Button>
                                                </div>

                                                {/* Next / Continue Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        onClick={goNext}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
                                                    >
                                                        Next
                                                        <ArrowRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>

                                        </motion.section>
                                    )}

                                    {/* STEP 2 - Category & Contact */}
                                    {step === 2 && (
                                        <motion.section
                                            key="s2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className="rounded-xl border border-slate-100 p-4">
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-semibold text-slate-900">
                                                        Category & Contact
                                                        <span className="text-sm font-normal text-gray-500"> (required)</span>
                                                    </h2>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Select your business category and provide contact details for customers to reach you.
                                                    </p>
                                                    <hr className="border-t border-gray-300 my-3" />
                                                </div>


                                                <div className="mt-4 grid grid-cols-1 gap-4">
                                                    <Label className="font-medium text-slate-700 ">Choose your Category </Label>
                                                    <Select
                                                        value={formData.category}
                                                        onValueChange={(val) => handleChange({ target: { name: "category", value: val } })}
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
                                                                "Electronics & Mobile Stores",
                                                            ].map((c) => (
                                                                <SelectItem key={c} value={c}>
                                                                    {c}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>


                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <Label className="font-medium text-slate-700">Business email <span className="text-red-500 ml-0.5">*</span></Label>
                                                            <Input
                                                                name="email"
                                                                placeholder="info@odishabizz.com"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                            />
                                                        </div>

                                                        <div className="flex-1">
                                                            <Label className="font-medium text-slate-700">Phone <span className="text-red-500 ml-0.5">*</span></Label>
                                                            <Input
                                                                name="phone"
                                                                placeholder="+91 1234567890"
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                {/* Cancel Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        onClick={goBack}
                                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                                    >
                                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                                        Cancel
                                                    </Button>
                                                </div>

                                                {/* Next / Continue Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        onClick={goNext}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
                                                    >
                                                        Next
                                                        <ArrowRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.section>
                                    )}

                                    {/* STEP 3 - Address */}
                                    {step === 3 && (
                                        <motion.section
                                            key="s3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className="rounded-xl border border-slate-100 p-4">
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-semibold text-slate-900">
                                                        Address & Details
                                                        <span className="text-sm font-normal text-gray-500"> (required)</span>
                                                    </h2>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Enter the full address, including state, district, and pincode, to help customers locate your business.
                                                    </p>
                                                    <hr className="border-t border-gray-300 my-3" />
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    {/* State */}
                                                    <div className="flex flex-col">
                                                        <label className="text-sm font-medium text-slate-700 mb-1">State <span className="text-red-500 ml-0.5">*</span></label>
                                                        <Select
                                                            value={selectedState}
                                                            onValueChange={(val) => {
                                                                fetchDistricts(val);
                                                                handleChange({ target: { name: "address.state", value: val } });
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select State" />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                                {states.map((st) => (
                                                                    <SelectItem key={st.code} value={st.name}>
                                                                        {st.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* District */}
                                                    <div className="flex flex-col">
                                                        <label className="text-sm font-medium text-slate-700 mb-1">District <span className="text-red-500 ml-0.5">*</span></label>
                                                        <Select
                                                            value={formData.address.district}
                                                            onValueChange={(val) => handleChange({ target: { name: "address.district", value: val } })}
                                                            disabled={!districts.length}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={districts.length ? "Select District" : "Choose state first"} />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                                {districts.map((d) => (
                                                                    <SelectItem key={d.name} value={d.name}>
                                                                        {d.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Pincode */}
                                                    <div className="flex flex-col">
                                                        <label className="text-sm font-medium text-slate-700 mb-1">Pincode <span className="text-red-500 ml-0.5">*</span></label>
                                                        <Input
                                                            name="address.pincode"
                                                            placeholder="Enter Pincode"
                                                            value={formData.address.pincode}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                {/* Cancel Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        onClick={goBack}
                                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                                    >
                                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                                        Cancel
                                                    </Button>
                                                </div>

                                                {/* Next / Continue Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        onClick={goNext}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
                                                    >
                                                        Next
                                                        <ArrowRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.section>
                                    )}

                                    {/* STEP 4 - Social Media */}
                                    {step === 4 && (
                                        <motion.section
                                            key="s4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className="rounded-xl border border-slate-100 p-4">
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-semibold text-slate-900">Social Links <span className="text-sm font-normal text-gray-500">(optional)</span></h2>
                                                    <p className="text-sm text-gray-500 mt-1">Add social profiles or your website to help customers find you.</p>
                                                    <hr className="border-t border-gray-300 my-3" />
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {["facebook", "instagram", "twitter", "linkedin"].map((sm) => (
                                                        <div key={sm} className="flex flex-col">
                                                            <label className="text-sm font-medium text-slate-700 mb-1">
                                                                {sm.charAt(0).toUpperCase() + sm.slice(1)}
                                                            </label>
                                                            <Input
                                                                name={`socialMedia.${sm}`}
                                                                placeholder={`Enter ${sm.charAt(0).toUpperCase() + sm.slice(1)} URL`}
                                                                value={formData.socialMedia[sm]}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* Website - full width */}
                                                    <div className="flex flex-col sm:col-span-2">
                                                        <label className="text-sm font-medium text-slate-700 mb-1">Website </label>
                                                        <Input
                                                            name="socialMedia.website"
                                                            placeholder="Enter website URL"
                                                            value={formData.socialMedia.website}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                                {/* Cancel Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        variant="outline"
                                                        onClick={goBack}
                                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                                    >
                                                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                                                        Cancel
                                                    </Button>
                                                </div>

                                                {/* Next / Continue Button */}
                                                <div className="flex-1">
                                                    <Button
                                                        onClick={goNext}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
                                                    >
                                                        Next
                                                        <ArrowRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.section>
                                    )}

                                    {/* STEP 5 - Review & Submit */}
                                    {step === 5 && (
                                        <motion.section
                                            key="s5"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className=" p-6 bg-white">
                                                <h2 className="text-xl font-semibold text-slate-900 mb-1">Review & Submit</h2>
                                                <p className="text-sm text-slate-500 mb-4">
                                                    Confirm the details below before publishing.
                                                </p>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {[
                                                            { label: "Title", value: formData.title },
                                                            { label: "Category", value: formData.category },
                                                            { label: "Email", value: formData.email },
                                                            { label: "Phone", value: formData.phone },
                                                            { label: "State", value: formData.address.state },
                                                            { label: "District / Pincode", value: `${formData.address.district || "—"} / ${formData.address.pincode || "—"}` },
                                                        ].map((item) => (
                                                            <div key={item.label} className="flex flex-col">
                                                                <span className="text-xs text-slate-400">{item.label}</span>
                                                                <span className="text-sm font-medium text-slate-900">{item.value || "—"}</span>
                                                            </div>
                                                        ))}

                                                        <div className="sm:col-span-2 flex flex-col">
                                                            <span className="text-xs text-slate-400">Description</span>
                                                            <span className="text-sm font-medium text-slate-900 whitespace-pre-wrap">{formData.description || "—"}</span>
                                                        </div>
                                                    </div>

                                                    {image && (
                                                        <div className="pt-4">
                                                            <span className="text-xs text-slate-400">Preview</span>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt="preview"
                                                                className="w-full sm:w-64 h-40 object-cover rounded-lg mt-2 border border-gray-200 shadow-sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>


                                            <div className="flex gap-3 mt-4">
                                                <div className="w-1/2">
                                                    <Button variant="outline" onClick={goBack} className="w-full">
                                                        <ArrowLeft className="mr-2" /> Back
                                                    </Button>
                                                </div>
                                                <div className="w-1/2">
                                                    <Button onClick={handleSubmit} className="w-full bg-green-600 text-white">
                                                        Submit Listing
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.section>
                                    )}
                                </AnimatePresence>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
