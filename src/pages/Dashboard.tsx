import { useEffect, useState } from 'react'
import { Eye, MessageSquare, FileText, TrendingUp, CheckCircle, XCircle, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { Profile } from '../lib/types'
import { AdBanner } from '../components/AdBanner'

interface Stats {
  profileViews: number
  totalMessages: number
  activeListings: number
  totalListings: number
}

interface UserListing {
  id: string
  title: string
  status: string
  visibility_radius: string
  created_at: string
}

export function Dashboard() {
  const { user, t } = useApp()
  const [stats, setStats] = useState<Stats>({
    profileViews: 0,
    totalMessages: 0,
    activeListings: 0,
    totalListings: 0
  })
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userListings, setUserListings] = useState<UserListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    } else {
      window.location.href = '/login'
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle()

      if (profileData) {
        setProfile(profileData)
      }

      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user!.id)

      setStats(prev => ({ ...prev, totalMessages: messagesCount || 0 }))

      const { data: listingsData } = await supabase
        .from('listings')
        .select('id, title, status, visibility_radius, created_at')
        .eq('author_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (listingsData) {
        setUserListings(listingsData as UserListing[])
        const active = listingsData.filter(l => l.status === 'active').length
        setStats(prev => ({
          ...prev,
          activeListings: active,
          totalListings: listingsData.length
        }))
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const getVisibilityLabel = (radius: string) => {
    const labels: Record<string, string> = {
      city: t('visibility.city') || 'Місто',
      district: t('visibility.district') || 'Район',
      region: t('visibility.region') || 'Область',
      country: t('visibility.country') || 'Країна',
      state: t('visibility.state') || 'Штат',
      land: t('visibility.land') || 'Земля (DE)',
      global: t('visibility.global') || 'Всі користувачі',
    }
    return labels[radius] || radius
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-1/5">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="flex-1 lg:w-3/5">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Professional Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {profile?.full_name || 'Professional'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.profileViews}</h3>
                <p className="text-gray-600 text-sm">Profile Views</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalMessages}</h3>
                <p className="text-gray-600 text-sm">Messages</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeListings}</h3>
                <p className="text-gray-600 text-sm">Active Listings</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalListings}</h3>
                <p className="text-gray-600 text-sm">Total Listings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <a
                    href="/settings"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Edit Profile</div>
                      <div className="text-sm text-gray-600">Update your information and portfolio</div>
                    </div>
                  </a>

                  <a
                    href="/create-ad"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Create New Ad</div>
                      <div className="text-sm text-gray-600">Post a new listing or service</div>
                    </div>
                  </a>

                  <a
                    href="/messages"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg mr-4">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">View Messages</div>
                      <div className="text-sm text-gray-600">Check your conversations</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Listings</h2>
                {userListings.length > 0 ? (
                  <div className="space-y-3">
                    {userListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {listing.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              listing.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {listing.status}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Globe className="w-3 h-3 mr-1" />
                          <span>{getVisibilityLabel(listing.visibility_radius)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No listings yet</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Completion</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Profile strength</span>
                      <span className="font-semibold text-gray-900">
                        {profile?.profile_photo && profile?.bio && profile?.phone ? '80%' : '40%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${profile?.profile_photo && profile?.bio && profile?.phone ? 80 : 40}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm">
                      {profile?.profile_photo ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className={profile?.profile_photo ? 'text-gray-900' : 'text-gray-500'}>
                        Profile photo added
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      {profile?.bio ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className={profile?.bio ? 'text-gray-900' : 'text-gray-500'}>
                        Bio written
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      {profile?.phone ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className={profile?.phone ? 'text-gray-900' : 'text-gray-500'}>
                        Phone number added
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-500">
                        Portfolio images uploaded
                      </span>
                    </div>
                  </div>

                  <a
                    href="/settings"
                    className="btn-secondary block text-center mt-4"
                  >
                    Complete Your Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-1/5">
            <AdBanner position="right" sticky={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
