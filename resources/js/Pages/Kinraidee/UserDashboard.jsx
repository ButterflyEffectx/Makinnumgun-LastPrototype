import React from 'react';
import { PieChart } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'ส่วนสูง', value: '170 ซม.' },
    { label: 'น้ำหนัก', value: '65 กก.' },
    { label: 'อายุ', value: '28 ปี' },
    { label: 'ค่า BMI', value: '22.5', subtext: 'น้ำหนักปกติ' }
  ];

  const nutrients = [
    { name: 'โปรตีน', percentage: 75 },
    { name: 'คาร์โบไฮเดรต', percentage: 60 },
    { name: 'ไขมัน', percentage: 45 }
  ];

  const meals = [
    {
      name: 'สลัดไก่ทอด',
      calories: 350,
      image: '/api/placeholder/400/300'
    },
    {
      name: 'ข้าวคลุกแซลมอน',
      calories: 420,
      image: '/api/placeholder/400/300'
    },
    {
      name: 'สมูทตี้ผลไม้',
      calories: 180,
      image: '/api/placeholder/400/300'
    },
    {
      name: 'โยเกิร์ตกราโนล่า',
      calories: 280,
      image: '/api/placeholder/400/300'
    }
  ];

  const CircularProgress = ({ value, total }) => {
    const percentage = (value / total) * 100;
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="70"
            className="stroke-current text-gray-200"
            strokeWidth="24"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="70"
            className="stroke-current text-green-500"
            strokeWidth="24"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl md:text-3xl font-bold">{value}</div>
          <div className="text-xs md:text-sm text-gray-500">จาก {total}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-3 md:p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2" />
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </div>
            <div className="text-lg md:text-xl font-bold">{stat.value}</div>
            {stat.subtext && (
              <div className="text-xs md:text-sm text-green-500">{stat.subtext}</div>
            )}
          </div>
        ))}
      </div>

      {/* Calories and Nutrients Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-6">
        <div className="p-4 md:p-6 bg-gray-50 rounded-lg shadow">
          <div className="text-base md:text-lg mb-4">แคลอรี่วันนี้</div>
          <div className="flex justify-center">
            <CircularProgress value={1450} total={2000} />
          </div>
        </div>
        
        <div className="p-4 md:p-6 bg-gray-50 rounded-lg shadow">
          <div className="text-base md:text-lg mb-4">สารอาหาร</div>
          <div className="space-y-4">
            {nutrients.map((nutrient, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1 text-sm md:text-base">
                  <span>{nutrient.name}</span>
                  <span>{nutrient.percentage} %</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${nutrient.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">อาหารแนะนำ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {meals.map((meal, index) => (
            <div key={index} className="rounded-lg shadow overflow-hidden bg-white">
              <img 
                src={meal.image} 
                alt={meal.name}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2">{meal.name}</h3>
                <div className="text-xs md:text-sm text-gray-600">
                  {meal.calories} แคลอรี่
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;