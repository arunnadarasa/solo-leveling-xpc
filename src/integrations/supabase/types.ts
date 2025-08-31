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
      care_team_actions: {
        Row: {
          action_description: string
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          patient_id: string
          priority: string
          role: string
          status: string | null
          updated_at: string
        }
        Insert: {
          action_description: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          priority: string
          role: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          action_description?: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          priority?: string
          role?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_team_actions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          patient_id: string
          recommended_action: string | null
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          patient_id: string
          recommended_action?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          patient_id?: string
          recommended_action?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
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
      healthcare_providers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          license_number: string | null
          provider_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          license_number?: string | null
          provider_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          license_number?: string | null
          provider_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      patient_conditions: {
        Row: {
          condition_name: string
          created_at: string
          icd_code: string | null
          id: string
          notes: string | null
          onset_date: string | null
          patient_id: string
          severity: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          condition_name: string
          created_at?: string
          icd_code?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          patient_id: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          condition_name?: string
          created_at?: string
          icd_code?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          patient_id?: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_conditions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_provider_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          is_active: boolean
          patient_id: string
          provider_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          patient_id: string
          provider_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          patient_id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_provider_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_provider_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_provider_assignments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_vitals: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          bmi: number | null
          created_at: string
          heart_rate: number | null
          height: number | null
          id: string
          oxygen_saturation: number | null
          patient_id: string
          recorded_at: string
          recorded_by: string | null
          temperature: number | null
          weight: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          created_at?: string
          heart_rate?: number | null
          height?: number | null
          id?: string
          oxygen_saturation?: number | null
          patient_id: string
          recorded_at?: string
          recorded_by?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          created_at?: string
          heart_rate?: number | null
          height?: number | null
          id?: string
          oxygen_saturation?: number | null
          patient_id?: string
          recorded_at?: string
          recorded_by?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: Json | null
          age: number
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: Json | null
          gender: string | null
          id: string
          insurance_info: Json | null
          mrn: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          age: number
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          mrn: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          age?: number
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: Json | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          mrn?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      phi_access_logs: {
        Row: {
          accessed_at: string
          action: string
          id: string
          ip_address: string | null
          patient_id: string
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accessed_at?: string
          action: string
          id?: string
          ip_address?: string | null
          patient_id: string
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accessed_at?: string
          action?: string
          id?: string
          ip_address?: string | null
          patient_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
      risk_assessments: {
        Row: {
          ai_consultation: Json | null
          ai_recommendations: Json | null
          assessment_date: string
          chart_quality_score: number | null
          chart_review_domains: Json | null
          created_at: string
          expires_at: string
          id: string
          metriport_data: Json | null
          overall_risk_score: number
          patient_id: string
          phenoml_analysis: Json | null
          risk_factors: Json
          risk_level: string
          updated_at: string
          xpc_chart_review: Json | null
        }
        Insert: {
          ai_consultation?: Json | null
          ai_recommendations?: Json | null
          assessment_date?: string
          chart_quality_score?: number | null
          chart_review_domains?: Json | null
          created_at?: string
          expires_at?: string
          id?: string
          metriport_data?: Json | null
          overall_risk_score: number
          patient_id: string
          phenoml_analysis?: Json | null
          risk_factors?: Json
          risk_level: string
          updated_at?: string
          xpc_chart_review?: Json | null
        }
        Update: {
          ai_consultation?: Json | null
          ai_recommendations?: Json | null
          assessment_date?: string
          chart_quality_score?: number | null
          chart_review_domains?: Json | null
          created_at?: string
          expires_at?: string
          id?: string
          metriport_data?: Json | null
          overall_risk_score?: number
          patient_id?: string
          phenoml_analysis?: Json | null
          risk_factors?: Json
          risk_level?: string
          updated_at?: string
          xpc_chart_review?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
      has_patient_access: {
        Args: { patient_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
