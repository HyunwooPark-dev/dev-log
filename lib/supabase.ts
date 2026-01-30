import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization to avoid build-time errors
let supabaseClient: SupabaseClient | null = null
let supabaseAdminClient: SupabaseClient | null = null

// Client-side Supabase client (limited permissions)
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client (full permissions)
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase admin environment variables")
    }

    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabaseAdminClient
}

// Vector search function using pgvector
export async function searchSimilarLogs(
  embedding: number[],
  userId: string,
  limit: number = 10,
  threshold: number = 0.7
) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.rpc("match_logs", {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: limit,
    user_id: userId,
  })

  if (error) {
    console.error("Vector search error:", error)
    throw error
  }

  return data
}

/*
-- Supabase SQL function for vector similarity search
-- Run this in Supabase SQL Editor to set up pgvector search:

-- Enable pgvector extension
create extension if not exists vector;

-- Create the similarity search function
create or replace function match_logs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  user_id text
)
returns table (
  id text,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    l.id,
    l.content,
    1 - (e.vector <=> query_embedding) as similarity
  from "Embedding" e
  inner join "Log" l on l.id = e."logId"
  where l."userId" = user_id
    and 1 - (e.vector <=> query_embedding) > match_threshold
  order by e.vector <=> query_embedding
  limit match_count;
end;
$$;
*/
