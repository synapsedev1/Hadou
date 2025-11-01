// IMPORTANT:
// 1. Create a Supabase project at https://supabase.com/
// 2. Go to "Settings" > "API" in your Supabase project dashboard.
// 3. Find your Project URL and anon public key.
// 4. Replace the placeholder values below with your actual Supabase URL and key.
//    It is highly recommended to use environment variables for this in a real project.

declare global {
  interface Window {
    supabase: {
      createClient: (url: string, key: string) => any;
    };
  }
}

const { createClient } = window.supabase;

const supabaseUrl = 'https://ccfpxnpjrfqjkczyluuf.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZnB4bnBqcmZxamtjenlsdXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NzQwNjAsImV4cCI6MjA3NzU1MDA2MH0.9O1Wn8fjkTQJX4CIH0y3bYjYYzAOXueT3B8XyuHsPyo'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);