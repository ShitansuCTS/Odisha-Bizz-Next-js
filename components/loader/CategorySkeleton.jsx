export default function SkeletonCard() {
    return (
        <div className="animate-pulse">
            <div className="overflow-hidden rounded-2xl shadow-md border flex flex-col h-full">

                {/* IMAGE */}
                <div className="w-full h-48 bg-gray-300"></div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>

                    <div className="mt-4 flex justify-end">
                        <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};