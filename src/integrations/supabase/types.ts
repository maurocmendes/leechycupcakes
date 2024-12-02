export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: number
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: number
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      administrators: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          cupcake_id: number
          id: number
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cupcake_id: number
          id?: number
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cupcake_id?: number
          id?: number
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cupcake_id_fkey"
            columns: ["cupcake_id"]
            isOneToOne: false
            referencedRelation: "cupcakes"
            referencedColumns: ["id"]
          },
        ]
      }
      cupcakes: {
        Row: {
          created_at: string
          description: string
          discount: number | null
          id: number
          image: string
          ingredients: string
          is_black_friday: boolean | null
          is_christmas: boolean | null
          is_new: boolean | null
          order_count: number | null
          price: number
          promotion_end_date: string | null
          promotion_start_date: string | null
          promotion_type: string | null
          promotion_value: number | null
          stock: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number | null
          id?: number
          image: string
          ingredients: string
          is_black_friday?: boolean | null
          is_christmas?: boolean | null
          is_new?: boolean | null
          order_count?: number | null
          price: number
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_type?: string | null
          promotion_value?: number | null
          stock?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number | null
          id?: number
          image?: string
          ingredients?: string
          is_black_friday?: boolean | null
          is_christmas?: boolean | null
          is_new?: boolean | null
          order_count?: number | null
          price?: number
          promotion_end_date?: string | null
          promotion_start_date?: string | null
          promotion_type?: string | null
          promotion_value?: number | null
          stock?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          cupcake_id: number
          id: number
          order_id: number
          price_at_time: number
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cupcake_id: number
          id?: number
          order_id: number
          price_at_time: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cupcake_id?: number
          id?: number
          order_id?: number
          price_at_time?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_cupcake_id_fkey"
            columns: ["cupcake_id"]
            isOneToOne: false
            referencedRelation: "cupcakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          payment_id: string | null
          payment_status: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          payment_id?: string | null
          payment_status?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          payment_id?: string | null
          payment_status?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          additional_info: string | null
          address: string | null
          cep: string | null
          city: string | null
          complement: string | null
          cpf: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          neighborhood: string | null
          number: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
