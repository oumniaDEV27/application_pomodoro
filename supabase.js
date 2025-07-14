// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://opgzldzlpnjhkkrrumpt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZ3psZHpscG5qaGtrcnJ1bXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Mjg1NTUsImV4cCI6MjA2NzUwNDU1NX0.ivHazHj-mJdpDlPR7FgqCJ6T6b4UYsuhYO2JcQCI1A4'; // ta vraie clé ici

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
