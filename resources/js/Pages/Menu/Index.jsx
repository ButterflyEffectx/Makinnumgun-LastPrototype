import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from "@inertiajs/react";
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import Nav from '@/Components/Nav'

// Nav Component แบบ Nested Component


// Index Component หลัก
const Index = ({ menuItems, categories, activeCategory = 'ทั้งหมด', users }) => {
    const { auth } = usePage().props;  // Add this line to get auth data
    const [searchQuery, setSearchQuery] = useState('');
    const [moreInfo, setMoreInfo] = useState({});
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    console.log('Auth data from Inertia props:', auth);
    console.log('Auth user data:', auth.user);
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

    const handleSave = () => {
        // ตรวจสอบการล็อกอินจากทั้ง auth.user และ localStorage
        const isLoggedInViaAuth = auth && auth.user;
        const isLoggedInViaLocalStorage = localStorage.getItem('token');

        console.log('Logged in via Inertia:', isLoggedInViaAuth);
        console.log('Logged in via localStorage:', !!isLoggedInViaLocalStorage);

        // ตรวจสอบการล็อกอิน
        if (!isLoggedInViaAuth && !isLoggedInViaLocalStorage) {
            alert('กรุณาเข้าสู่ระบบก่อนบันทึกรายการอาหาร');
            window.location.href = '/login';
            return;
        }

        if (Object.keys(cart).length === 0) {
            alert('กรุณาเพิ่มรายการอาหารก่อนบันทึก');
            return;
        }

        setIsSaving(true);

        // สร้าง token header ถ้ามี token
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const foodLogs = Object.values(cart).map(item => ({
            food_id: item.id,
            catagory_id: item.catagory_id,
            servings: item.quantity,
            total_calories: item.calories * item.quantity
        }));

        // ส่งข้อมูลพร้อม token header
        axios.post('/api/menu/store', {
            foods: foodLogs
        }, { headers })
            .then(response => {
                setCart({});
                setIsCartOpen(false);
                alert('บันทึกรายการอาหารเรียบร้อยแล้ว');
            })
            .catch(error => {
                console.error('Save errors:', error);
                if (error.response && error.response.status === 401) {
                    alert('กรุณาเข้าสู่ระบบก่อนบันทึกรายการอาหาร');
                    window.location.href = '/login';
                } else {
                    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกรายการอาหาร');
                }
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

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
            <Nav users={users} auth={auth} />
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
                    <div className="w-full max-h-[1420px] overflow-y-auto border p-12 rounded-xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
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
            </div >
            <CartPanel />
        </>
    );
};

export default Index;
