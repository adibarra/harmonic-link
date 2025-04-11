export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      artist_albums: {
        Row: {
          album_id: string;
          artist_id: string;
          collaboration: boolean;
        };
        Insert: {
          album_id: string;
          artist_id: string;
          collaboration?: boolean;
        };
        Update: {
          album_id?: string;
          artist_id?: string;
          collaboration?: boolean;
        };
        Relationships: [];
      };
      daily_game_session: {
        Row: {
          challenge_link_length: number;
          daily_game_id: number;
          date: string;
          end_album_id: string | null;
          end_artist_id: string;
          game_mode: string | null;
          start_album_id: string | null;
          start_artist_id: string;
        };
        Insert: {
          challenge_link_length: number;
          daily_game_id?: number;
          date: string;
          end_album_id?: string | null;
          end_artist_id: string;
          game_mode?: string | null;
          start_album_id?: string | null;
          start_artist_id: string;
        };
        Update: {
          challenge_link_length?: number;
          daily_game_id?: number;
          date?: string;
          end_album_id?: string | null;
          end_artist_id?: string;
          game_mode?: string | null;
          start_album_id?: string | null;
          start_artist_id?: string;
        };
        Relationships: [];
      };
      game_links: {
        Row: {
          entity_id: string;
          entity_type: string;
          game_id: number;
          link_id: number;
          step_order: number;
        };
        Insert: {
          entity_id: string;
          entity_type: string;
          game_id: number;
          link_id?: number;
          step_order: number;
        };
        Update: {
          entity_id?: string;
          entity_type?: string;
          game_id?: number;
          link_id?: number;
          step_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "game_links_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["game_id"];
          },
        ];
      };
      games: {
        Row: {
          end_album_id: string | null;
          end_artist_id: string | null;
          end_time: string | null;
          game_id: number;
          game_mode: string | null;
          num_links_made: number | null;
          score: number | null;
          start_album_id: string | null;
          start_artist_id: string | null;
          start_time: string | null;
          user_id: number | null;
        };
        Insert: {
          end_album_id?: string | null;
          end_artist_id?: string | null;
          end_time?: string | null;
          game_id?: number;
          game_mode?: string | null;
          num_links_made?: number | null;
          score?: number | null;
          start_album_id?: string | null;
          start_artist_id?: string | null;
          start_time?: string | null;
          user_id?: number | null;
        };
        Update: {
          end_album_id?: string | null;
          end_artist_id?: string | null;
          end_time?: string | null;
          game_id?: number;
          game_mode?: string | null;
          num_links_made?: number | null;
          score?: number | null;
          start_album_id?: string | null;
          start_artist_id?: string | null;
          start_time?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "games_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["user_id"];
          },
        ];
      };
      playlist: {
        Row: {
          created_at: string | null;
          playlist_id: number;
          playlist_name: string | null;
          spotify_playlist_id: string | null;
          user_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          playlist_id?: number;
          playlist_name?: string | null;
          spotify_playlist_id?: string | null;
          user_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          playlist_id?: number;
          playlist_name?: string | null;
          spotify_playlist_id?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "playlist_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["user_id"];
          },
        ];
      };
      playlist_songs: {
        Row: {
          added_at: string;
          playlist_id: number | null;
          playlist_song_id: number;
          song_id: number | null;
        };
        Insert: {
          added_at: string;
          playlist_id?: number | null;
          playlist_song_id?: number;
          song_id?: number | null;
        };
        Update: {
          added_at?: string;
          playlist_id?: number | null;
          playlist_song_id?: number;
          song_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "playlist";
            referencedColumns: ["playlist_id"];
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "songs";
            referencedColumns: ["song_id"];
          },
        ];
      };
      songs: {
        Row: {
          album: string | null;
          artist: string | null;
          genre: string | null;
          release_year: number | null;
          song_id: number;
          spotify_id: string;
          title: string | null;
        };
        Insert: {
          album?: string | null;
          artist?: string | null;
          genre?: string | null;
          release_year?: number | null;
          song_id?: number;
          spotify_id: string;
          title?: string | null;
        };
        Update: {
          album?: string | null;
          artist?: string | null;
          genre?: string | null;
          release_year?: number | null;
          song_id?: number;
          spotify_id?: string;
          title?: string | null;
        };
        Relationships: [];
      };
      user: {
        Row: {
          access_token: string;
          display_name: string;
          image: string | null;
          refresh_token: string;
          spotify_id: string;
          user_id: number;
        };
        Insert: {
          access_token: string;
          display_name: string;
          image?: string | null;
          refresh_token: string;
          spotify_id: string;
          user_id?: number;
        };
        Update: {
          access_token?: string;
          display_name?: string;
          image?: string | null;
          refresh_token?: string;
          spotify_id?: string;
          user_id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
