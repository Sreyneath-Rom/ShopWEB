// frontend/src/components/pages/admin/AdminProductPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    colors: '',
    inStock: true,
    rating: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    api.get('/auth/me')
      .then((res) => {
        if (res.data.role !== 'admin') {
          toast.error('Not authorized');
          router.push('/admin/login');
        } else {
          fetchProducts();
        }
      })
      .catch(() => {
        toast.error('Please login');
        router.push('/admin/login');
      });
  };

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then((res) => {
        const normalized = res.data.map((p: Product) => ({
          ...p,
          category: typeof p.category === 'object' && p.category !== null && 'name' in p.category
            ? (p.category as { name: string }).name
            : typeof p.category === 'string' ? p.category : undefined,
        }));
        setProducts(normalized);
      })
      .catch(() => toast.error('Failed to fetch products'))
      .finally(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const data = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating) || undefined,
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
    };

    const promise = editingProduct
      ? api.put(`/products/${editingProduct.id}`, data)
      : api.post('/products', data);

    promise
      .then(() => {
        toast.success(editingProduct ? 'Product updated' : 'Product added');
        fetchProducts();
        setEditingProduct(null);
        setFormData({
          name: '',
          price: '',
          description: '',
          imageUrl: '',
          category: '',
          colors: '',
          inStock: true,
          rating: '',
        });
      })
      .catch(() => toast.error('Operation failed'))
      .finally(() => setFormLoading(false));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      colors: product.colors?.join(', ') || '',
      inStock: product.inStock ?? true,
      rating: product.rating?.toString() || '',
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure?')) return;
    api.delete(`/products/${id}`)
      .then(() => {
        toast.success('Product deleted');
        fetchProducts();
      })
      .catch(() => toast.error('Delete failed'));
  };

  if (loading) return <Skeleton className="h-screen" />;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Product Management</h1>

      <Card className="p-6 mb-8 rounded-3xl">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
          <Input label="Description" name="description" value={formData.description} onChange={handleChange} />
          <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
          <Input label="Colors (comma-separated)" name="colors" value={formData.colors} onChange={handleChange} />
          <Input label="Rating (optional)" name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} />
          <div className="md:col-span-2">
            <Button loading={formLoading} className="w-full">{editingProduct ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(product)} variant="outline">Edit</Button>
              <Button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-gray-500 mt-8">No products found.</p>}
    </div>
  );
}