import { useEffect, useState, type ReactNode } from 'react'
import { ClipboardList, Heart, UserRound } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { ListingWithImages, Profile } from '../lib/types'
import { ListingCard } from '../components/ListingCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { navigateTo } from '../lib/navigation'

export function Favorites() {
  const { user, t } = useApp()

  const [activeTab, setActiveTab] = useState<'listings' | 'professionals'>('listings')
  const [favoriteListings, setFavoriteListings] = useState<ListingWithImages[]>([])
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    void loadFavorites()
  }, [user])

  const loadFavorites = async () => {
    setLoading(true)

    try {
      const [listingsResult, professionalsResult] = await Promise.all([
        supabase
          .from('favorite_listings')
          .select(`
            listing:listings(
              *,
              images:listing_images(*),
              category:categories(*)
            )
          `)
          .eq('user_id', user?.id),

        supabase
          .from('favorite_professionals')
          .select(`
            professional:profiles(*)
          `)
          .eq('user_id', user?.id),
      ])

      const listings = (listingsResult.data || [])
        .map((item: any) => item.listing)
        .filter(Boolean) as ListingWithImages[]

      const professionals = (professionalsResult.data || [])
        .map((item: any) => item.professional)
        .filter(Boolean) as Profile[]

      setFavoriteListings(listings)
      setFavoriteProfessionals(professionals)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="page-bg min-h-screen py-10">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="glass-panel p-8 text-center md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(242,171,116,0.18)] text-[#9a5525]">
                <Heart className="h-8 w-8" />
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
                {t('favorites.loginTitle')}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
                {t('favorites.loginText')}
              </p>

              <button
                onClick={() => navigateTo('/login')}
                type="button"
                className="btn-primary mt-7 rounded-full"
              >
                {t('favorites.loginButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg min-h-screen py-10">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto max-w-7xl">
          <section className="glass-panel p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
                  <Heart className="h-4 w-4" />
                  <span>{t('favorites.title')}</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
                  {t('favorites.title')}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#6f665d] md:text-base">
                  {t('favorites.description')}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-2 rounded-[24px] border border-white/70 bg-white/45 p-2 sm:inline-flex sm:flex-wrap">
              <button
                onClick={() => setActiveTab('listings')}
                type="button"
                className={`inline-flex w-full items-center justify-between gap-2 rounded-full px-5 py-3 text-sm font-semibold transition sm:w-auto sm:justify-start ${
                  activeTab === 'listings'
                    ? 'bg-[rgba(242,171,116,0.18)] text-[#9a5525]'
                    : 'text-[#5f5a54] hover:bg-white/75'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                <span>{t('favorites.listingsTab')}</span>
                <span>({favoriteListings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('professionals')}
                type="button"
                className={`inline-flex w-full items-center justify-between gap-2 rounded-full px-5 py-3 text-sm font-semibold transition sm:w-auto sm:justify-start ${
                  activeTab === 'professionals'
                    ? 'bg-[rgba(242,171,116,0.18)] text-[#9a5525]'
                    : 'text-[#5f5a54] hover:bg-white/75'
                }`}
              >
                <UserRound className="h-4 w-4" />
                <span>{t('favorites.professionalsTab')}</span>
                <span>({favoriteProfessionals.length})</span>
              </button>
            </div>
          </section>

          <div className="mt-8">
            {loading ? (
              <div className="glass-card p-8 text-center text-[#7a7168]">
                {t('favorites.loading')}
              </div>
            ) : activeTab === 'listings' ? (
              favoriteListings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {favoriteListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ClipboardList className="h-8 w-8" />}
                  title={t('favorites.emptyListingsTitle')}
                  text={t('favorites.emptyListingsText')}
                  buttonLabel={t('favorites.emptyListingsButton')}
                  onClick={() => navigateTo('/listings')}
                />
              )
            ) : favoriteProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {favoriteProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<UserRound className="h-8 w-8" />}
                title={t('favorites.emptyProfessionalsTitle')}
                text={t('favorites.emptyProfessionalsText')}
                buttonLabel={t('favorites.emptyProfessionalsButton')}
                onClick={() => navigateTo('/professionals')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  text,
  buttonLabel,
  onClick,
}: {
  icon: ReactNode
  title: string
  text: string
  buttonLabel: string
  onClick: () => void
}) {
  return (
    <div className="glass-card p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(242,171,116,0.18)] text-[#9a5525]">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#2f2a24]">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f665d]">{text}</p>

      <button
        onClick={onClick}
        type="button"
        className="btn-secondary mt-6 rounded-full"
      >
        {buttonLabel}
      </button>
    </div>
  )
}
