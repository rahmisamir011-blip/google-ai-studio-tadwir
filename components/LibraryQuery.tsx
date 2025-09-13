import React, { useState, useEffect } from 'react';
import { getLibraryInfo } from '../services/geminiService';
import type { AiResponse } from '../types';

interface LibraryQueryProps {
  setResponse: (response: AiResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialQuery?: string | null;
  onSearchComplete: () => void;
}

export const LibraryQuery: React.FC<LibraryQueryProps> = ({ setResponse, setLoading, setError, initialQuery, onSearchComplete }) => {
  const [query, setQuery] = useState('');

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return; 
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await getLibraryInfo(searchQuery);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Effect for initial query (from voice, etc.), runs search immediately
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
      onSearchComplete(); // Acknowledge that the initial search has been handled
    }
  }, [initialQuery]); // Only re-run when the initial query prop changes


  const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      // When user submits form, run search immediately with the current query value
      performSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-600">
        اسأل عن أي مادة (مثال: "قارورة بلاستيك"، "بطارية"، "ورق مقوى").
      </p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="اكتب اسم المادة هنا..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white border-gray-300 placeholder-gray-400 text-black"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-transform transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
      >
        ابحث
      </button>
    </form>
  );
};