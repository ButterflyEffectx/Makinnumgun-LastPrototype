import React, { useState, useEffect } from 'react';
import Nav from '@/Components/Nav';
import { router } from '@inertiajs/react';


const FoodMenu = ({ menuItems, categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
    const [moreInfo, setMoreInfo] = useState({});

    const toggleInfo = (id) => {
        setMoreInfo((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    // กรองรายการอาหารตามการค้นหาและหมวดหมู่
    const filteredMenuItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'ทั้งหมด' || item.category.name === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // ฟังก์ชันจัดการการเพิ่มสินค้าลงตะกร้า
    const เพิ่มลงตะกร้า = (รายการ) => {
        console.log('เพิ่มลงตะกร้า:', รายการ);
    };

    const allmenu = (e) => {
        router.get(route('menu.index'));
    };
    const general = (e) => {
        router.get(route('menu.general'));
    };
    const dessert = (e) => {
        router.get(route('menu.dessert'));
    };
    const healthy = (e) => {
        router.get(route('menu.healthy'));
    };
    const junk = (e) => {
        router.get(route('menu.junk'));
    };
    const beverages = (e) => {
        router.get(route('menu.beverages'));
    };


    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="container mx-auto  px-12">
                    {/* ช่องค้นหา */}
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

                    {/* แถบเมนูหมวดหมู่ */}
                    <div className="mb-8 overflow-x-auto">
                        <div className="flex space-x-7 text-white text-lg tracking-wider">
                            <button onClick={allmenu} className="hover:text-yellow-500">
                                ทั้งหมด
                            </button>
                            <button onClick={general} className="hover:text-yellow-500 ">
                                อาหารทั่วไป
                            </button>
                            <button onClick={dessert} className="hover:text-yellow-500">
                                ของหวาน
                            </button>
                            <button onClick={healthy} className="hover:text-yellow-500">
                                อาหารคลีน
                            </button>
                            <button onClick={junk} className="hover:text-yellow-500">
                                อาหารขยะ
                            </button>
                            <button onClick={beverages} className="bg-yellow-500 py-1 px-3 rounded-md ">
                                เครื่องดื่ม
                            </button>
                        </div>
                    </div>

                    {/* ตารางแสดงเมนูอาหาร */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
                        {filteredMenuItems.map((food) => (
                            <div key={food.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                                <div className="relative">
                                    <img
                                        src={`/${food.image}`}
                                        alt={food.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white tracking-wider text-center">{food.name}</h3>
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

                                        {/* แก้ไขส่วนของ content ที่ซ่อน/แสดง */}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${moreInfo[food.id] ? 'h-auto py-2' : 'h-0'}`}>
                                            <div className="flex flex-col">
                                                <span>แคลอรี่ : {food.calories} Kcal</span>
                                                <span>โปรตีน : {food.protein} g.</span>
                                                <span>คาร์บ : {food.carbs} g.</span>
                                                <span>ไขมัน : {food.fats} g.</span>
                                                <span>จำนวน : {food.serving_size}</span>
                                                <button className="bg-yellow-500 py-1 rounded-lg mt-2 hover:bg-green-500 transition-all duration-300">
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
            </div >
        </>
    );
};

export default FoodMenu;
