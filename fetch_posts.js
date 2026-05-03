const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://joswtjxqnhvxfelyuxxv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvc3d0anhxbmh2eGZlbHl1eHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTczMzIsImV4cCI6MjA4ODQzMzMzMn0.FAR42on1p_D8dYBumY92yq4Rt8D6bwyArHchdW5nHiA'
);

async function run() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(5);
  console.log(JSON.stringify({ data, error }, null, 2));
}

run();
