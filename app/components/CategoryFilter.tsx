// app/components/CategoryFilter.tsx
"use client";

import { CATEGORIES } from '../data/products';
import { Button } from './ui/Button';

interface CategoryFilterProps {
  selectedCategory: number;
  onSelectCategory: (categoryId: number) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <p className="text-slate-700 font-semibold mb-4">Categories</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            className={selectedCategory === category.id ? 'shrink-0' : 'shrink-0'}
            aria-pressed={selectedCategory === category.id}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
