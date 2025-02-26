import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

const Nav = ({ users, auth }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
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

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.user-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <div className="w-full h-auto bg-[#F97316] z-50 shadow-md sticky top-0">
            <div className="px-4 md:px-8 lg:px-16 flex justify-between items-center w-full h-16">
                {/* Logo */}
                <div className="text-2xl md:text-3xl font-bold font-inter italic">
                    <h1 className="cursor-pointer text-white">Makinnumgun</h1>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white p-2"
                    >
                        {mobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-x-4 lg:gap-x-28">
                    <ul className="flex items-center space-x-4 lg:space-x-11 text-lg lg:text-xl italic font-semibold text-white">
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/'>หน้าแรก</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/menu'>เกี่ยวกับเรา</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors"><Link href='/menu'>เมนู</Link></li>
                        <li className="cursor-pointer hover:text-orange-200 transition-colors">ติดต่อ</li>
                    </ul>

                    <div className="relative user-dropdown">
                        {isLoggedIn ? (
                            <div>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="bg-white text-orange-500 px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-orange-50 transition-colors text-sm lg:text-base"
                                >
                                    <UserIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                                    <span className="font-semibold max-w-28 truncate">{userData?.name || 'ผู้ใช้'}</span>
                                    <ChevronDownIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors"
                                        >
                                            ข้อมูลส่วนตัว
                                        </Link>
                                        <Link
                                            href="/edit-profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-orange-50 transition-colors"
                                        >
                                            แก้ไขข้อมูลส่วนตัว
                                        </Link>
                                        {userData?.is_admin === 1 && (
                                            <Link
                                                href="/management"
                                                className="block px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                                            >
                                                Admin Dashboard
                                            </Link>
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
                            <Link
                                href="/login"
                                className="bg-green-500 px-3 py-2 rounded-xl flex items-center gap-1 text-white hover:bg-green-600 transition-colors text-sm lg:text-base"
                            >
                                <UserIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span className="font-semibold">เข้าสู่ระบบ</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu - Overlay with Side Animation */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
                    mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-60 w-72 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Menu Header */}
                    <div className="h-16 bg-[#F97316] flex items-center justify-between px-4">
                        <span className="text-xl font-bold text-white">เมนู</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white p-1"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="px-4 py-5 h-[calc(100%-4rem)] overflow-y-auto">
                        <ul className="space-y-4 text-lg font-semibold text-orange-800">
                            <li className="cursor-pointer hover:text-orange-500 transition-colors p-3 rounded-lg hover:bg-orange-100">
                                <Link href='/' className="block">หน้าแรก</Link>
                            </li>
                            <li className="cursor-pointer hover:text-orange-500 transition-colors p-3 rounded-lg hover:bg-orange-100">
                                <Link href='/menu' className="block">เกี่ยวกับเรา</Link>
                            </li>
                            <li className="cursor-pointer hover:text-orange-500 transition-colors p-3 rounded-lg hover:bg-orange-100">
                                <Link href='/menu' className="block">เมนู</Link>
                            </li>
                            <li className="cursor-pointer hover:text-orange-500 transition-colors p-3 rounded-lg hover:bg-orange-100">
                                <Link href='#' className="block">ติดต่อ</Link>
                            </li>
                        </ul>

                        <div className="mt-6 border-t border-orange-200 pt-6">
                            {isLoggedIn ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 bg-orange-100 rounded-lg">
                                        <UserIcon className="w-5 h-5 text-orange-500" />
                                        <span className="font-semibold text-orange-700 truncate">{userData?.name || 'ผู้ใช้'}</span>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="block p-3 text-gray-800 hover:bg-orange-100 rounded-lg transition-colors"
                                    >
                                        ข้อมูลส่วนตัว
                                    </Link>
                                    <Link
                                        href="/edit-profile"
                                        className="block p-3 text-gray-800 hover:bg-orange-100 rounded-lg transition-colors"
                                    >
                                        แก้ไขข้อมูลส่วนตัว
                                    </Link>
                                    {userData?.is_admin === 1 && (
                                        <Link
                                            href="/management"
                                            className="block p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                                    >
                                        ออกจากระบบ
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-green-500 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-green-600 transition-colors w-full mt-4"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span className="font-semibold">เข้าสู่ระบบ</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;
