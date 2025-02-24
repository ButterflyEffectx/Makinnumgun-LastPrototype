import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const Nav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // ตรวจสอบ token ใน localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // สมมติว่าเราเก็บข้อมูล user ใน localStorage ด้วย
            const user = JSON.parse(localStorage.getItem('user'));
            setIsLoggedIn(true);
            setUserData(user);
        }
    }, []);

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

                <div className="bg-white py-1 px-2 rounded-xl flex items-center w-64">
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
                    <input
                        type="text"
                        placeholder="ค้นหาเมนู..."
                        className="w-full ml-2 py-2 px-2 font-inter bg-transparent focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-x-28 mr-16">
                    <ul className="flex items-center space-x-11 text-xl italic font-semibold text-white">
                        <li className="cursor-pointer hover:text-orange-200 transition-colors">หน้าแรก</li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors">เกี่ยวกับเรา</li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors">เมนู</li>
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
                                            href="/profile"
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
