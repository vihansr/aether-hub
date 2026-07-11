import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Anon Key insertion into aether_user_activities...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const dummyLog = {
    name: "Test User",
    email: "test@example.com",
    week_start_date: "2026-07-06",
    activity_log: {
      todos: [{ id: "t1", text: "Test Supabase integration", completed: true }]
    }
  };

  // Try inserting
  const { data: insertData, error: insertError } = await supabase
    .from('aether_user_activities')
    .upsert(dummyLog, { onConflict: 'email,week_start_date' })
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message);
  } else {
    console.log('✅ Upsert succeeded! Data:', insertData);
  }

  // Try reading
  const { data: readData, error: readError } = await supabase
    .from('aether_user_activities')
    .select('*')
    .eq('email', 'test@example.com');

  if (readError) {
    console.error('❌ Read failed:', readError.message);
  } else {
    console.log('✅ Read succeeded! Data:', readData);
  }
}

main();
