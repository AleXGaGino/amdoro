export default function ProductCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-blue-500/20 animate-pulse">
      {/* Image skeleton */}
      <div className="h-64 bg-slate-700" />
      
      <div className="p-5">
        {/* Social proof skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-4 bg-slate-700 rounded w-24" />
          <div className="h-4 bg-slate-700 rounded w-28" />
        </div>
        
        {/* Brand skeleton */}
        <div className="h-3 bg-slate-700 rounded w-20 mb-2" />
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-slate-700 rounded w-32" />
          <div className="h-4 bg-slate-700 rounded w-12" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}
