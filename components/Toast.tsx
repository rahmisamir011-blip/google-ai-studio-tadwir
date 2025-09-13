import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string | null;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Allow time for fade-out animation before calling dismiss
                setTimeout(onDismiss, 300);
            }, 3000); // Show for 3 seconds

            return () => clearTimeout(timer);
        }
    }, [message, onDismiss]);
    
    if (!message) return null;

    return (
        <div 
            className={`fixed top-5 right-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg p-4 font-semibold flex items-center gap-3 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <span>{message}</span>
        </div>
    );
};
