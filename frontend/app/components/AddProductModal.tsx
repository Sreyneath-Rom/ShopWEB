// app/components/AddProductModal.tsx
"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ErrorMessage } from './ui/ErrorMessage';
import { CATEGORIES, PRODUCT_COLORS } from '../data/products';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: {
    name: string;
    price: number;
    categoryId: number;
    description?: string;
    image: string;
    rating?: number;
    inStock?: boolean;
  }) => void;
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '2',
    description: '',
    image: '',
    inStock: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      description: formData.description,
      image: formData.image,
      rating: 4.5,
      inStock: formData.inStock,
    });

    setFormData({
      name: '',
      price: '',
      categoryId: '2',
      description: '',
      image: '',
      inStock: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              aria-invalid={!!errors.name}
            />
            <ErrorMessage message={errors.name} />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, price: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              aria-invalid={!!errors.price}
            />
            <ErrorMessage message={errors.price} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.filter(c => c.id !== 1).map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, image: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://images.unsplash.com/..."
              aria-invalid={!!errors.image}
            />
            <ErrorMessage message={errors.image} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product description"
              rows={3}
            />
          </div>

          {/* In Stock */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, inStock: e.target.checked }))
                }
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">In Stock</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Add Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
