import React from 'react';
import type { AiResponse } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ResponseDisplay } from './ResponseDisplay';

interface VoiceResultModalProps {
    response: AiResponse | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

export const VoiceResultModal: React.FC<VoiceResultModalProps> = ({ response, isLoading, error, onClose }) => {
    if (!isLoading && !error && !response) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4 transition-opacity duration-300 animate-fade-in-quick"
            onClick={onClose}
        >
            <div 
                className="bg-white/90 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 w-8 h-8 bg-gray-200/80 rounded-full flex items-center justify-center hover:bg-gray-300/80 transition-colors z-50"
                    aria-label="إغلاق"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {isLoading && <LoadingSpinner />}
                
                {error && (
                    <div className="text-center py-8">
                        <h3 className="text-xl font-bold text-red-700 mb-2">حدث خطأ</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                )}

                {response && !isLoading && <ResponseDisplay response={response} />}
            </div>
            <style>{`
                @keyframes fade-in-quick {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-quick {
                    animation: fade-in-quick 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
