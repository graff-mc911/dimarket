import { useEffect, useState } from 'react'
import { User, Phone, MapPin, Briefcase, Image, Bell, Globe, DollarSign, Lock, Trash2, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { AdBanner } from '../components/AdBanner'

export function Settings() {
  const { user } = useApp()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [portfolioImages, setPortfolioImages] = useState<string[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [preferredCurrency, setPreferredCurrency] = useState('USD')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      window.location.href = '/login'
    }
  }, [user])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setPhone(data.phone || '')
        setLocation(data.location || '')
        setWebsite(data.website || '')
        setProfilePhoto(data.profile_photo || '')
        setPortfolioImages(data.portfolio_images || [])
        setNotificationsEnabled(data.notifications_enabled !== false)
        setPreferredLanguage(data.preferred_language || 'en')
        setPreferredCurrency(data.preferred_currency || 'USD')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio,
          phone,
          location,
          website,
          profile_photo: profilePhoto,
          portfolio_images: portfolioImages,
          notifications_enabled: notificationsEnabled,
          preferred_language: preferredLanguage,
          preferred_currency: preferredCurrency
        })
        .eq('id', user!.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage('Password changed successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error changing password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user!.id)
      if (error) throw error

      window.location.href = '/'
    } catch (error) {
      setMessage('Error deleting account')
    }
  }

  const addPortfolioImage = () => {
    setPortfolioImages([...portfolioImages, ''])
  }

  const updatePortfolioImage = (index: number, value: string) => {
    const newImages = [...portfolioImages]
    newImages[index] = value
    setPortfolioImages(newImages)
  }

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
            </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') || message.includes('not match')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / Description
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell clients about your experience and services..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{bio.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/photo.jpg"
                />
                {profilePhoto && (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="mt-2 w-24 h-24 object-cover rounded-full"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center mb-4">
                <Image className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Images</h3>
              </div>

              <div className="space-y-3">
                {portfolioImages.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updatePortfolioImage(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/work-image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removePortfolioImage(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPortfolioImage}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Portfolio Image
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Language & Currency</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="uk">Українська</option>
                    <option value="pl">Polski</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Preferred Currency
                  </label>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="PLN">PLN (zł)</option>
                    <option value="UAH">UAH (₴)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Enable Notifications</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Receive updates about messages and leads</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <form onSubmit={handleChangePassword} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!newPassword || !confirmPassword}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Password
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-200">
            <div className="flex items-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
            </div>

            <p className="text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="relative overflow-hidden px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] border border-red-500/20"
            >
              Delete Account
            </button>
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
