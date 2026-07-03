export type CommentKind = "same_experience" | "advice" | "hug";

export type Profile = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  is_anonymous: boolean;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  kind: CommentKind;
  is_anonymous: boolean;
  created_at: string;
};

export type Couple = {
  id: string;
  invite_code: string;
  created_by: string;
  partner_id: string | null;
  created_at: string;
  bound_at: string | null;
};

export type CoupleDiary = {
  id: string;
  couple_id: string;
  author_id: string;
  content: string;
  mood: string | null;
  created_at: string;
};

type Table<Row, Insert, Update> = {
  Row: Row & Record<string, unknown>;
  Insert: Insert & Record<string, unknown>;
  Update: Update & Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string }, Partial<Profile>>;
      posts: Table<Post, Omit<Post, "id" | "created_at"> & { id?: string; created_at?: string }, Partial<Post>>;
      comments: Table<Comment, Omit<Comment, "id" | "created_at"> & { id?: string; created_at?: string }, Partial<Comment>>;
      couples: Table<
        Couple,
        Omit<Couple, "id" | "created_at" | "bound_at"> & {
          id?: string;
          created_at?: string;
          bound_at?: string | null;
        },
        Partial<Couple>
      >;
      couple_diaries: Table<
        CoupleDiary,
        Omit<CoupleDiary, "id" | "created_at"> & { id?: string; created_at?: string },
        Partial<CoupleDiary>
      >;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      comment_kind: CommentKind;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
