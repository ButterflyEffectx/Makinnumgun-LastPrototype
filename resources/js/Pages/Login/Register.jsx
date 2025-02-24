import axios from 'axios';
import React from 'react';
import { useForm, router } from '@inertiajs/react';
import bg from '../Auth/image/bgpasta.jpg'

export default function Register() {
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        age: '',
        weight: '',
        height: '',
        goal_calories: '',
    });

    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await axios.post('/api/register', data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                router.visit('/login');
            }
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{backgroundImage: `url(${bg})`}} className="w-full min-h-screen bg-cover bg-center bg-blend-multiply bg-gray-300 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">ลงทะเบียน</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">ชื่อ</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">รหัสผ่าน</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                            />
                            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            <div className="text-gray-500 text-sm mt-1">
                            รหัสผ่านต้องประกอบด้วยอักขระอย่างน้อย 8 ตัว อักษรตัวพิมพ์ใหญ่ 1 ตัว อักษรตัวพิมพ์เล็ก 1 ตัว ตัวเลข 1 ตัว และอักขระพิเศษ 1 ตัว
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                            />
                        </div>
                    </div>

                    {/* Physical Information */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">อายุ (Age)</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={data.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                                />
                                {errors.age && <div className="text-red-500 text-sm mt-1">{errors.age}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">น้ำหนัก (Kg.)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={data.weight}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                                />
                                {errors.weight && <div className="text-red-500 text-sm mt-1">{errors.weight}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">ส่วนสูง (Cm.)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={data.height}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                                />
                                {errors.height && <div className="text-red-500 text-sm mt-1">{errors.height}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">เป้าหมายแคลอรี่ต่อวัน</label>
                                <input
                                    type="number"
                                    name="goal_calories"
                                    value={data.goal_calories}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-300"
                                />
                                {errors.goal_calories && <div className="text-red-500 text-sm mt-1">{errors.goal_calories}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <a
                            href="/login"
                            className="text-orange-600 hover:text-orange-800"
                        >
                            มีบัญชีอยู่แล้วใช่ไหม?
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            {processing ? 'Creating Account...' : 'สร้างบัญชี'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
