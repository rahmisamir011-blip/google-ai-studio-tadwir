import React, { useState, useEffect, useRef } from 'react';

interface VoiceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onResult: (transcript: string) => void;
}

// Check for browser support and inform TypeScript
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSupported = !!SpeechRecognition;

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, onResult }) => {
    type Status = 'idle' | 'listening' | 'processing' | 'error';

    const [status, setStatus] = useState<Status>('idle');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    
    // Using a ref for status to avoid stale closures in recognition callbacks
    const statusRef = useRef(status);
    statusRef.current = status;
    
    // This ref will hold the stable, finalized parts of the transcript
    const finalTranscriptRef = useRef<string>('');


    useEffect(() => {
        if (!isSupported) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Key Change: Keep listening until explicitly stopped.
        recognition.lang = 'ar-DZ';
        recognition.interimResults = true;

        recognition.onstart = () => {
            finalTranscriptRef.current = '';
            setTranscript('');
            setStatus('listening');
        };
        
        recognition.onend = () => {
             // This is now just a cleanup callback. Logic is handled by buttons.
            if (statusRef.current === 'listening') {
                setStatus('idle');
            }
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech') {
                setError('لم أسمع أي شيء. هل يمكنك المحاولة مرة أخرى؟');
            } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setError('تم رفض الوصول إلى الميكروفون. يرجى تفعيله في إعدادات المتصفح.');
            } else {
                 setError('حدث خطأ أثناء التعرف على الصوت.');
            }
            setStatus('error');
        };
        
        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            // Iterate through the new results.
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                // If the result is final, append it to our stable ref.
                if (event.results[i].isFinal) {
                    finalTranscriptRef.current += event.results[i][0].transcript + ' ';
                } else {
                    // Otherwise, it's an interim result.
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Update the display with the stable final part and the fluctuating interim part.
            setTranscript(finalTranscriptRef.current + interimTranscript);
        };
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };

    }, []);

    useEffect(() => {
        if (isOpen) {
            setTranscript('');
            setError(null);
            setStatus('idle');
        } else {
            if (recognitionRef.current && statusRef.current !== 'idle') {
                recognitionRef.current.abort(); // Use abort to stop immediately
            }
        }
    }, [isOpen]);

    const handleStartRecording = () => {
        if (recognitionRef.current) {
            try {
                setError(null);
                recognitionRef.current.start();
            } catch(e) {
                console.error("Could not start recognition:", e);
                setError('لم نتمكن من بدء التسجيل. الرجاء المحاولة مرة أخرى.');
                setStatus('error');
            }
        }
    };
    
    const handleStopAndSearch = () => {
        if (statusRef.current !== 'listening') return;

        if (recognitionRef.current) {
            recognitionRef.current.stop(); // Gracefully stop listening. onend will fire.
        }
        
        const result = transcript.trim();
        
        if (result) {
            setStatus('processing');
            onResult(result);
        } else {
            setError('لم يتم تسجيل أي كلام. الرجاء المحاولة مرة أخرى.');
            setStatus('error');
        }
    };


    const handleCancel = () => {
        if (recognitionRef.current && statusRef.current === 'listening') {
            recognitionRef.current.abort();
        }
        onClose();
    };

    if (!isOpen) return null;
    
    if (!isSupported) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">غير مدعوم</h2>
                    <p className="text-gray-600 mb-4">المساعد الصوتي غير مدعوم في هذا المتصفح. الرجاء تجربة متصفح Chrome أو Edge.</p>
                    <button onClick={handleCancel} className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">فهمت</button>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-emerald-800">...جاري المعالجة</h2>
                        <div className="min-h-[7rem] flex items-center justify-center">
                            <p className="text-gray-600">لحظات من فضلك...</p>
                        </div>
                        <div className="flex justify-center items-center h-20 mt-6">
                            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        </div>
                    </>
                );
            case 'listening':
                return (
                     <>
                        <h2 className="text-2xl font-bold mb-4 text-emerald-800">...أنا أستمع</h2>
                        <div className="flex justify-center items-center h-20 mb-4">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                        </div>
                        <div className="min-h-[7rem] flex flex-col justify-center">
                            <p className="text-gray-600">{!transcript ? 'تحدث الآن... اضغط على "بحث" عند الانتهاء.' : ''}</p>
                            <span className="block mt-2 text-lg font-semibold text-gray-800">{transcript}</span>
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                             <button onClick={handleStopAndSearch} disabled={!transcript.trim()} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                بحث
                            </button>
                            <button onClick={handleCancel} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </>
                );
            case 'error':
                 return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-red-700">حدث خطأ</h2>
                        <div className="flex justify-center items-center h-20 mb-4">
                             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                        </div>
                        <div className="min-h-[7rem] flex flex-col justify-center">
                            <p className="text-gray-700">{error}</p>
                        </div>
                         <div className="mt-6 flex flex-col gap-3">
                            <button onClick={handleStartRecording} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                                حاولي مجدداً
                            </button>
                            <button onClick={handleCancel} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                أغلقي
                            </button>
                        </div>
                    </>
                );
            case 'idle':
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-emerald-800">المساعد الصوتي</h2>
                        <div className="flex justify-center items-center h-20 mb-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                        </div>
                        <div className="min-h-[7rem] flex flex-col justify-center">
                            <p className="text-gray-600">اضغطي على الزر لبدء التسجيل الصوتي.</p>
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            <button onClick={handleStartRecording} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                                ابدأ التسجيل
                            </button>
                             <button onClick={handleCancel} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={handleCancel}>
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};