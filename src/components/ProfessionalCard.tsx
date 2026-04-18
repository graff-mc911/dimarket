import { Star, MapPin, MessageCircle } from 'lucide-react'
import { Profile } from '../lib/types'

interface ProfessionalCardProps {
  professional: Profile
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const avatarUrl = professional.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.full_name || 'User')}&background=1e3a8a&color=fff`

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200">
      <div className="relative h-32 bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute -bottom-12 left-6">
          <img
            src={avatarUrl}
            alt={professional.full_name || 'Professional'}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {professional.full_name || 'Professional'}
        </h3>

        {professional.location && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{professional.location}</span>
          </div>
        )}

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold text-gray-900">
              {professional.rating > 0 ? professional.rating.toFixed(1) : 'New'}
            </span>
          </div>
          <span className="text-gray-500 text-sm ml-2">
            ({professional.total_reviews} reviews)
          </span>
        </div>

        {professional.bio && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {professional.bio}
          </p>
        )}

        <a
          href={`/professional/${professional.id}`}
          className="flex items-center justify-center space-x-2 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact</span>
        </a>
      </div>
    </div>
  )
}
