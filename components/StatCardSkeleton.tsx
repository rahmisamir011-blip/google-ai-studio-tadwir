import React from 'react';

export const StatCardSkeleton: React.FC = () => (
    <div className="bg-white/60 rounded-xl shadow-md p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-2">
            <div className="h-6 w-1/4 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
        </div>
    </div>
);