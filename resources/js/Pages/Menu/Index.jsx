import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from "@inertiajs/react";
import { MagnifyingGlassIcon, UserIcon, ChevronDownIcon, Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import Nav from '@/Components/Nav'

const Index = ({ menuItems, categories, activeCategory = 'ทั้งหมด', users }) => {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [moreInfo, setMoreInfo] = useState({});
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const showCustomAlert = (message, type = 'info') => {
        // Remove any existing alerts first
        const existingAlerts = document.querySelectorAll('.custom-alert-overlay');
        existingAlerts.forEach(alert => alert.remove());

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';

        // Define icon based on alert type
        let icon = '';
        let colorClass = '';

        switch (type) {
            case 'success':
                icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>`;
                colorClass = 'border-green-500';
                break;
            case 'error':
                icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>`;
                colorClass = 'border-red-500';
                break;
            case 'warning':
                icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>`;
                colorClass = 'border-yellow-500';
                break;
            default: // info
                icon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>`;
                colorClass = 'border-blue-500';
        }

        // Create modal content
        overlay.innerHTML = `
            <div class="alert-container max-w-md w-11/12 bg-gray-800 rounded-xl shadow-2xl border-l-4 ${colorClass} transform transition-all duration-300 scale-95 opacity-0">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            ${icon}
                        </div>
                        <div class="ml-4 flex-1">
                            <p class="text-white text-lg font-medium">${message}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <button class="close-alert px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">
                            ตกลง
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(overlay);

        // Animate in
        setTimeout(() => {
            const alertContainer = overlay.querySelector('.alert-container');
            alertContainer.classList.remove('scale-95', 'opacity-0');
            alertContainer.classList.add('scale-100', 'opacity-100');
        }, 10);

        // Add event listener to close button
        const closeButton = overlay.querySelector('.close-alert');
        closeButton.addEventListener('click', () => {
            closeAlert(overlay);
        });

        // Close when clicking outside the alert
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAlert(overlay);
            }
        });

        // Auto-close after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => closeAlert(overlay), 5000);
        }
    };

    const closeAlert = (overlay) => {
        const alertContainer = overlay.querySelector('.alert-container');
        alertContainer.classList.remove('scale-100', 'opacity-100');
        alertContainer.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            overlay.remove();
        }, 300);
    };

    // Replace all alert() calls with our custom alert
    const originalAlert = window.alert;
    window.alert = function(message) {
        // Detect type of alert based on message content
        let type = 'info';
        if (message.toLowerCase().includes('เรียบร้อย') || message.toLowerCase().includes('สำเร็จ')) {
            type = 'success';
        } else if (message.toLowerCase().includes('ผิดพลาด') || message.toLowerCase().includes('กรุณา')) {
            type = 'error';
        }

        showCustomAlert(message, type);
    };

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-alert-overlay {
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .alert-container {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);

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

        // Optional: Show a small notification or animation
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade';
        notification.textContent = `เพิ่ม ${food.name} ในรายการแล้ว`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
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
        const isLoggedInViaAuth = auth && auth.user;
        const isLoggedInViaLocalStorage = localStorage.getItem('token');

        if (!isLoggedInViaAuth && !isLoggedInViaLocalStorage) {
            alert('กรุณาเข้าสู่ระบบก่อนบันทึกรายการอาหาร');
            return;
        }

        if (Object.keys(cart).length === 0) {
            alert('กรุณาเพิ่มรายการอาหารก่อนบันทึก');
            return;
        }

        setIsSaving(true);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const foodLogs = Object.values(cart).map(item => ({
            food_id: item.id,
            catagory_id: item.catagory_id,
            servings: item.quantity,
            total_calories: item.calories * item.quantity
        }));

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

    // Component สำหรับแสดงแต่ละเมนูอาหาร
    const FoodCard = ({ food }) => (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105">
            <div className="relative overflow-hidden group">
                <img
                    src={`./${food.image}`}
                    alt={food.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white tracking-wider text-center truncate">
                    {food.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-500 font-medium">{food.calories} Kcal</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => addToCart(food)}
                            className="bg-yellow-500 text-white p-1 rounded-full hover:bg-green-500 transition-colors duration-300"
                            title="เพิ่มรายการทันที"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors duration-300"
                            onClick={() => toggleInfo(food.id)}
                            title="ดูรายละเอียด"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out mt-3 ${moreInfo[food.id] ? 'max-h-64' : 'max-h-0'}`}>
                    <div className="bg-gray-700 p-3 rounded-lg text-sm">
                        <div className="grid grid-cols-2 gap-2 text-white">
                            <div className="flex items-center">
                                <span className="w-4 h-4 mr-2 rounded-full bg-red-500"></span>
                                <span>แคลอรี่: {food.calories} Kcal</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 mr-2 rounded-full bg-blue-500"></span>
                                <span>โปรตีน: {food.protein} g</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 mr-2 rounded-full bg-yellow-500"></span>
                                <span>คาร์บ: {food.carbs} g</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 mr-2 rounded-full bg-green-500"></span>
                                <span>ไขมัน: {food.fats} g</span>
                            </div>
                        </div>
                        <div className="mt-2 text-white">
                            <span>จำนวน: {food.serving_size}</span>
                        </div>
                        <button
                            onClick={() => addToCart(food)}
                            className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-3 hover:bg-green-500 transition-all duration-300 flex items-center justify-center"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            เพิ่มรายการ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // CartPanel Component
    const CartPanel = () => (
        <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-white font-bold flex items-center">
                    <ShoppingCartIcon className="h-6 w-6 mr-2 text-yellow-500" />
                    รายการอาหาร
                </h2>
                <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-white hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {Object.values(cart).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <ShoppingCartIcon className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">ไม่มีรายการอาหาร</p>
                    <p className="text-sm mt-2">เพิ่มอาหารที่คุณต้องการลงในรายการ</p>
                </div>
            ) : (
                <div className="flex flex-col h-[calc(100vh-5rem)]">
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {Object.values(cart).map((item) => (
                            <div key={item.id} className="bg-gray-700 p-4 rounded-lg relative group hover:bg-gray-600 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <span className="text-white font-medium">{item.name}</span>
                                        <div className="text-gray-300 text-sm mt-1">
                                            {item.calories} Kcal / หน่วย
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-900 text-white px-3 py-1 hover:bg-yellow-600"
                                        >
                                            -
                                        </button>
                                        <span className="text-white px-4 py-1">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="bg-gray-900 text-white px-3 py-1 hover:bg-yellow-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-yellow-500 font-medium text-right">
                                        {item.calories * item.quantity} Kcal
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-600 sticky bottom-0 bg-gray-800">
                        <div className="flex justify-between text-white mb-4">
                            <span className="text-lg">แคลอรี่รวมทั้งหมด:</span>
                            <span className="text-xl font-bold text-yellow-500">
                                {Object.values(cart).reduce((total, item) =>
                                    total + (item.calories * item.quantity), 0)} Kcal
                            </span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-500 transition-colors font-medium text-lg flex items-center justify-center"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังบันทึก...
                                </>
                            ) : 'บันทึกรายการอาหาร'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // CategoryNav Component
    const CategoryNav = () => (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex mb-8 text-white text-lg tracking-wider">
                <div className="flex space-x-4 lg:space-x-7 flex-wrap">
                    <button
                        onClick={() => router.get(route('menu.index'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'ทั้งหมด' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => router.get(route('menu.general'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'อาหารทั่วไป' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        อาหารทั่วไป
                    </button>
                    <button
                        onClick={() => router.get(route('menu.dessert'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'ของหวาน' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        ของหวาน
                    </button>
                    <button
                        onClick={() => router.get(route('menu.healthy'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'อาหารคลีน' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        อาหารคลีน
                    </button>
                    <button
                        onClick={() => router.get(route('menu.junk'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'อาหารขยะ' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        อาหารขยะ
                    </button>
                    <button
                        onClick={() => router.get(route('menu.beverages'))}
                        className={`py-2 px-4 rounded-md transition-colors ${activeCategory === 'เครื่องดื่ม' ? 'bg-yellow-500' : 'hover:text-yellow-500'}`}
                    >
                        เครื่องดื่ม
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden relative mb-6">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center justify-between w-full bg-gray-800 py-3 px-4 rounded-lg text-white"
                >
                    <span>{activeCategory || 'ทั้งหมด'}</span>
                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
                        <button
                            onClick={() => {
                                router.get(route('menu.index'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            ทั้งหมด
                        </button>
                        <button
                            onClick={() => {
                                router.get(route('menu.general'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            อาหารทั่วไป
                        </button>
                        <button
                            onClick={() => {
                                router.get(route('menu.dessert'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            ของหวาน
                        </button>
                        <button
                            onClick={() => {
                                router.get(route('menu.healthy'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            อาหารคลีน
                        </button>
                        <button
                            onClick={() => {
                                router.get(route('menu.junk'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            อาหารขยะ
                        </button>
                        <button
                            onClick={() => {
                                router.get(route('menu.beverages'));
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full py-3 px-4 text-left text-white hover:bg-gray-700"
                        >
                            เครื่องดื่ม
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            <Nav users={users} auth={auth} />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-3 md:p-6">
                <div className="container mx-auto px-2 md:px-6 lg:px-12">
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหาเมนูอาหาร..."
                                className="w-full px-5 py-3 pl-12 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <CategoryNav />

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-lg text-white transition-colors duration-300 flex items-center relative"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            <span className="hidden sm:inline">รายการอาหาร</span>
                            {Object.keys(cart).length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                    {Object.keys(cart).length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
                        <div className="p-4 md:p-6 w-full max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
                            {filteredMenuItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="text-xl">ไม่พบรายการอาหารที่ค้นหา</p>
                                    <p className="mt-2">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                                    {filteredMenuItems.map((food) => (
                                        <FoodCard key={food.id} food={food} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay when cart is open on mobile */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsCartOpen(false)}
                ></div>
            )}

            <CartPanel />

            {/* Global styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                @keyframes fade {
                    0% { opacity: 0; transform: translateY(-10px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }

                .animate-fade {
                    animation: fade 2s ease-in-out forwards;
                }
            `}</style>
        </>
    );
};

export default Index;
