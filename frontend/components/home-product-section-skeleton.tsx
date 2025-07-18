// app/components/HomeProductSectionSkeleton.tsx
export default function HomeProductSectionSkeleton() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        </section>
    );
}
