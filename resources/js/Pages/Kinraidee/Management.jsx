import React, { useState, useMemo } from 'react';
import AlertIcon from './Icons/FRAME.png';
import { Filter, PenLine, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import AddFoodModal from './AddFoodModal';
import EditFoodModal from './EditFoodModal';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Nav from '@/Components/Nav';

const DashboardCard = ({ title, value, percentage, description, color }) => {
    return (
        <div className="p-4 border rounded-xl shadow-md bg-white">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-2 mt-2">
                <span
                    className={`px-2 py-1 text-sm font-medium rounded-full text-white ${color}`}
                >
                    {percentage}
                </span>
                <span className="text-gray-500">{description}</span>
            </div>
        </div>
    );
};

// Shared Components
const Button = React.forwardRef(({
    className = '',
    variant = 'default',
    size = 'default',
    children,
    disabled = false,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        active: 'bg-orange-500 text-white hover:bg-orange-600',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});

const Card = React.forwardRef(({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
));

const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-4 sm:p-6 ${className}`} {...props} />
));

const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-4 sm:p-6 pt-0 ${className}`} {...props} />
));

// User Analytics Component
const UserAnalytics = ({ users, totalUsers, totalFoods, avgCalories  }) => {
    const [timeframe, setTimeframe] = useState('7days');

    const formatDate = (year, month, day) => {
        // สร้างฟังก์ชันสำหรับจัดรูปแบบวันที่
        const date = new Date(year, month - 1, day);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    const processUserData = (rawData, period) => {
        const now = new Date();
        let startDate;

        switch (period) {
            case '7days':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case '30days':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case '3months':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        const filteredData = rawData.filter(entry => {
            const entryDate = new Date(entry.year, entry.month - 1, entry.day);
            return entryDate >= startDate;
        });

        return filteredData.map(entry => ({
            date: `${entry.year}-${entry.month}-${entry.day}`,
            displayDate: formatDate(entry.year, entry.month, entry.day),
            weekday: entry.weekday,
            total: entry.total
        })).sort((a, b) => new Date(a.date) - new Date(b.date)); // เรียงลำดับตามวันที่
    };

    const chartData = useMemo(() => processUserData(users, timeframe), [users, timeframe]);

    const data = [
        {
            title: 'ALL USERS',
            value: totalUsers,
            percentage: '+11%',
            description: 'New users',
            color: 'bg-purple-600',
        },
        {
            title: 'ALL FOODS',
            value: totalFoods,
            percentage: '+05%',
            description: 'New foods',
            color: 'bg-cyan-500',
        },
        {
            title: 'AVG CALORIES',
            value: avgCalories,
            percentage: '+11%',
            description: 'From previous period',
            color: 'bg-yellow-500',
        },
        {
            title: 'THE BEST PICK',
            value: '$45,300',
            percentage: '+21%',
            description: 'From previous period',
            color: 'bg-green-500',
        },
    ];

    return (
        <Card className="mb-8">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    <DashboardCard key={index} {...item} />
                ))}
            </div>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-lg font-semibold">User Sign-ups Overview</h2>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={timeframe === '7days' ? 'active' : 'outline'}
                            size="sm"
                            onClick={() => setTimeframe('7days')}
                        >
                            7 days
                        </Button>
                        <Button
                            variant={timeframe === '30days' ? 'active' : 'outline'}
                            size="sm"
                            onClick={() => setTimeframe('30days')}
                        >
                            30 days
                        </Button>
                        <Button
                            variant={timeframe === '3months' ? 'active' : 'outline'}
                            size="sm"
                            onClick={() => setTimeframe('3months')}
                        >
                            3 months
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#ff4500"
                                strokeWidth={2}
                                dot={true}
                                name="Users"
                            />
                            <XAxis
                                dataKey="displayDate"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                labelFormatter={(value) => `Day: ${value}`}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Management Component
const Management = ({ Foods, catagorys, currentPage, lastPage, users, totalUsers, totalFoods, avgCalories }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const handleAddFood = () => {
        window.location.reload();
    };

    const handleEditFood = () => {
        window.location.reload();
    };

    const editFood = (food) => {
        setSelectedFood(food);
        setIsEditModalOpen(true);
    };

    return (
        <>
            {/* Header */}
            <Nav/>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <UserAnalytics users={users}
                totalUsers={totalUsers}
                totalFoods={totalFoods}
                avgCalories={avgCalories} />

                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <h2 className="text-lg font-semibold">Food Management</h2>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-1" />
                                    Filter
                                </Button>
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    + Add New Food
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Food</th>
                                            <th className="text-left py-3 px-4">Calories</th>
                                            <th className="text-left py-3 px-4 hidden sm:table-cell">Protein (g)</th>
                                            <th className="text-left py-3 px-4 hidden sm:table-cell">Fats (g)</th>
                                            <th className="text-left py-3 px-4 hidden sm:table-cell">Carbs (g)</th>
                                            <th className="text-left py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Foods.data.map((food) => (
                                            <tr key={food.id} className="border-b">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={food.image}
                                                            alt={food.name}
                                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-3"
                                                        />
                                                        <span className="text-sm sm:text-base">{food.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm sm:text-base">{food.calories}</td>
                                                <td className="py-3 px-4 hidden sm:table-cell">{food.protein}</td>
                                                <td className="py-3 px-4 hidden sm:table-cell">{food.fats}</td>
                                                <td className="py-3 px-4 hidden sm:table-cell">{food.carbs}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => editFood(food)} className="p-1 hover:bg-green-300 rounded">
                                                            <PenLine className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => Inertia.delete(`/management/${food.id}`)} className="p-1 hover:bg-red-300 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-between sm:justify-end items-center space-y-4 sm:space-y-0">
                            <p className="text-sm text-gray-600 px-0 md:px-3">
                                Page: {currentPage} of {lastPage}
                            </p>
                            <div className="flex space-x-2">
                                {currentPage > 1 && (
                                    <Link
                                        href={`?page=${currentPage - 1}`}
                                        preserveScroll
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {currentPage < lastPage && (
                                    <Link
                                        href={`?page=${currentPage + 1}`}
                                        preserveScroll
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <AddFoodModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddFood}
                    catagorys={catagorys}
                />
                <EditFoodModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditFood}
                    categories={catagorys}
                    food={selectedFood}
                />
            </div>
        </>
    )
}

export default Management
