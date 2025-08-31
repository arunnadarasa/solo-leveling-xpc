export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      custom_recipes: {
        Row: {
          ai_evaluation: Json | null
          created_at: string
          id: string
          ingredients: string[]
          is_on_menu: boolean
          name: string
          price: number
          restaurant_id: string | null
          updated_at: string
        }
        Insert: {
          ai_evaluation?: Json | null
          created_at?: string
          id?: string
          ingredients: string[]
          is_on_menu?: boolean
          name: string
          price?: number
          restaurant_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_evaluation?: Json | null
          created_at?: string
          id?: string
          ingredients?: string[]
          is_on_menu?: boolean
          name?: string
          price?: number
          restaurant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_recipes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          challenge_description: string
          challenge_type: string
          created_at: string | null
          id: string
          reward_description: string
          target_value: number
        }
        Insert: {
          challenge_date?: string
          challenge_description: string
          challenge_type: string
          created_at?: string | null
          id?: string
          reward_description: string
          target_value: number
        }
        Update: {
          challenge_date?: string
          challenge_description?: string
          challenge_type?: string
          created_at?: string | null
          id?: string
          reward_description?: string
          target_value?: number
        }
        Relationships: []
      }
      daily_performance: {
        Row: {
          created_at: string
          customer_feedback: Json | null
          customers_served: number
          day_number: number
          expenses: number
          id: string
          reputation_change: number
          restaurant_id: string | null
          revenue: number
        }
        Insert: {
          created_at?: string
          customer_feedback?: Json | null
          customers_served?: number
          day_number: number
          expenses?: number
          id?: string
          reputation_change?: number
          restaurant_id?: string | null
          revenue?: number
        }
        Update: {
          created_at?: string
          customer_feedback?: Json | null
          customers_served?: number
          day_number?: number
          expenses?: number
          id?: string
          reputation_change?: number
          restaurant_id?: string | null
          revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_performance_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completion_time: string | null
          customer_feedback: string | null
          customer_profile: Json | null
          customer_rating: number | null
          id: string
          order_time: string
          recipe_id: string | null
          restaurant_id: string | null
        }
        Insert: {
          completion_time?: string | null
          customer_feedback?: string | null
          customer_profile?: Json | null
          customer_rating?: number | null
          id?: string
          order_time?: string
          recipe_id?: string | null
          restaurant_id?: string | null
        }
        Update: {
          completion_time?: string | null
          customer_feedback?: string | null
          customer_profile?: Json | null
          customer_rating?: number | null
          id?: string
          order_time?: string
          recipe_id?: string | null
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "custom_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      player_achievements: {
        Row: {
          achievement_description: string
          achievement_id: string
          achievement_name: string
          id: string
          player_id: string
          unlocked_at: string | null
        }
        Insert: {
          achievement_description: string
          achievement_id: string
          achievement_name: string
          id?: string
          player_id: string
          unlocked_at?: string | null
        }
        Update: {
          achievement_description?: string
          achievement_id?: string
          achievement_name?: string
          id?: string
          player_id?: string
          unlocked_at?: string | null
        }
        Relationships: []
      }
      public_scores: {
        Row: {
          created_at: string | null
          elements_discovered: number
          enemies_defeated: number
          highest_fusion_tier: number
          id: string
          level: number
          play_time_minutes: number
          player_id: string
          player_name: string
          total_damage: number
          updated_at: string | null
          weapon_elements: string[] | null
          weapon_name: string | null
        }
        Insert: {
          created_at?: string | null
          elements_discovered?: number
          enemies_defeated?: number
          highest_fusion_tier?: number
          id?: string
          level?: number
          play_time_minutes?: number
          player_id: string
          player_name: string
          total_damage?: number
          updated_at?: string | null
          weapon_elements?: string[] | null
          weapon_name?: string | null
        }
        Update: {
          created_at?: string | null
          elements_discovered?: number
          enemies_defeated?: number
          highest_fusion_tier?: number
          id?: string
          level?: number
          play_time_minutes?: number
          player_id?: string
          player_name?: string
          total_damage?: number
          updated_at?: string | null
          weapon_elements?: string[] | null
          weapon_name?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          created_at: string
          id: string
          money: number
          name: string
          reputation: number
          seating_capacity: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          money?: number
          name?: string
          reputation?: number
          seating_capacity?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          money?: number
          name?: string
          reputation?: number
          seating_capacity?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          daily_wage: number
          hire_cost: number
          id: string
          name: string
          quality_stat: number
          restaurant_id: string | null
          speed_stat: number
          staff_type: string
        }
        Insert: {
          created_at?: string
          daily_wage?: number
          hire_cost?: number
          id?: string
          name: string
          quality_stat?: number
          restaurant_id?: string | null
          speed_stat?: number
          staff_type: string
        }
        Update: {
          created_at?: string
          daily_wage?: number
          hire_cost?: number
          id?: string
          name?: string
          quality_stat?: number
          restaurant_id?: string | null
          speed_stat?: number
          staff_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
