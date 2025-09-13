import React from 'react';

export const SuccessAnimation: React.FC = () => {
    return (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-quick"
            aria-modal="true"
            role="dialog"
        >
            <style>{`
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 3;
                    stroke-miterlimit: 10;
                    stroke: #10B981; /* emerald-600 */
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }

                .checkmark {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 4;
                    stroke: #fff;
                    stroke-miterlimit: 10;
                    margin: auto;
                    box-shadow: inset 0px 0px 0px #10B981;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                }

                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }

                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }
                    50% {
                        transform: scale3d(1.1, 1.1, 1);
                    }
                }

                @keyframes fill {
                    100% {
                        box-shadow: inset 0px 0px 0px 60px #10B981;
                    }
                }
                
                @keyframes fade-in-text {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in-text {
                    animation: fade-in-text 0.5s ease-out 1s forwards;
                }

                @keyframes fade-in-quick {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-quick {
                    animation: fade-in-quick 0.2s ease-out forwards;
                }
            `}</style>
            <div className="flex flex-col items-center gap-4">
                <div className="bg-white/20 dark:bg-slate-800/20 p-4 rounded-full">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <p className="text-white text-xl font-bold opacity-0 animate-fade-in-text">تم بنجاح!</p>
            </div>
        </div>
    );
};
