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
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean | null
          priority: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      best_schools: {
        Row: {
          average_marks: number
          created_at: string
          district: string
          id: string
          is_published: boolean | null
          position: number
          published_by: string | null
          region: string
          school_name: string
          series_number: number
          total_students: number | null
          updated_at: string
        }
        Insert: {
          average_marks: number
          created_at?: string
          district: string
          id?: string
          is_published?: boolean | null
          position: number
          published_by?: string | null
          region: string
          school_name: string
          series_number: number
          total_students?: number | null
          updated_at?: string
        }
        Update: {
          average_marks?: number
          created_at?: string
          district?: string
          id?: string
          is_published?: boolean | null
          position?: number
          published_by?: string | null
          region?: string
          school_name?: string
          series_number?: number
          total_students?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          school: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          school?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          school?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      general_results: {
        Row: {
          created_at: string
          general_results_url: string | null
          id: string
          is_published: boolean | null
          published_by: string | null
          series_number: number
          top_ten_schools_url: string | null
          top_ten_students_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          general_results_url?: string | null
          id?: string
          is_published?: boolean | null
          published_by?: string | null
          series_number: number
          top_ten_schools_url?: string | null
          top_ten_students_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          general_results_url?: string | null
          id?: string
          is_published?: boolean | null
          published_by?: string | null
          series_number?: number
          top_ten_schools_url?: string | null
          top_ten_students_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      participation_confirmations: {
        Row: {
          confirmed_by: string
          confirmed_date: string | null
          created_at: string
          id: string
          notes: string | null
          number_of_students: number | null
          school_id: string | null
          series_number: number
          updated_at: string
        }
        Insert: {
          confirmed_by: string
          confirmed_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          number_of_students?: number | null
          school_id?: string | null
          series_number: number
          updated_at?: string
        }
        Update: {
          confirmed_by?: string
          confirmed_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          number_of_students?: number | null
          school_id?: string | null
          series_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participation_confirmations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_status: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          receipt_number: string | null
          school_id: string | null
          series_number: number
          status: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id?: string | null
          series_number: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          school_id?: string | null
          series_number?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_status_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string
          district: string
          grade: string
          id: string
          marks: number
          position: number | null
          region: string
          school_id: string | null
          series_number: number
          student_name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          district: string
          grade: string
          id?: string
          marks: number
          position?: number | null
          region: string
          school_id?: string | null
          series_number: number
          student_name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string
          grade?: string
          id?: string
          marks?: number
          position?: number | null
          region?: string
          school_id?: string | null
          series_number?: number
          student_name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_results: {
        Row: {
          created_at: string
          general_results_url: string | null
          id: string
          individual_results_url: string | null
          is_published: boolean | null
          published_by: string | null
          school_id: string | null
          series_number: number
          top_ten_schools_url: string | null
          top_ten_students_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          general_results_url?: string | null
          id?: string
          individual_results_url?: string | null
          is_published?: boolean | null
          published_by?: string | null
          school_id?: string | null
          series_number: number
          top_ten_schools_url?: string | null
          top_ten_students_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          general_results_url?: string | null
          id?: string
          individual_results_url?: string | null
          is_published?: boolean | null
          published_by?: string | null
          school_id?: string | null
          series_number?: number
          top_ten_schools_url?: string | null
          top_ten_students_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_results_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          contact_name: string
          created_at: string
          district: string
          email: string | null
          id: string
          message: string | null
          phone_number: string
          region: string
          school_name: string
          updated_at: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          district: string
          email?: string | null
          id?: string
          message?: string | null
          phone_number: string
          region: string
          school_name: string
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          district?: string
          email?: string | null
          id?: string
          message?: string | null
          phone_number?: string
          region?: string
          school_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_materials: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          grade_level: string | null
          id: string
          is_published: boolean | null
          material_type: string
          price: number | null
          published_by: string | null
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_published?: boolean | null
          material_type: string
          price?: number | null
          published_by?: string | null
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_published?: boolean | null
          material_type?: string
          price?: number | null
          published_by?: string | null
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      top_students: {
        Row: {
          created_at: string
          district: string
          id: string
          is_published: boolean | null
          marks: number
          position: number
          published_by: string | null
          region: string
          school_name: string
          series_number: number
          student_name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          district: string
          id?: string
          is_published?: boolean | null
          marks: number
          position: number
          published_by?: string | null
          region: string
          school_name: string
          series_number: number
          student_name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          is_published?: boolean | null
          marks?: number
          position?: number
          published_by?: string | null
          region?: string
          school_name?: string
          series_number?: number
          student_name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
