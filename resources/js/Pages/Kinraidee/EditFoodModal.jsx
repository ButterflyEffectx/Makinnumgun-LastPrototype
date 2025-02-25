import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const EditFoodModal = ({ isOpen, onClose, food, categories }) => {
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        serving_size: '',
        image: null
    });

    useEffect(() => {
        if (food && isOpen) {
            setFormData({
                name: food.name,
                category_id: food.catagory_id,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats,
                serving_size: food.serving_size,
                image: null
            });
            if (food.image) {
                setPreview(food.image);
            }
        }
    }, [food, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        console.log('click')
        e.preventDefault();
        setErrors({});

        const submitData = new FormData();
        submitData.append('_method', 'PATCH');

        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                submitData.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(`/management/${food.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                onClose();
                window.location.reload();
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 p-6 md:p-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Food</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block mb-2">Food Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">{errors.name}</span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
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
                                name='serving_size'
                                value={formData.serving_size}
                                onChange={handleChange}
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
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
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
                                name="protein"
                                value={formData.protein}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                step="0.01"
                            />
                            {errors.protein && (
                                <span className="text-red-500 text-sm">{errors.protein}</span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2">Carbs (g)</label>
                            <input
                                type="number"
                                name="carbs"
                                value={formData.carbs}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                step="0.01"
                            />
                            {errors.carbs && (
                                <span className="text-red-500 text-sm">{errors.carbs}</span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2">Fats (g)</label>
                            <input
                                type="number"
                                name="fats"
                                value={formData.fats}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2"
                                step="0.01"
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
                            Update Food
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFoodModal;
