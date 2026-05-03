import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Перевірте, чи шлях до вашого клієнта supabase вірний
import { getTranslation } from '../lib/Translations/i18n'; // Імпорт вашої функції перекладу
import type { TranslationKey } from '../lib/Translations/i18n'; // Імпорт типу ключів
import { Search, Filter, Loader2, MapPin } from 'lucide-react';

// Визначаємо інтерфейс для оголошення (адаптуйте під вашу БД)
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  location?: string;
  created_at: string;
}

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Функція для завантаження даних із Supabase
  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      console.error('Помилка завантаження:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Фільтрація за пошуковим запитом
  const filteredListings = listings.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок та Пошук */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getTranslation('listings_title' as TranslationKey) || 'Оголошення'}
        </h1>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={getTranslation('search_placeholder' as TranslationKey) || 'Пошук товарів...'}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Стан завантаження */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Сітка товарів */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  {/* Зображення */}
                  <div className="aspect-square bg-gray-100 relative">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Немає фото
                      </div>
                    )}
                  </div>

                  {/* Контент картки */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 truncate flex-1">{item.title}</h3>
                      <span className="text-blue-600 font-bold ml-2">
                        {item.price} ₴
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                      {item.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-400 mt-auto">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location || getTranslation('unknown_location' as TranslationKey) || 'Місце не вказано'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {getTranslation('no_listings_found' as TranslationKey) || 'Нічого не знайдено'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Listings;