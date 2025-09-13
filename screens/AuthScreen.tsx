import React, { useState } from 'react';
import { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle
} from '../services/firebaseService';
import { firebaseConfig } from '../config/firebaseConfig';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            // On success, the useAuth hook will handle the redirect
        } catch (err) {
            console.error("Email/Password Auth Error:", err);
            const firebaseError = err as any; // Use 'any' for flexible error inspection
            let userMessage = 'حدث خطأ. الرجاء المحاولة مرة أخرى.';

            const errorCode = firebaseError.code;
            const errorMessage = firebaseError?.error?.message;

            // Handle standard Firebase SDK errors first
            if (errorCode) {
                switch (errorCode) {
                    case 'auth/invalid-credential':
                    case 'auth/wrong-password':
                    case 'auth/user-not-found':
                        userMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                        break;
                    case 'auth/email-already-in-use':
                        userMessage = 'هذا البريد الإلكتروني مسجل بالفعل.';
                        break;
                    case 'auth/weak-password':
                        userMessage = 'كلمة المرور ضعيفة جداً. يجب أن تكون 6 أحرف على الأقل.';
                        break;
                    case 'auth/operation-not-allowed':
                        userMessage = 'طريقة الدخول هذه غير مفعلة من قبل المسؤول.';
                        break;
                }
            } 
            // As a fallback, handle raw REST API error messages
            else if (errorMessage === 'INVALID_LOGIN_CREDENTIALS') {
                userMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
            }

            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error("Social Login Error:", err);
            const firebaseError = err as { code?: string; message?: string };
            let userMessage = 'حدث خطأ أثناء تسجيل الدخول.';

            if (firebaseError.code === 'auth/operation-not-allowed') {
                 userMessage = `خطأ في الإعدادات! [للمطور: تأكد من تفعيل موفر الدخول (Google) في مشروع Firebase الذي يحمل المعرف (Project ID): "${firebaseConfig.projectId}". اذهب إلى Firebase Console -> Authentication -> Sign-in method وقم بتفعيله لهذا المشروع بالتحديد.]`;
            } else if (firebaseError.code === 'auth/popup-closed-by-user') {
                // No error message needed, just stop loading.
                setLoading(false);
                return;
            } else if (firebaseError.code === 'auth/account-exists-with-different-credential') {
                userMessage = 'لديك حساب بنفس الإيميل لكن بطريقة دخول مختلفة.';
            }
            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-4 transition-colors duration-500">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">مرحباً في تدوير</h1>
                <p className="text-center text-gray-600 mb-6">
                    {isLogin ? 'سجّل دخولك للمتابعة' : 'أنشئ حساباً جديداً للبدء'}
                </p>

                <div className="flex border-b border-gray-200 mb-6">
                    <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${isLogin ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}>
                        تسجيل الدخول
                    </button>
                    <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-center font-semibold transition-colors duration-300 ${!isLogin ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}>
                        حساب جديد
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white placeholder-gray-400 text-black" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white placeholder-gray-400 text-black" />
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-transform transform active:scale-95 disabled:bg-gray-400">
                        {loading ? '...جاري التحميل' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">أو</span></div>
                </div>

                <div className="space-y-3">
                    <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="font-semibold text-gray-700">المتابعة باستخدام جوجل</span>
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-6">
                    (created by Rahmi Samir)
                </p>
            </div>
        </div>
    );
};