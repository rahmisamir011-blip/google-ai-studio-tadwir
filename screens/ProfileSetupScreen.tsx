import React, { useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserProfile } from '../services/firebaseService';

interface ProfileSetupScreenProps {
    onProfileCreated: () => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onProfileCreated }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!auth.currentUser) {
            setError("User not authenticated. Please log in again.");
            return;
        }

        setLoading(true);
        try {
            await createUserProfile(auth.currentUser, { name, dateOfBirth: dob });
            onProfileCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="min-h-screen flex items-center justify-center bg-transparent p-4 transition-colors duration-500">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                 <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">إكمال ملفك الشخصي</h1>
                 <p className="text-center text-gray-600 mb-6">
                    نحتاج بعض المعلومات الإضافية للبدء.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white placeholder-gray-400 text-black" />
                    </div>
                     <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                        <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white placeholder-gray-400 text-black" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-transform transform active:scale-95 disabled:bg-gray-400">
                        {loading ? '...جاري الحفظ' : 'حفظ ومتابعة'}
                    </button>
                </form>
                 {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};