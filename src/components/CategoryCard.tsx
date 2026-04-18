import { Category } from '../lib/types'
import { useApp } from '../contexts/AppContext'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useApp()

  const categoryKey = category.slug
  const nameKey = `category.${categoryKey}` as any
  const descKey = `category.${categoryKey}Desc` as any

  return (
    <a
      href={`/listings?category=${category.slug}`}
      className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
        {category.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition">
        {t(nameKey)}
      </h3>
      <p className="text-sm text-gray-500 text-center mt-2 line-clamp-2">
        {t(descKey)}
      </p>
    </a>
  )
}
