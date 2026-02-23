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
      sectors: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      startups: {
        Row: {
          id: string
          name: string
          description: string
          sector_id: string | null
          logo_url: string
          profit_margin: number
          funding_needed: number
          equity_offered: number
          founded_year: number
          website: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          sector_id?: string | null
          logo_url?: string
          profit_margin?: number
          funding_needed?: number
          equity_offered?: number
          founded_year?: number
          website?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          sector_id?: string | null
          logo_url?: string
          profit_margin?: number
          funding_needed?: number
          equity_offered?: number
          founded_year?: number
          website?: string
          created_at?: string
        }
      }
      investors: {
        Row: {
          id: string
          startup_id: string
          name: string
          phone: string
          email: string
          investment_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          name: string
          phone?: string
          email?: string
          investment_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          name?: string
          phone?: string
          email?: string
          investment_amount?: number | null
          created_at?: string
        }
      }
    }
  }
}

export type Sector = Database['public']['Tables']['sectors']['Row']
export type Startup = Database['public']['Tables']['startups']['Row']
export type Investor = Database['public']['Tables']['investors']['Row']

export interface StartupWithSector extends Startup {
  sector: Sector | null
}

export interface StartupWithDetails extends StartupWithSector {
  investors: Investor[]
}
