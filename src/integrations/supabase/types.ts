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
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: []
      }
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
      apify_runs: {
        Row: {
          actor_id: string
          actor_name: string | null
          ai_summary: string | null
          apify_run_id: string | null
          created_at: string
          dataset_id: string | null
          error_message: string | null
          finished_at: string | null
          id: string
          imported_count: number | null
          input: Json | null
          items_count: number | null
          source_query: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actor_id: string
          actor_name?: string | null
          ai_summary?: string | null
          apify_run_id?: string | null
          created_at?: string
          dataset_id?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          imported_count?: number | null
          input?: Json | null
          items_count?: number | null
          source_query?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actor_id?: string
          actor_name?: string | null
          ai_summary?: string | null
          apify_run_id?: string | null
          created_at?: string
          dataset_id?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          imported_count?: number | null
          input?: Json | null
          items_count?: number | null
          source_query?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      brand_knowledge: {
        Row: {
          description: string | null
          key: string
          label: string | null
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          label?: string | null
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          key?: string
          label?: string | null
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          notes: string | null
          priority: string
          related_document_id: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          priority?: string
          related_document_id?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          priority?: string
          related_document_id?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_related_document_id_fkey"
            columns: ["related_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      content_briefs: {
        Row: {
          angle: string | null
          brand_score: number | null
          channel_mix: Json
          created_at: string
          created_by: string | null
          cta: string | null
          id: string
          key_points: Json
          notes: string | null
          scheduled_for: string | null
          source_id: string | null
          source_type: string
          status: string
          target_audience: string | null
          title: string
          tone: string | null
          updated_at: string
        }
        Insert: {
          angle?: string | null
          brand_score?: number | null
          channel_mix?: Json
          created_at?: string
          created_by?: string | null
          cta?: string | null
          id?: string
          key_points?: Json
          notes?: string | null
          scheduled_for?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          target_audience?: string | null
          title: string
          tone?: string | null
          updated_at?: string
        }
        Update: {
          angle?: string | null
          brand_score?: number | null
          channel_mix?: Json
          created_at?: string
          created_by?: string | null
          cta?: string | null
          id?: string
          key_points?: Json
          notes?: string | null
          scheduled_for?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          target_audience?: string | null
          title?: string
          tone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_generations: {
        Row: {
          brand_fit_score: number | null
          brief: string | null
          brief_id: string | null
          created_at: string
          created_by: string | null
          formats: Json
          id: string
          persona: string | null
          prompt: string
          selected_variants: Json
          updated_at: string
        }
        Insert: {
          brand_fit_score?: number | null
          brief?: string | null
          brief_id?: string | null
          created_at?: string
          created_by?: string | null
          formats?: Json
          id?: string
          persona?: string | null
          prompt: string
          selected_variants?: Json
          updated_at?: string
        }
        Update: {
          brand_fit_score?: number | null
          brief?: string | null
          brief_id?: string | null
          created_at?: string
          created_by?: string | null
          formats?: Json
          id?: string
          persona?: string | null
          prompt?: string
          selected_variants?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_generations_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "content_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_briefings: {
        Row: {
          created_at: string
          date: string
          email_sent: boolean
          highlights: Json
          id: string
          suggested_focus: Json
          summary_md: string
        }
        Insert: {
          created_at?: string
          date: string
          email_sent?: boolean
          highlights?: Json
          id?: string
          suggested_focus?: Json
          summary_md: string
        }
        Update: {
          created_at?: string
          date?: string
          email_sent?: boolean
          highlights?: Json
          id?: string
          suggested_focus?: Json
          summary_md?: string
        }
        Relationships: []
      }
      daily_focus: {
        Row: {
          briefing_acknowledged_at: string | null
          briefing_payload: Json | null
          created_at: string
          energy_level: number | null
          focus_date: string
          id: string
          reflection: string | null
          top_priorities: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          briefing_acknowledged_at?: string | null
          briefing_payload?: Json | null
          created_at?: string
          energy_level?: number | null
          focus_date: string
          id?: string
          reflection?: string | null
          top_priorities?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          briefing_acknowledged_at?: string | null
          briefing_payload?: Json | null
          created_at?: string
          energy_level?: number | null
          focus_date?: string
          id?: string
          reflection?: string | null
          top_priorities?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_kpi_snapshots: {
        Row: {
          ai_cost_estimate: number
          avg_brand_fit: number | null
          created_at: string
          docs_processed: number
          extra: Json
          id: string
          leads_new: number
          leads_total: number
          posts_published: number
          posts_scheduled: number
          qualified_total: number
          signed_new: number
          signed_total: number
          snapshot_date: string
          waitlist_delta: number
          waitlist_total: number
        }
        Insert: {
          ai_cost_estimate?: number
          avg_brand_fit?: number | null
          created_at?: string
          docs_processed?: number
          extra?: Json
          id?: string
          leads_new?: number
          leads_total?: number
          posts_published?: number
          posts_scheduled?: number
          qualified_total?: number
          signed_new?: number
          signed_total?: number
          snapshot_date: string
          waitlist_delta?: number
          waitlist_total?: number
        }
        Update: {
          ai_cost_estimate?: number
          avg_brand_fit?: number | null
          created_at?: string
          docs_processed?: number
          extra?: Json
          id?: string
          leads_new?: number
          leads_total?: number
          posts_published?: number
          posts_scheduled?: number
          qualified_total?: number
          signed_new?: number
          signed_total?: number
          snapshot_date?: string
          waitlist_delta?: number
          waitlist_total?: number
        }
        Relationships: []
      }
      decisions: {
        Row: {
          context: string | null
          created_at: string
          created_by: string | null
          decided_at: string
          decision_text: string
          entity_id: string | null
          entity_type: string | null
          expected_outcome: string | null
          id: string
          outcome: Json | null
          outcome_note: string | null
          outcome_rating: number | null
          review_at: string
          reviewed_at: string | null
          updated_at: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          decided_at?: string
          decision_text: string
          entity_id?: string | null
          entity_type?: string | null
          expected_outcome?: string | null
          id?: string
          outcome?: Json | null
          outcome_note?: string | null
          outcome_rating?: number | null
          review_at?: string
          reviewed_at?: string | null
          updated_at?: string
        }
        Update: {
          context?: string | null
          created_at?: string
          created_by?: string | null
          decided_at?: string
          decision_text?: string
          entity_id?: string | null
          entity_type?: string | null
          expected_outcome?: string | null
          id?: string
          outcome?: Json | null
          outcome_note?: string | null
          outcome_rating?: number | null
          review_at?: string
          reviewed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          text: string
          token_count: number | null
        }
        Insert: {
          chunk_index: number
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          text: string
          token_count?: number | null
        }
        Update: {
          chunk_index?: number
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          text?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_entity_links: {
        Row: {
          confidence: number | null
          created_at: string
          document_id: string
          entity_id: string
          entity_type: string
          id: string
          source: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          document_id: string
          entity_id: string
          entity_type: string
          id?: string
          source?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          document_id?: string
          entity_id?: string
          entity_type?: string
          id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_entity_links_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_opens: {
        Row: {
          document_id: string
          id: string
          opened_at: string
          user_id: string | null
        }
        Insert: {
          document_id: string
          id?: string
          opened_at?: string
          user_id?: string | null
        }
        Update: {
          document_id?: string
          id?: string
          opened_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_opens_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_analyzed_at: string | null
          ai_description: string | null
          ai_dominant_colors: string[] | null
          ai_hook: string | null
          ai_mood: string | null
          ai_review: Json | null
          ai_suggested_alt: string | null
          ai_suggested_caption: string | null
          ai_suggested_copy: Json | null
          ai_tags: string[] | null
          ai_use_cases: Json | null
          category: Database["public"]["Enums"]["document_category"]
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duplicate_group: string | null
          duplicate_recommendation: string | null
          faq: Json | null
          file_hash: string | null
          file_size_bytes: number | null
          folder: string | null
          id: string
          is_ai_generated: boolean
          keep_status: string | null
          key_points: Json | null
          last_opened_at: string | null
          last_reviewed_at: string | null
          last_summarized_at: string | null
          lifecycle_status: string | null
          linked_document_id: string | null
          mime_type: string | null
          partner_type: Database["public"]["Enums"]["partner_type"] | null
          quality_notes: string | null
          quality_score: number | null
          related_partner_id: string | null
          relevance_score: number | null
          storage_path: string | null
          suggested_questions: Json | null
          title: string
          tldr: string | null
          updated_at: string
          when_to_use: string | null
        }
        Insert: {
          ai_analyzed_at?: string | null
          ai_description?: string | null
          ai_dominant_colors?: string[] | null
          ai_hook?: string | null
          ai_mood?: string | null
          ai_review?: Json | null
          ai_suggested_alt?: string | null
          ai_suggested_caption?: string | null
          ai_suggested_copy?: Json | null
          ai_tags?: string[] | null
          ai_use_cases?: Json | null
          category?: Database["public"]["Enums"]["document_category"]
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duplicate_group?: string | null
          duplicate_recommendation?: string | null
          faq?: Json | null
          file_hash?: string | null
          file_size_bytes?: number | null
          folder?: string | null
          id?: string
          is_ai_generated?: boolean
          keep_status?: string | null
          key_points?: Json | null
          last_opened_at?: string | null
          last_reviewed_at?: string | null
          last_summarized_at?: string | null
          lifecycle_status?: string | null
          linked_document_id?: string | null
          mime_type?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"] | null
          quality_notes?: string | null
          quality_score?: number | null
          related_partner_id?: string | null
          relevance_score?: number | null
          storage_path?: string | null
          suggested_questions?: Json | null
          title: string
          tldr?: string | null
          updated_at?: string
          when_to_use?: string | null
        }
        Update: {
          ai_analyzed_at?: string | null
          ai_description?: string | null
          ai_dominant_colors?: string[] | null
          ai_hook?: string | null
          ai_mood?: string | null
          ai_review?: Json | null
          ai_suggested_alt?: string | null
          ai_suggested_caption?: string | null
          ai_suggested_copy?: Json | null
          ai_tags?: string[] | null
          ai_use_cases?: Json | null
          category?: Database["public"]["Enums"]["document_category"]
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duplicate_group?: string | null
          duplicate_recommendation?: string | null
          faq?: Json | null
          file_hash?: string | null
          file_size_bytes?: number | null
          folder?: string | null
          id?: string
          is_ai_generated?: boolean
          keep_status?: string | null
          key_points?: Json | null
          last_opened_at?: string | null
          last_reviewed_at?: string | null
          last_summarized_at?: string | null
          lifecycle_status?: string | null
          linked_document_id?: string | null
          mime_type?: string | null
          partner_type?: Database["public"]["Enums"]["partner_type"] | null
          quality_notes?: string | null
          quality_score?: number | null
          related_partner_id?: string | null
          relevance_score?: number | null
          storage_path?: string | null
          suggested_questions?: Json | null
          title?: string
          tldr?: string | null
          updated_at?: string
          when_to_use?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_linked_document_id_fkey"
            columns: ["linked_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_related_partner_id_fkey"
            columns: ["related_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_analyses: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          result: Json | null
          source_file_ids: Json
          source_file_names: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          result?: Json | null
          source_file_ids?: Json
          source_file_names?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          result?: Json | null
          source_file_ids?: Json
          source_file_names?: Json
        }
        Relationships: []
      }
      drive_decisions: {
        Row: {
          answer: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          question: string
          source_file_ids: Json
          status: string
          topic: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          question: string
          source_file_ids?: Json
          status?: string
          topic?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          question?: string
          source_file_ids?: Json
          status?: string
          topic?: string | null
        }
        Relationships: []
      }
      drive_inventory: {
        Row: {
          age_signal: string | null
          ai_reason: string | null
          archived: boolean
          archived_at: string | null
          created_at: string
          duplicate_group: string | null
          file_id: string
          id: string
          mime_type: string | null
          modified_time: string | null
          name: string
          parent_id: string | null
          previous_parents: string[] | null
          scanned_at: string
          suggested_action: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          age_signal?: string | null
          ai_reason?: string | null
          archived?: boolean
          archived_at?: string | null
          created_at?: string
          duplicate_group?: string | null
          file_id: string
          id?: string
          mime_type?: string | null
          modified_time?: string | null
          name: string
          parent_id?: string | null
          previous_parents?: string[] | null
          scanned_at?: string
          suggested_action?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          age_signal?: string | null
          ai_reason?: string | null
          archived?: boolean
          archived_at?: string | null
          created_at?: string
          duplicate_group?: string | null
          file_id?: string
          id?: string
          mime_type?: string | null
          modified_time?: string | null
          name?: string
          parent_id?: string | null
          previous_parents?: string[] | null
          scanned_at?: string
          suggested_action?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_md: string
          category: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body_md: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body_md?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      entity_scores: {
        Row: {
          computed_at: string
          entity_id: string
          entity_type: string
          id: string
          model: string | null
          next_action: string | null
          reasons: Json
          score: number
        }
        Insert: {
          computed_at?: string
          entity_id: string
          entity_type: string
          id?: string
          model?: string | null
          next_action?: string | null
          reasons?: Json
          score: number
        }
        Update: {
          computed_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          model?: string | null
          next_action?: string | null
          reasons?: Json
          score?: number
        }
        Relationships: []
      }
      image_analysis_versions: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          id: string
          is_current: boolean
          result: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id: string
          id?: string
          is_current?: boolean
          result: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          id?: string
          is_current?: boolean
          result?: Json
        }
        Relationships: [
          {
            foreignKeyName: "image_analysis_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_items: {
        Row: {
          body: string | null
          created_at: string
          dedupe_key: string | null
          entity_id: string | null
          entity_kind: string | null
          id: string
          kind: string
          payload: Json | null
          resolved_at: string | null
          severity: string
          snoozed_until: string | null
          status: string
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_kind?: string | null
          id?: string
          kind: string
          payload?: Json | null
          resolved_at?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_kind?: string | null
          id?: string
          kind?: string
          payload?: Json | null
          resolved_at?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      lead_import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          duplicate_rows: number | null
          error_rows: number | null
          errors: Json | null
          filename: string | null
          id: string
          imported_rows: number | null
          source: string
          status: string
          total_rows: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          duplicate_rows?: number | null
          error_rows?: number | null
          errors?: Json | null
          filename?: string | null
          id?: string
          imported_rows?: number | null
          source: string
          status?: string
          total_rows?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          duplicate_rows?: number | null
          error_rows?: number | null
          errors?: Json | null
          filename?: string | null
          id?: string
          imported_rows?: number | null
          source?: string
          status?: string
          total_rows?: number | null
        }
        Relationships: []
      }
      lead_mockups: {
        Row: {
          created_at: string
          id: string
          image_url: string
          model: string | null
          partner_id: string
          prompt: string | null
          storage_path: string | null
          user_id: string | null
          variant: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          model?: string | null
          partner_id: string
          prompt?: string | null
          storage_path?: string | null
          user_id?: string | null
          variant?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          model?: string | null
          partner_id?: string
          prompt?: string | null
          storage_path?: string | null
          user_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_mockups_partner_id_fkey"
            columns: ["partner_id"]
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
          assistant_rationale: string | null
          brand_score: number | null
          brief_id: string | null
          channel: string
          content_draft: string | null
          created_at: string
          created_by: string | null
          goal: string | null
          hashtags: string | null
          id: string
          image_doc_id: string | null
          related_document_id: string | null
          saved_snippet_id: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: Database["public"]["Enums"]["calendar_status"]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assistant_rationale?: string | null
          brand_score?: number | null
          brief_id?: string | null
          channel?: string
          content_draft?: string | null
          created_at?: string
          created_by?: string | null
          goal?: string | null
          hashtags?: string | null
          id?: string
          image_doc_id?: string | null
          related_document_id?: string | null
          saved_snippet_id?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["calendar_status"]
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          assistant_rationale?: string | null
          brand_score?: number | null
          brief_id?: string | null
          channel?: string
          content_draft?: string | null
          created_at?: string
          created_by?: string | null
          goal?: string | null
          hashtags?: string | null
          id?: string
          image_doc_id?: string | null
          related_document_id?: string | null
          saved_snippet_id?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["calendar_status"]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_calendar_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "content_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_calendar_image_doc_id_fkey"
            columns: ["image_doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_calendar_related_document_id_fkey"
            columns: ["related_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_calendar_saved_snippet_id_fkey"
            columns: ["saved_snippet_id"]
            isOneToOne: false
            referencedRelation: "saved_content_snippets"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_events: {
        Row: {
          cost_huf: number | null
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          input_tokens: number | null
          metadata: Json
          model: string | null
          output_tokens: number | null
          value: number | null
        }
        Insert: {
          cost_huf?: number | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          input_tokens?: number | null
          metadata?: Json
          model?: string | null
          output_tokens?: number | null
          value?: number | null
        }
        Update: {
          cost_huf?: number | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          input_tokens?: number | null
          metadata?: Json
          model?: string | null
          output_tokens?: number | null
          value?: number | null
        }
        Relationships: []
      }
      outreach_enrollments: {
        Row: {
          created_at: string
          created_by: string | null
          current_step: number
          entity_id: string
          entity_type: string
          finished_at: string | null
          id: string
          metadata: Json
          next_run_at: string | null
          sequence_id: string
          started_at: string
          status: string
          stop_reason: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_step?: number
          entity_id: string
          entity_type: string
          finished_at?: string | null
          id?: string
          metadata?: Json
          next_run_at?: string | null
          sequence_id: string
          started_at?: string
          status?: string
          stop_reason?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_step?: number
          entity_id?: string
          entity_type?: string
          finished_at?: string | null
          id?: string
          metadata?: Json
          next_run_at?: string | null
          sequence_id?: string
          started_at?: string
          status?: string
          stop_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "outreach_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_events: {
        Row: {
          body_preview: string | null
          channel: string
          clicked_at: string | null
          enrollment_id: string
          external_id: string | null
          id: string
          metadata: Json
          opened_at: string | null
          replied_at: string | null
          sent_at: string
          status: string
          step_index: number
          subject: string | null
        }
        Insert: {
          body_preview?: string | null
          channel: string
          clicked_at?: string | null
          enrollment_id: string
          external_id?: string | null
          id?: string
          metadata?: Json
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string
          status?: string
          step_index: number
          subject?: string | null
        }
        Update: {
          body_preview?: string | null
          channel?: string
          clicked_at?: string | null
          enrollment_id?: string
          external_id?: string | null
          id?: string
          metadata?: Json
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string
          status?: string
          step_index?: number
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_events_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "outreach_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_sequences: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          kind: string
          name: string
          steps: Json
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          name: string
          steps?: Json
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          name?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: []
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
      partner_emails: {
        Row: {
          body_html: string | null
          id: string
          opened_at: string | null
          partner_id: string
          resend_id: string | null
          sent_at: string
          sent_by: string | null
          status: string
          subject: string
          template_id: string | null
          to_email: string
        }
        Insert: {
          body_html?: string | null
          id?: string
          opened_at?: string | null
          partner_id: string
          resend_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject: string
          template_id?: string | null
          to_email: string
        }
        Update: {
          body_html?: string | null
          id?: string
          opened_at?: string | null
          partner_id?: string
          resend_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_emails_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_emails_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
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
          address: string | null
          ai_next_action: string | null
          ai_score: number | null
          ai_score_reason: string | null
          ai_scored_at: string | null
          apify_place_id: string | null
          apify_source_run_id: string | null
          assigned_to: string | null
          category: string | null
          city: string | null
          company_name: string
          contact_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          google_maps_url: string | null
          google_place_id: string | null
          google_rating: number | null
          google_reviews_count: number | null
          id: string
          instagram: string | null
          instagram_handle: string | null
          last_researched_at: string | null
          lat: number | null
          latitude: number | null
          lead_score: number | null
          lng: number | null
          longitude: number | null
          next_followup_at: string | null
          notes: string | null
          phone: string | null
          rating: number | null
          rating_count: number | null
          research_dossier: Json | null
          research_notes: Json | null
          research_updated_at: string | null
          score_reasons: Json | null
          score_updated_at: string | null
          source: string | null
          stage_id: string | null
          status: Database["public"]["Enums"]["partner_status"]
          tags: string[] | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          ai_next_action?: string | null
          ai_score?: number | null
          ai_score_reason?: string | null
          ai_scored_at?: string | null
          apify_place_id?: string | null
          apify_source_run_id?: string | null
          assigned_to?: string | null
          category?: string | null
          city?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
          id?: string
          instagram?: string | null
          instagram_handle?: string | null
          last_researched_at?: string | null
          lat?: number | null
          latitude?: number | null
          lead_score?: number | null
          lng?: number | null
          longitude?: number | null
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          rating_count?: number | null
          research_dossier?: Json | null
          research_notes?: Json | null
          research_updated_at?: string | null
          score_reasons?: Json | null
          score_updated_at?: string | null
          source?: string | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tags?: string[] | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          ai_next_action?: string | null
          ai_score?: number | null
          ai_score_reason?: string | null
          ai_scored_at?: string | null
          apify_place_id?: string | null
          apify_source_run_id?: string | null
          assigned_to?: string | null
          category?: string | null
          city?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
          id?: string
          instagram?: string | null
          instagram_handle?: string | null
          last_researched_at?: string | null
          lat?: number | null
          latitude?: number | null
          lead_score?: number | null
          lng?: number | null
          longitude?: number | null
          next_followup_at?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          rating_count?: number | null
          research_dossier?: Json | null
          research_notes?: Json | null
          research_updated_at?: string | null
          score_reasons?: Json | null
          score_updated_at?: string | null
          source?: string | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tags?: string[] | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_apify_source_run_id_fkey"
            columns: ["apify_source_run_id"]
            isOneToOne: false
            referencedRelation: "apify_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_terminal: boolean
          key: string
          kind: string
          label: string
          order: number
          sla_days: number | null
          updated_at: string
          win_probability: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_terminal?: boolean
          key: string
          kind: string
          label: string
          order?: number
          sla_days?: number | null
          updated_at?: string
          win_probability?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_terminal?: boolean
          key?: string
          kind?: string
          label?: string
          order?: number
          sla_days?: number | null
          updated_at?: string
          win_probability?: number | null
        }
        Relationships: []
      }
      pipeline_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
          owner: string | null
          source: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json
          owner?: string | null
          source?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json
          owner?: string | null
          source?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline_transitions: {
        Row: {
          ai_suggested: boolean
          by_user: string | null
          created_at: string
          entity_id: string
          entity_type: string
          from_stage_id: string | null
          id: string
          reason: string | null
          to_stage_id: string | null
        }
        Insert: {
          ai_suggested?: boolean
          by_user?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          from_stage_id?: string | null
          id?: string
          reason?: string | null
          to_stage_id?: string | null
        }
        Update: {
          ai_suggested?: boolean
          by_user?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          from_stage_id?: string | null
          id?: string
          reason?: string | null
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_transitions_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_transitions_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
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
      saved_content_snippets: {
        Row: {
          brief: string | null
          created_at: string
          created_by: string | null
          format_key: string
          format_label: string
          generation_id: string | null
          id: string
          linked_image_doc_id: string | null
          notes: string | null
          persona: string | null
          scheduled_calendar_id: string | null
          tags: string[]
          text: string
          updated_at: string
        }
        Insert: {
          brief?: string | null
          created_at?: string
          created_by?: string | null
          format_key: string
          format_label: string
          generation_id?: string | null
          id?: string
          linked_image_doc_id?: string | null
          notes?: string | null
          persona?: string | null
          scheduled_calendar_id?: string | null
          tags?: string[]
          text: string
          updated_at?: string
        }
        Update: {
          brief?: string | null
          created_at?: string
          created_by?: string | null
          format_key?: string
          format_label?: string
          generation_id?: string | null
          id?: string
          linked_image_doc_id?: string | null
          notes?: string | null
          persona?: string | null
          scheduled_calendar_id?: string | null
          tags?: string[]
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_content_snippets_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "content_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_content_snippets_linked_image_doc_id_fkey"
            columns: ["linked_image_doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      snippet_performance: {
        Row: {
          calendar_id: string | null
          channel: string
          clicks: number | null
          comments: number | null
          created_at: string
          created_by: string | null
          id: string
          impressions: number | null
          notes: string | null
          reactions: number | null
          recorded_at: string
          shares: number | null
          snippet_id: string | null
          source: string
        }
        Insert: {
          calendar_id?: string | null
          channel: string
          clicks?: number | null
          comments?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          impressions?: number | null
          notes?: string | null
          reactions?: number | null
          recorded_at?: string
          shares?: number | null
          snippet_id?: string | null
          source?: string
        }
        Update: {
          calendar_id?: string | null
          channel?: string
          clicks?: number | null
          comments?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          impressions?: number | null
          notes?: string | null
          reactions?: number | null
          recorded_at?: string
          shares?: number | null
          snippet_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "snippet_performance_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "marketing_calendar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snippet_performance_snippet_id_fkey"
            columns: ["snippet_id"]
            isOneToOne: false
            referencedRelation: "saved_content_snippets"
            referencedColumns: ["id"]
          },
        ]
      }
      time_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          minutes: number
          module: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          minutes: number
          module: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          minutes?: number
          module?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trend_signals: {
        Row: {
          ai_cost_estimate: number | null
          category: string | null
          created_at: string
          id: string
          ingested_at: string
          metadata: Json | null
          published_at: string | null
          query: string | null
          relevance_score: number | null
          saved_to_decision_id: string | null
          scraped_at: string | null
          source_title: string | null
          source_url: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_cost_estimate?: number | null
          category?: string | null
          created_at?: string
          id?: string
          ingested_at?: string
          metadata?: Json | null
          published_at?: string | null
          query?: string | null
          relevance_score?: number | null
          saved_to_decision_id?: string | null
          scraped_at?: string | null
          source_title?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_cost_estimate?: number | null
          category?: string | null
          created_at?: string
          id?: string
          ingested_at?: string
          metadata?: Json | null
          published_at?: string | null
          query?: string | null
          relevance_score?: number | null
          saved_to_decision_id?: string | null
          scraped_at?: string | null
          source_title?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_signals_saved_to_decision_id_fkey"
            columns: ["saved_to_decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
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
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          last_action_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
          week_start: string | null
          weekly_goal: number
          weekly_progress: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          last_action_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
          week_start?: string | null
          weekly_goal?: number
          weekly_progress?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          last_action_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
          week_start?: string | null
          weekly_goal?: number
          weekly_progress?: number
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
      voice_notes: {
        Row: {
          created_at: string
          id: string
          intent: string | null
          status: string
          structured: Json
          target_id: string | null
          target_table: string | null
          transcript: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intent?: string | null
          status?: string
          structured?: Json
          target_id?: string | null
          target_table?: string | null
          transcript: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intent?: string | null
          status?: string
          structured?: Json
          target_id?: string | null
          target_table?: string | null
          transcript?: string
          user_id?: string
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
      weekly_goals: {
        Row: {
          actual: number
          created_at: string
          id: string
          metric: string | null
          status: string
          target: number
          title: string
          updated_at: string
          user_id: string | null
          week_start: string
        }
        Insert: {
          actual?: number
          created_at?: string
          id?: string
          metric?: string | null
          status?: string
          target?: number
          title: string
          updated_at?: string
          user_id?: string | null
          week_start: string
        }
        Update: {
          actual?: number
          created_at?: string
          id?: string
          metric?: string | null
          status?: string
          target?: number
          title?: string
          updated_at?: string
          user_id?: string | null
          week_start?: string
        }
        Relationships: []
      }
      weekly_retros: {
        Row: {
          blockers: Json
          created_at: string
          id: string
          kpi_delta: Json
          next_week_focus: Json
          summary_md: string
          week_start: string
          wins: Json
        }
        Insert: {
          blockers?: Json
          created_at?: string
          id?: string
          kpi_delta?: Json
          next_week_focus?: Json
          summary_md: string
          week_start: string
          wins?: Json
        }
        Update: {
          blockers?: Json
          created_at?: string
          id?: string
          kpi_delta?: Json
          next_week_focus?: Json
          summary_md?: string
          week_start?: string
          wins?: Json
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
      match_document_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          chunk_id: string
          chunk_index: number
          document_id: string
          similarity: number
          text: string
        }[]
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
