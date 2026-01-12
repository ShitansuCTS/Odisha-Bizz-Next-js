export default function ListingSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 animate-pulse">
            <div className="flex gap-4">
                {/* Image */}
                <div className="w-44 h-40 bg-gray-200 rounded-lg" />

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-6 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />

                    {/* Contact lines */}
                    <div className="space-y-2 pt-2">
                        <div className="h-3 w-40 bg-gray-200 rounded" />
                        <div className="h-3 w-52 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>

            {/* Social / Button */}
            <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
                    ))}
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded-md" />
            </div>
        </div>
    );
}
