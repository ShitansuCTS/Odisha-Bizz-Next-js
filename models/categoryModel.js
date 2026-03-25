import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        // SEO Fields
        metaTitle: {
            type: String,
            trim: true,
            default: "",
        },

        metaDescription: {
            type: String,
            trim: true,
            default: "",
        },

        // 🖼️ Category image (optional for now)
        imageUrl: {
            type: String,
        },

        imagePublicId: {
            type: String,
        },

        // 🟢 Active / inactive
        isActive: {
            type: Boolean,
            default: true,
        },

        // 🔢 Sorting order (optional)
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


// 🔥 Auto-generate slug from name
categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
        });
    }
    next();
});


// ✅ Prevent model overwrite (important in Next.js)
// const Category =
//     mongoose.models.Category || mongoose.model("Category", categorySchema);

// export default Category;


const Category =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;