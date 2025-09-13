import React from 'react';
import type { Category } from '../types';

const PlasticIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white animate-pulse-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.63 8.37A3.5 3.5 0 0017.5 6h-11A3.5 3.5 0 003 9.5v.05c0 .38.06.75.17 1.1l1.5 5.25A4 4 0 008.58 19h6.84a4 4 0 003.9-2.85l1.5-5.25a3.5 3.5 0 00.18-1.15v-.03z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 6V4.5A2.5 2.5 0 019.5 2h5A2.5 2.5 0 0117 4.5V6" />
    </svg>
);

const PaperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white animate-pulse-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const GlassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white animate-pulse-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 2.25L12 4.5l-2.25-2.25m4.5 0l2.25 2.25L12 9l-2.25-2.25L14.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75l-2.25 2.25L12 21l2.25-2.25L12 15.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l2.25-2.25 2.25 2.25-2.25 2.25-2.25-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25l2.25-2.25 2.25 2.25-2.25 2.25L5.25 14.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 14.25l2.25-2.25 2.25 2.25-2.25 2.25-2.25-2.25z" />
    </svg>
);


const MetalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white animate-pulse-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);


const GeneralIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-pulse-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);

export const getCategoryIcon = (category: Category): JSX.Element => {
    const iconToRender = () => {
        switch (category) {
            case 'plastic': return <PlasticIcon />;
            case 'paper': return <PaperIcon />;
            case 'glass': return <GlassIcon />;
            case 'metal': return <MetalIcon />;
            default: return <GeneralIcon />;
        }
    };

    return (
        <>
            <style>
            {`
                .animate-pulse-icon {
                    animation: pulse-icon-animation 2.5s ease-in-out infinite;
                    transform-origin: center;
                }
                @keyframes pulse-icon-animation {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                }
            `}
            </style>
            {iconToRender()}
        </>
    );
};

export const getCategoryColor = (category: Category): string => {
     switch (category) {
        case 'plastic': return 'bg-sky-500';
        case 'paper': return 'bg-orange-500';
        case 'glass': return 'bg-green-500';
        case 'metal': return 'bg-slate-500';
        default: return 'bg-emerald-500';
    }
};