import CategoryListinPage from "@/components/categorylisting/CategoryListinPage";
// export const metadata = {
//     title: "Contact Us || Odisha Biz",
//     description: "Sign up to create your account and access all features of our platform.",
// };

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // Convert slug → "Transportation And Logistics"
    const categoryName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        title: `${categoryName} | Odisha Biz`,
        description: `Explore the best ${categoryName} listings, services, and businesses across Odisha. Discover detailed information and connect with providers near you.`,
        openGraph: {
            title: `${categoryName} | Odisha Biz`,
            description: `Find top-rated ${categoryName} listings and services in Odisha.`,
            url: `/category/${slug}`,
            type: "website",
        },
        alternates: {
            canonical: `/category/${slug}`,
        },
    };
}

export default async function Page(props) {
    const { slug } = await props.params; // <- IMPORTANT FIX

    return <CategoryListinPage categorySlug={slug} />;
}
