import React, { useState, useEffect } from 'react';
import { Head, usePage } from "@inertiajs/react";
import Nav from '@/Components/Nav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const FoodHistory = () => {
    const { auth } = usePage().props;
    const [foodLogs, setFoodLogs] = useState([]);
    const [dailySummary, setDailySummary] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchFoodLogs();
    }, [selectedDate]);

    const fetchFoodLogs = async () => {
        try {
            const response = await fetch(`/api/food-logs?date=${selectedDate}`);
            const data = await response.json();
            setFoodLogs(data.logs);
            setDailySummary(data.summary);
        } catch (error) {
            console.error('Error fetching food logs:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="container mx-auto px-4">
                    <Card className="bg-gray-800 text-white mb-6">
                        <CardHeader>
                            <CardTitle className="text-2xl">ประวัติการทานอาหาร</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                                />
                            </div>

                            {dailySummary && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg mb-2">แคลอรี่ที่ได้รับ</h3>
                                        <p className="text-2xl text-yellow-500">
                                            {dailySummary.total_calories_consumed} Kcal
                                        </p>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg mb-2">เป้าหมายแคลอรี่</h3>
                                        <p className="text-2xl text-blue-500">
                                            {dailySummary.goal_calories} Kcal
                                        </p>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg mb-2">ส่วนต่าง</h3>
                                        <p className={`text-2xl ${dailySummary.calories_difference > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {dailySummary.calories_difference} Kcal
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-600">
                                            <th className="px-4 py-2 text-left">อาหาร</th>
                                            <th className="px-4 py-2 text-left">หมวดหมู่</th>
                                            <th className="px-4 py-2 text-right">จำนวน</th>
                                            <th className="px-4 py-2 text-right">แคลอรี่</th>
                                            <th className="px-4 py-2 text-right">เวลา</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foodLogs.map((log) => (
                                            <tr key={log.id} className="border-t border-gray-600">
                                                <td className="px-4 py-2">{log.food.name}</td>
                                                <td className="px-4 py-2">{log.category.name}</td>
                                                <td className="px-4 py-2 text-right">{log.servings}</td>
                                                <td className="px-4 py-2 text-right">{log.total_calories} Kcal</td>
                                                <td className="px-4 py-2 text-right">
                                                    {new Date(log.created_at).toLocaleTimeString('th-TH')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default FoodHistory;
