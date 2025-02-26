import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Nav from '@/Components/Nav'

const Dashboard = () => {
    const [dailySummary, setDailySummary] = useState(null);
    const [foodLogs, setFoodLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // ตรวจสอบว่ามี token หรือไม่
                const token = localStorage.getItem('token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                // ตั้งค่า headers สำหรับ request
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                };

                // ดึงข้อมูล daily summary
                const summaryResponse = await axios.get(`/api/daily-summary?date=${date}`, config);
                setDailySummary(summaryResponse.data.data);

                // ดึงข้อมูล food logs
                const logsResponse = await axios.get(`/api/food-logs?date=${date}`, config);
                setFoodLogs(logsResponse.data.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
                setLoading(false);

                // ตรวจสอบว่าเป็น error เกี่ยวกับการ authentication หรือไม่
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        };

        fetchData();
    }, [date]);

    // คำนวณเปอร์เซ็นต์แคลอรี่ที่ใช้ไปแล้ว
    const calculateCaloriePercentage = () => {
        if (!dailySummary) return 0;

        const percentage = (dailySummary.total_calories_consumed / dailySummary.goal_calories) * 100;
        return Math.min(percentage, 100); // ไม่เกิน 100%
    };

    // แปลงวันที่เป็นรูปแบบที่อ่านง่าย
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    // เปลี่ยนวันที่
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-md max-w-lg w-full">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 text-red-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav />
            <div className="container mx-auto p-4 pt-6 lg:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                        แดชบอร์ดการติดตามอาหาร
                    </h1>

                    {/* Date Selector */}
                    <div className="w-full md:w-auto">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    className="border-none focus:ring-0 p-0 text-gray-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Goal Calories Card */}
                    <Card className="overflow-hidden border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">เป้าหมายแคลอรี่ประจำวัน</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-800 mb-2">
                                {dailySummary ? dailySummary.goal_calories.toLocaleString('th-TH') : 0}
                                <span className="text-lg font-normal text-gray-500 ml-1">แคลอรี่</span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center">
                                <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(date)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Calories Consumed Card */}
                    <Card className="overflow-hidden border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">แคลอรี่ที่บริโภคแล้ว</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-800 mb-3">
                                {dailySummary ? dailySummary.total_calories_consumed.toLocaleString('th-TH') : 0}
                                <span className="text-lg font-normal text-gray-500 ml-1">แคลอรี่</span>
                            </div>
                            <div className="mb-1">
                                <Progress value={calculateCaloriePercentage()} className="h-2" color="amber" />
                            </div>
                            <p className="text-sm text-gray-500">
                                {dailySummary ? `${calculateCaloriePercentage().toFixed(1)}% ของเป้าหมาย` : '0% ของเป้าหมาย'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Remaining Calories Card */}
                    <Card className="overflow-hidden border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">แคลอรี่คงเหลือ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-4xl font-bold mb-2 ${dailySummary && dailySummary.calories_difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {dailySummary ? dailySummary.calories_difference.toLocaleString('th-TH') : 0}
                                <span className="text-lg font-normal ml-1">แคลอรี่</span>
                            </div>
                            <p className="text-sm flex items-center">
                                <svg className={`h-4 w-4 mr-1 ${dailySummary && dailySummary.calories_difference < 0 ? 'text-red-400' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {dailySummary && dailySummary.calories_difference < 0 ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    )}
                                </svg>
                                <span className={`${dailySummary && dailySummary.calories_difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {dailySummary && dailySummary.calories_difference < 0
                                        ? 'คุณบริโภคเกินเป้าหมายแล้ว'
                                        : 'คุณยังสามารถบริโภคได้อีก'}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Food Log Table */}
                <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="border-b bg-gray-50 px-6">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-semibold text-gray-800">รายการอาหารที่บริโภควันนี้</CardTitle>
                            <span className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                {foodLogs.length} รายการ
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {foodLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500 bg-gray-50 border-b">
                                            <th className="px-6 py-3 font-medium">ชื่ออาหาร</th>
                                            <th className="px-6 py-3 font-medium">หมวดหมู่</th>
                                            <th className="px-6 py-3 font-medium text-right">ปริมาณ</th>
                                            <th className="px-6 py-3 font-medium text-right">แคลอรี่ทั้งหมด</th>
                                            <th className="px-6 py-3 font-medium text-right">เวลาที่บันทึก</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {foodLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 text-gray-800 font-medium">{log.food.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {log.category.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600">{log.servings} {log.food.serving_size}</td>
                                                <td className="px-6 py-4 text-right font-medium">{log.total_calories.toLocaleString('th-TH')}</td>
                                                <td className="px-6 py-4 text-right text-gray-500">
                                                    {new Date(log.created_at).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 font-medium border-t border-gray-200">
                                            <td colSpan="3" className="px-6 py-4 text-right text-gray-700">รวมแคลอรี่ทั้งหมด:</td>
                                            <td className="px-6 py-4 text-right text-gray-800 font-bold">
                                                {dailySummary ? dailySummary.total_calories_consumed.toLocaleString('th-TH') : 0} แคลอรี่
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="mb-4 bg-gray-100 rounded-full p-3">
                                    <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-2">ยังไม่มีรายการอาหารสำหรับวันนี้</p>
                                <p className="text-gray-500 text-sm">กรุณาเพิ่มรายการอาหารที่คุณรับประทาน</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 shadow-sm">
                                    เพิ่มรายการอาหาร
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
