import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';


const Nav = ({ users, auth }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // ตรวจสอบว่ามีข้อมูล auth.user ไหม
        if (auth && auth.user) {
            console.log('User data from auth props:', auth.user);
            setIsLoggedIn(true);
            setUserData(auth.user);
            // บันทึกข้อมูลผู้ใช้ลง localStorage เพื่อใช้ในครั้งต่อไป
            localStorage.setItem('user', JSON.stringify(auth.user));
            return;
        }

        // ถ้าไม่มี auth.user จาก Inertia ให้ตรวจสอบใน localStorage เป็นแผนสำรอง
        const token = localStorage.getItem('token');
        if (token) {
            // ถ้ามี token ให้ดึงข้อมูลผู้ใช้จาก API
            axios.get('/api/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    setIsLoggedIn(true);
                    setUserData(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLoggedIn(false);
                    setUserData(null);
                });
        } else {
            console.log('No user found in auth or localStorage');
            setIsLoggedIn(false);
            setUserData(null);
        }
    }, [auth]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        setShowDropdown(false);
        window.location.href = '/login';
    };

    return (
        <div className="w-full h-16 bg-[#F97316]">
            <div className="px-18 flex justify-between items-center w-full h-full">
                <div className="text-3xl font-bold font-inter italic ml-16">
                    <h1 className="cursor-pointer text-white">Makinnumgun</h1>
                </div>



                <div className="flex items-center gap-x-28 mr-16">
                    <ul className="flex items-center space-x-11 text-xl italic font-semibold text-white">
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/'>หน้าแรก</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/menu'>เกี่ยวกับเรา</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/menu'>เมนู</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors">ติดต่อ</li>
                    </ul>

                    <div className="relative">
                        {isLoggedIn ? (
                            <div>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-white text-orange-500 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-50 transition-colors"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span className="font-semibold">{userData?.name || 'ผู้ใช้'}</span>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <a
                                            href="/dashboard"
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors"
                                        >
                                            ข้อมูลส่วนตัว
                                        </a>
                                        <a
                                            href="/edit-profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors"
                                        >
                                            แก้ไขข้อมูลส่วนตัว
                                        </a>
                                        {userData?.is_admin === 1 && (
                                            <a
                                                href="/management"
                                                className="block px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                                            >
                                                Admin Dashboard
                                            </a>
                                        )}
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            ออกจากระบบ
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a
                                href="/login"
                                className="bg-green-500 px-5 py-2 rounded-xl flex items-center gap-2 text-white hover:bg-green-600 transition-colors"
                            >
                                <UserIcon className="w-5 h-5" />
                                <span className="font-semibold">เข้าสู่ระบบ</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;
