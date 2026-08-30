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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          visitor_hash: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          visitor_hash: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          visitor_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_email: string | null
          author_name: string
          author_user_id: string | null
          body: string
          created_at: string
          edit_secret_hash: string | null
          edited_at: string | null
          id: string
          like_count: number
          parent_id: string | null
          pinned: boolean
          post_id: string
          status: Database["public"]["Enums"]["comment_status"]
          visitor_hash: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          author_user_id?: string | null
          body: string
          created_at?: string
          edit_secret_hash?: string | null
          edited_at?: string | null
          id?: string
          like_count?: number
          parent_id?: string | null
          pinned?: boolean
          post_id: string
          status?: Database["public"]["Enums"]["comment_status"]
          visitor_hash?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          author_user_id?: string | null
          body?: string
          created_at?: string
          edit_secret_hash?: string | null
          edited_at?: string | null
          id?: string
          like_count?: number
          parent_id?: string | null
          pinned?: boolean
          post_id?: string
          status?: Database["public"]["Enums"]["comment_status"]
          visitor_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          auto_reply_message: string | null
          auto_reply_sent: boolean
          auto_reply_sent_at: string | null
          category: string | null
          created_at: string
          email: string
          id: string
          intent: string | null
          message: string
          name: string
          notification_sent: boolean
          priority: string | null
          suggested_response: string | null
          updated_at: string
        }
        Insert: {
          auto_reply_message?: string | null
          auto_reply_sent?: boolean
          auto_reply_sent_at?: string | null
          category?: string | null
          created_at?: string
          email: string
          id?: string
          intent?: string | null
          message: string
          name: string
          notification_sent?: boolean
          priority?: string | null
          suggested_response?: string | null
          updated_at?: string
        }
        Update: {
          auto_reply_message?: string | null
          auto_reply_sent?: boolean
          auto_reply_sent_at?: string | null
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          intent?: string | null
          message?: string
          name?: string
          notification_sent?: boolean
          priority?: string | null
          suggested_response?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirm_token: string | null
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          source: string | null
          status: Database["public"]["Enums"]["subscriber_status"]
        }
        Insert: {
          confirm_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
        }
        Update: {
          confirm_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
        }
        Relationships: []
      }
      post_bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          visitor_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          visitor_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          visitor_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_media: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          post_id: string | null
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          post_id?: string | null
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          post_id?: string | null
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          category_id: string | null
          cover_image_url: string | null
          created_at: string
          featured: boolean
          id: string
          meta_description: string | null
          published_at: string | null
          reading_time_minutes: number | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          summary: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          meta_description?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      bump_comment_like_count: {
        Args: { _comment_id: string; _delta: number }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      comment_status: "pending" | "approved" | "hidden"
      media_kind: "image" | "video"
      post_status: "draft" | "published"
      subscriber_status: "pending" | "confirmed" | "unsubscribed"
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
      app_role: ["admin", "editor"],
      comment_status: ["pending", "approved", "hidden"],
      media_kind: ["image", "video"],
      post_status: ["draft", "published"],
      subscriber_status: ["pending", "confirmed", "unsubscribed"],
    },
  },
} as const
