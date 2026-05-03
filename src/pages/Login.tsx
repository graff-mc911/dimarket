import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase'; // Переконайтеся, що шлях до клієнта supabase вірний
import { Camera, Loader2, MapPin, Tag } from 'lucide-react';

const CreateListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Стан для форми
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('other');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Обробка вибору зображень
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      // Створюємо тимчасові посилання для попереднього перегляду
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Функція завантаження зображень у Supabase Storage
  const uploadImages = async (listingId: string) => {
    const uploadedUrls = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${listingId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }
    }
    return uploadedUrls;
  };

  // Основна функція відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Отримуємо поточного користувача
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Користувач не авторизований');

      // 2. Створюємо запис у таблиці listings
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            price: parseFloat(price),
            category,
            status: 'active'
          }
        ])
        .select()
        .single();

      if (listingError) throw listingError;

      // 3. Завантажуємо фото, якщо вони є
      if (images.length > 0) {
        const imageUrls = await uploadImages(listing.id);
        // Оновлюємо запис посиланням на перше фото (як головне) або масивом
        await supabase
          .from('listings')
          .update({ images: imageUrls })
          .eq('id', listing.id);
      }

      alert('Оголошення успішно створено!');
      navigate('/listings'); // Повертаємось до списку
    } catch (error: any) {
      alert(error.message || 'Сталася помилка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('create_new_listing')}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Завантаження фото */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Фотографії</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previews.map((src, index) => (
              <img key={index} src={src} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
            ))}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <Camera className="text-gray-400" />
              <span className="text-xs text-gray-500 mt-2">Додати фото</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* Назва */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Назва оголошення</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Наприклад: Продам велосипед"
          />
        </div>

        {/* Категорія та Ціна */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Категорія</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="electronics">Електроніка</option>
              <option value="transport">Транспорт</option>
              <option value="realty">Нерухомість</option>
              <option value="services">Послуги</option>
              <option value="other">Інше</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ціна (₴)</label>
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Опис */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Опис</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="Опишіть ваш товар детально..."
          />
        </div>

        {/* Кнопка відправки */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Створення...
            </>
          ) : (
            'Опублікувати оголошення'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;