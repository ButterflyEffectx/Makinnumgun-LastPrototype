import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from "@inertiajs/react";
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

// Nav Component แบบ Nested Component
const Nav = () => {
    const { auth } = usePage().props;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // ถ้ามีข้อมูล auth.user จาก props ให้ใช้ข้อมูลนั้นเลย
        if (auth && auth.user) {
            setIsLoggedIn(true);
            setUserData(auth.user);
        } else {
            // fallback ไปใช้ localStorage ถ้าไม่มี auth.user
            const token = localStorage.getItem('token');
            if (token) {
                const user = JSON.parse(localStorage.getItem('user'));
                setIsLoggedIn(true);
                setUserData(user);
            }
        }
    }, [auth]);

    const handleLogout = () => {
        // ล้างข้อมูลใน localStorage
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

// Index Component หลัก
const Index = ({ menuItems, categories, activeCategory = 'ทั้งหมด', users }) => {
    const user = usePage().props.auth.user;
    console.log(user);
    console.log(`'Auth user' ${users}`);
    const { auth } = usePage().props;
    console.log('Auth data:', auth);
    console.log('User data:', users);
    const [searchQuery, setSearchQuery] = useState('');
    const [moreInfo, setMoreInfo] = useState({});
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);



    const toggleInfo = (id) => {
        setMoreInfo((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const addToCart = (food) => {
        setCart((prev) => ({
            ...prev,
            [food.id]: {
                ...food,
                quantity: (prev[food.id]?.quantity || 0) + 1
            }
        }));
    };

    const removeFromCart = (foodId) => {
        setCart((prev) => {
            const newCart = { ...prev };
            delete newCart[foodId];
            return newCart;
        });
    };

    const updateQuantity = (foodId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(foodId);
            return;
        }

        setCart((prev) => ({
            ...prev,
            [foodId]: {
                ...prev[foodId],
                quantity: newQuantity
            }
        }));
    };

    const getUserIdFromLocalStorage = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id; // หรือ user.user_id ขึ้นอยู่กับโครงสร้างข้อมูล
        }
        return null;
    }

    const handleSave = () => {
        const userId = getUserIdFromLocalStorage();
        if (!userId) {
            alert('กรุณาเข้าสู่ระบบก่อนบันทึกรายการอาหาร');
            return;
        }

        // สร้างข้อมูลสำหรับส่งไปยัง API
        const foodLogs = Object.values(cart).map(item => ({
            user_id: userId,  // เพิ่ม user_id ลงไปในข้อมูลที่ส่ง
            food_id: item.id,
            date: new Date().toISOString().split('T')[0],
        }));

        // ส่งข้อมูลไปยัง API
        router.post('/food/store', {
            foods: foodLogs
        }, { /* options */ });
    }

    // กรองรายการอาหารตามคำค้นหา
    const filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // CartPanel Component แบบ Nested Component
    const CartPanel = () => (
        <div className={`fixed right-0 top-0 h-full w-80 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-white font-bold">รายการอาหาร</h2>
                <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-white hover:text-yellow-500"
                >
                    ✕
                </button>
            </div>

            {Object.values(cart).length === 0 ? (
                <p className="text-gray-400">ไม่มีรายการอาหาร</p>
            ) : (
                <div className="flex flex-col h-fit">
                    <div className="flex-grow space-y-4 overflow-y-auto">
                        {Object.values(cart).map((item) => (
                            <div key={item.id} className="bg-gray-700 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-white">{item.name}</span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        ลบ
                                    </button>
                                </div>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="bg-yellow-500 px-2 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="text-white mx-3">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="bg-yellow-500 px-2 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-white mt-2">
                                    แคลอรี่รวม: {item.calories * item.quantity} Kcal
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-white mb-2">
                            แคลอรี่รวมทั้งหมด: {
                                Object.values(cart).reduce((total, item) =>
                                    total + (item.calories * item.quantity), 0)
                            } Kcal
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-500"
                        >
                            {isSaving ? 'กำลังบันทึก...' : 'บันทึกรายการอาหาร'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="container mx-auto px-12">
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหาเมนูอาหาร"
                                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-8 overflow-x-auto">
                        <div className="flex justify-between text-white text-lg tracking-wider">
                            <div className="flex space-x-7">
                                <button onClick={() => router.get(route('menu.index'))} className="bg-yellow-500 py-1 px-3 rounded-md">
                                    ทั้งหมด
                                </button>
                                <button onClick={() => router.get(route('menu.general'))} className="hover:text-yellow-500">
                                    อาหารทั่วไป
                                </button>
                                <button onClick={() => router.get(route('menu.dessert'))} className="hover:text-yellow-500">
                                    ของหวาน
                                </button>
                                <button onClick={() => router.get(route('menu.healthy'))} className="hover:text-yellow-500">
                                    อาหารคลีน
                                </button>
                                <button onClick={() => router.get(route('menu.junk'))} className="hover:text-yellow-500">
                                    อาหารขยะ
                                </button>
                                <button onClick={() => router.get(route('menu.beverages'))} className="hover:text-yellow-500">
                                    เครื่องดื่ม
                                </button>
                            </div>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="bg-orange-500 hover:bg-green-500 py-2 px-3 rounded-md relative"
                            >
                                รายการอาหาร
                                {Object.keys(cart).length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                        {Object.keys(cart).length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredMenuItems.map((food) => (
                            <div key={food.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                                <div className="relative">
                                    <img
                                        src={`./${food.image}`}
                                        alt={food.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white tracking-wider text-center">
                                        {food.name}
                                    </h3>
                                    <div className="flex justify-between text-white mt-2 flex-col text-lg">
                                        <p className="text-yellow-500">{food.calories} Kcal</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-white text-[15px]">รายละเอียด</p>
                                            <button
                                                className="text-2xl bg-yellow-500 px-2 rounded-lg drop-shadow-md transition-transform duration-300"
                                                onClick={() => toggleInfo(food.id)}
                                            >
                                                {moreInfo[food.id] ? '-' : '+'}
                                            </button>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${moreInfo[food.id] ? 'h-auto py-2' : 'h-0'}`}>
                                            <div className="flex flex-col">
                                                <span>แคลอรี่ : {food.calories} Kcal</span>
                                                <span>โปรตีน : {food.protein} g.</span>
                                                <span>คาร์บ : {food.carbs} g.</span>
                                                <span>ไขมัน : {food.fats} g.</span>
                                                <span>จำนวน : {food.serving_size}</span>
                                                <button
                                                    onClick={() => addToCart(food)}
                                                    className="bg-yellow-500 py-1 rounded-lg mt-2 hover:bg-green-500 transition-all duration-300"
                                                >
                                                    เพิ่มรายการ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <CartPanel />
        </>
    );
};

export default Index;
