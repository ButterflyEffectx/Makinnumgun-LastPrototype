import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from '@/utils/axios';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Nav from '@/Components/Nav'
import imagesLogin from '@/Pages/Auth/image/bgpasta.jpg'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    // ฟังก์ชั่นสำหรับจัดการการเปลี่ยนแปลงของ input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // เคลียร์ error เมื่อผู้ใช้เริ่มพิมพ์
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        // เคลียร์ general error เมื่อผู้ใช้เริ่มแก้ไขข้อมูล
        if (generalError) {
            setGeneralError('');
        }
    };

    // ฟังก์ชั่นสำหรับตรวจสอบข้อมูลก่อนส่ง
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'กรุณากรอกอีเมล';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }

        if (!formData.password) {
            newErrors.password = 'กรุณากรอกรหัสผ่าน';
        } else if (formData.password.length < 6) {
            newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ฟังก์ชั่นสำหรับจัดการการ submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบความถูกต้องของข้อมูล
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setGeneralError('');

        try {
            // กำหนด headers สำหรับ request
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            };

            // ส่ง request ไปยัง server
            const response = await axios.post('/api/login', formData, { headers });

            // ตรวจสอบการตอบกลับจาก server
            if (response.data?.token) {
                // จัดเก็บ token และ redirect
                localStorage.setItem('token', response.data.token);
                router.visit('/menu');
            } else {
                throw new Error('ไม่พบ token ในการตอบกลับ');
            }
        } catch (error) {
            console.error('Login error:', error);

            // จัดการ error ตามประเภทต่างๆ
            if (error.response?.status === 422) {
                // Validation errors
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 401) {
                // Authentication failed
                setGeneralError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            } else if (error.response?.status === 429) {
                // Too many attempts
                setGeneralError('คุณพยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่');
            } else if (error.response?.status === 500) {
                // Server error
                setGeneralError('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ');
            } else if (!navigator.onLine) {
                // Network error
                setGeneralError('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบการเชื่อมต่อของคุณ');
            } else {
                // Unknown error
                setGeneralError('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        ยินดีต้อนรับกลับ
                    </h2>

                    {generalError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{generalError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                อีเมล
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                                required
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                รหัสผ่าน
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                                required
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    จดจำฉันไว้
                                </label>
                            </div>

                            <a href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-800">
                                ลืมรหัสผ่าน?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        ยังไม่มีบัญชี?{' '}
                        <a href="/register" className="text-orange-600 hover:text-orange-800">
                            ลงทะเบียนที่นี่
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
