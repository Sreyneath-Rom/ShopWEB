// app/hooks/useFavorites.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getFavorites, setFavorites } from '../utils/storage';

export const useFavorites = () => {
  const [favorites, setLocalFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getFavorites();
    setLocalFavorites(stored);
    setIsLoaded(true);
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setLocalFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      setFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const addFavorite = useCallback((productId: number) => {
    setLocalFavorites(prev => {
      if (!prev.includes(productId)) {
        const newFavorites = [...prev, productId];
        setFavorites(newFavorites);
        return newFavorites;
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((productId: number) => {
    setLocalFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      setFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((productId: number) => {
    return favorites.includes(productId);
  }, [favorites]);

  return {
    favorites,
    isLoaded,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};
