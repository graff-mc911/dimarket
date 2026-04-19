export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          icon: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          icon?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          icon?: string | null
          description?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          bio: string | null
          phone: string | null
          location: string | null
          avatar_url: string | null
          profile_photo: string | null
          website: string | null
          is_professional: boolean
          rating: number
          total_reviews: number
          created_at: string
          updated_at: string
          profile_views?: number | null
        }
        Insert: {
          id: string
          full_name?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          profile_photo?: string | null
          website?: string | null
          is_professional?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
          profile_views?: number | null
        }
        Update: {
          id?: string
          full_name?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
          avatar_url?: string | null
          profile_photo?: string | null
          website?: string | null
          is_professional?: boolean
          rating?: number
          total_reviews?: number
          created_at?: string
          updated_at?: string
          profile_views?: number | null
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          listing_type: 'service_request' | 'service_offer' | 'item_sale' | 'item_wanted'
          price: number | null
          currency: string
          location: string
          contact_name: string
          contact_phone: string | null
          contact_email: string | null
          author_id: string | null
          duration_days: number
          expires_at: string
          is_premium: boolean
          views_count: number
          status: 'active' | 'expired' | 'sold' | 'deleted'
          created_at: string
          updated_at: string
          visibility_radius?: 'city' | 'district' | 'region' | 'country' | 'state' | 'land' | 'global' | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          listing_type: 'service_request' | 'service_offer' | 'item_sale' | 'item_wanted'
          price?: number | null
          currency?: string
          location: string
          contact_name: string
          contact_phone?: string | null
          contact_email?: string | null
          author_id?: string | null
          duration_days?: number
          expires_at: string
          is_premium?: boolean
          views_count?: number
          status?: 'active' | 'expired' | 'sold' | 'deleted'
          created_at?: string
          updated_at?: string
          visibility_radius?: 'city' | 'district' | 'region' | 'country' | 'state' | 'land' | 'global' | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          listing_type?: 'service_request' | 'service_offer' | 'item_sale' | 'item_wanted'
          price?: number | null
          currency?: string
          location?: string
          contact_name?: string
          contact_phone?: string | null
          contact_email?: string | null
          author_id?: string | null
          duration_days?: number
          expires_at?: string
          is_premium?: boolean
          views_count?: number
          status?: 'active' | 'expired' | 'sold' | 'deleted'
          created_at?: string
          updated_at?: string
          visibility_radius?: 'city' | 'district' | 'region' | 'country' | 'state' | 'land' | 'global' | null
        }
      }
      listing_images: {
        Row: {
          id: string
          listing_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          image_url?: string
          display_order?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          professional_id: string
          reviewer_name: string
          reviewer_email: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          reviewer_name: string
          reviewer_email?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          professional_id?: string
          reviewer_name?: string
          reviewer_email?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string | null
          sender_name: string | null
          sender_email: string | null
          recipient_id: string
          listing_id: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id?: string | null
          sender_name?: string | null
          sender_email?: string | null
          recipient_id: string
          listing_id?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string | null
          sender_name?: string | null
          sender_email?: string | null
          recipient_id?: string
          listing_id?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      professional_categories: {
        Row: {
          id: string
          profile_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          category_id?: string
          created_at?: string
        }
      }
      app_site_stats: {
        Row: {
          id: number
          total_visits: number
          total_listings_created: number
          total_successful_listings: number
          total_professionals: number
          country_ranking: Json
          updated_at: string
        }
        Insert: {
          id?: number
          total_visits?: number
          total_listings_created?: number
          total_successful_listings?: number
          total_professionals?: number
          country_ranking?: Json
          updated_at?: string
        }
        Update: {
          id?: number
          total_visits?: number
          total_listings_created?: number
          total_successful_listings?: number
          total_professionals?: number
          country_ranking?: Json
          updated_at?: string
        }
      }
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type ListingImage = Database['public']['Tables']['listing_images']['Row']
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type AppSiteStats = Database['public']['Tables']['app_site_stats']['Row']

export interface ListingWithImages extends Listing {
  images: ListingImage[]
  category?: Category
}

export interface ProfileWithPortfolio extends Profile {
  portfolio_items: PortfolioItem[]
}

export interface CountryRankingItem {
  country: string
  score: number
  professionals: number
  listings: number
  responses: number
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
] as const

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'pl', name: 'Polski' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'cs', name: 'Čeština' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'hu', name: 'Magyar' },
  { code: 'bg', name: 'Български' },
  { code: 'sr', name: 'Српски' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'et', name: 'Eesti' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
] as const