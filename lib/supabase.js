import { createClient } from "@supabase/supabase-js";

// createClient connects us to our Supabase project
// NEXT_PUBLIC_ vars are safe to use in the browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Save a thumbs up or down for a piece of content
export async function saveFeedback({ topic, contentType, title, vote }) {
  const { error } = await supabase
    .from("feedback")
    .insert({ topic, content_type: contentType, title, vote });

  if (error) console.error("Feedback save failed:", error.message);
}
