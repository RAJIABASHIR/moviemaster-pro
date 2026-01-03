import Skeleton from "./Skeleton";

export default function MovieCardSkeleton() {
    return (
        <div className="card flex flex-col h-full border border-slate-200 dark:border-slate-800">
            {/* Poster placeholder */}
            <Skeleton className="w-full h-72 md:h-80 rounded-none rounded-t-xl" />

            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Genre/Year */}
                <Skeleton className="h-4 w-1/2" />

                {/* Rating */}
                <Skeleton className="h-4 w-1/4 mb-2" />

                {/* Button */}
                <Skeleton className="h-10 w-full mt-auto" />
            </div>
        </div>
    );
}
