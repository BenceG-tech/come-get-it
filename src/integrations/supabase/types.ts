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
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message: Json
          role: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message: Json
          role: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message?: Json
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          file_size_bytes: number | null
          folder: string | null
          id: string
          is_ai_generated: boolean
          mime_type: string | null
          partner_type: Database["public"]["Enums"]["partner_type"] | null
          related_partner_id: string | null
          storage_path: string | null
          title: string
          updated_at: string
          when_to_use: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_size_bytes?: number | null
          folder?: string | null
          id?: string
          is_ai_generated?: boolean
          mime_type?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"] | null
          related_partner_id?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
          when_to_use?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_size_bytes?: number | null
          folder?: string | null
          id?: string
          is_ai_generated?: boolean
          mime_type?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"] | null
          related_partner_id?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          when_to_use?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_related_partner_id_fkey"
            columns: ["related_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          request_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          request_type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          request_type?: string
        }
        Relationships: []
      }
      marketing_calendar: {
        Row: {
          channel: string
          content_draft: string | null
          created_at: string
          created_by: string | null
          hashtags: string | null
          id: string
          related_document_id: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["calendar_status"]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          channel?: string
          content_draft?: string | null
          created_at?: string
          created_by?: string | null
          hashtags?: string | null
          id?: string
          related_document_id?: string | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["calendar_status"]
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          content_draft?: string | null
          created_at?: string
          created_by?: string | null
          hashtags?: string | null
          id?: string
          related_document_id?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["calendar_status"]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_calendar_related_document_id_fkey"
            columns: ["related_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_documents_sent: {
        Row: {
          channel: Database["public"]["Enums"]["interaction_channel"] | null
          created_by: string | null
          document_id: string
          id: string
          notes: string | null
          partner_id: string
          sent_at: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["interaction_channel"] | null
          created_by?: string | null
          document_id: string
          id?: string
          notes?: string | null
          partner_id: string
          sent_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["interaction_channel"] | null
          created_by?: string | null
          document_id?: string
          id?: string
          notes?: string | null
          partner_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_documents_sent_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_documents_sent_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_interactions: {
        Row: {
          channel: Database["public"]["Enums"]["interaction_channel"]
          created_at: string
          created_by: string | null
          direction: Database["public"]["Enums"]["interaction_direction"]
          full_content: string | null
          id: string
          occurred_at: string
          partner_id: string
          summary: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["interaction_channel"]
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["interaction_direction"]
          full_content?: string | null
          id?: string
          occurred_at?: string
          partner_id: string
          summary: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["interaction_channel"]
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["interaction_direction"]
          full_content?: string | null
          id?: string
          occurred_at?: string
          partner_id?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_interactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          city: string | null
          company_name: string
          contact_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          instagram: string | null
          next_followup_at: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["partner_status"]
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venue_applications: {
        Row: {
          address_city: string | null
          created_at: string
          daily_customer_count: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string
          venue_name: string
          venue_type: string | null
        }
        Insert: {
          address_city?: string | null
          created_at?: string
          daily_customer_count?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          venue_name: string
          venue_type?: string | null
        }
        Update: {
          address_city?: string | null
          created_at?: string
          daily_customer_count?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          venue_name?: string
          venue_type?: string | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          updated_at?: string
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
      calendar_status: "idea" | "draft" | "ready" | "posted" | "cancelled"
      document_category:
        | "one_pager_venue"
        | "long_pitch_venue"
        | "drink_brand_deck"
        | "rewards_onboarding"
        | "email_template"
        | "social_post"
        | "ai_generated"
        | "other"
      interaction_channel:
        | "email"
        | "instagram_dm"
        | "phone"
        | "in_person"
        | "whatsapp"
        | "other"
      interaction_direction: "outbound" | "inbound"
      partner_status:
        | "lead"
        | "contacted"
        | "negotiating"
        | "proposal_sent"
        | "signed"
        | "rejected"
        | "paused"
      partner_type: "venue" | "drink_brand" | "rewards_partner" | "other"
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
      calendar_status: ["idea", "draft", "ready", "posted", "cancelled"],
      document_category: [
        "one_pager_venue",
        "long_pitch_venue",
        "drink_brand_deck",
        "rewards_onboarding",
        "email_template",
        "social_post",
        "ai_generated",
        "other",
      ],
      interaction_channel: [
        "email",
        "instagram_dm",
        "phone",
        "in_person",
        "whatsapp",
        "other",
      ],
      interaction_direction: ["outbound", "inbound"],
      partner_status: [
        "lead",
        "contacted",
        "negotiating",
        "proposal_sent",
        "signed",
        "rejected",
        "paused",
      ],
      partner_type: ["venue", "drink_brand", "rewards_partner", "other"],
    },
  },
} as const
