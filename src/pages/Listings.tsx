import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
// Імпортуємо функцію та типи саме з нашого i18n.ts
import { getTranslation } from '../lib/Translations/i18n';
import type { TranslationKey } from '../lib/Translations/i18n';
import { Search, Loader2, MapPin } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location?: string;
}

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filtered = listings.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {getTranslation('listings_title' as TranslationKey) || 'Оголошення'}
        </h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={getTranslation('search_placeholder' as TranslationKey) || 'Пошук...'}
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-100">
                {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <span className="text-blue-600 font-bold">{item.price} ₴</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location || 'Україна'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;