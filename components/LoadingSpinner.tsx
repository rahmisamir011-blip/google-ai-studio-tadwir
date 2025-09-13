import React, { useState, useEffect } from 'react';

const messages = [
    "...المساعد الذكي يفكر",
    "...جاري تحليل الصورة",
    "...البحث عن أفضل النصائح",
    "...لحظات قليلة ويعود",
];

export const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
        setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8 text-center">
      <style>{`
        @keyframes spin-pulse {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        .animate-spin-pulse {
          animation: spin-pulse 1.5s linear infinite;
        }
      `}</style>
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin-pulse"></div>
      <p className="text-emerald-800 font-semibold transition-opacity duration-500" key={messageIndex}>{messages[messageIndex]}</p>
      <p className="text-sm text-gray-500">قد يستغرق هذا بضع ثوانٍ</p>
    </div>
  );
};