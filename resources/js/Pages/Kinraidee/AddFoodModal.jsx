import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const AddFoodModal = ({ isOpen, onClose, catagorys }) => {
    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState(null);

    console.log({ catagorys })

    const { data, setData, post, errors } = useForm({
        name: '',
        category_id: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        serving_size: '',
        image: null
    });


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        console.log(data.name, data.category_id, data.calories, data.protein, data.carbs, data.fats, data.serving_size, data.image)
        e.preventDefault();
        post('/management', {
            onSuccess: () => {
                onClose();
                setPreview(null);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 p-6 md:p-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add New Food</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block mb-2">Food Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Category</label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="">Select Category</option>
                                    {catagorys.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <span className="text-red-500 text-sm">{errors.category_id}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Serving Size</label>
                                <input
                                    type="text"
                                    value={data.serving_size}
                                    onChange={e => setData('serving_size', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                    placeholder="e.g., 100g"
                                />
                                {errors.serving_size && (
                                    <span className="text-red-500 text-sm">{errors.serving_size}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Calories</label>
                                <input
                                    type="number"
                                    value={data.calories}
                                    onChange={e => setData('calories', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                />
                                {errors.calories && (
                                    <span className="text-red-500 text-sm">{errors.calories}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Protein (g)</label>
                                <input
                                    type="number"
                                    value={data.protein}
                                    onChange={e => setData('protein', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                />
                                {errors.protein && (
                                    <span className="text-red-500 text-sm">{errors.protein}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Carbs (g)</label>
                                <input
                                    type="number"
                                    value={data.carbs}
                                    onChange={e => setData('carbs', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                />
                                {errors.carbs && (
                                    <span className="text-red-500 text-sm">{errors.carbs}</span>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2">Fats (g)</label>
                                <input
                                    type="number"
                                    value={data.fats}
                                    onChange={e => setData('fats', e.target.value)}
                                    className="w-full border rounded-md p-2"
                                />
                                {errors.fats && (
                                    <span className="text-red-500 text-sm">{errors.fats}</span>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block mb-2">Food Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full border rounded-md p-2"
                                    accept="image/*"
                                />
                                {errors.image && (
                                    <span className="text-red-500 text-sm">{errors.image}</span>
                                )}
                                {preview && (
                                    <div className="mt-2">
                                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                                Add Food
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddFoodModal;
