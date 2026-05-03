const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://joswtjxqnhvxfelyuxxv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvc3d0anhxbmh2eGZlbHl1eHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTczMzIsImV4cCI6MjA4ODQzMzMzMn0.FAR42on1p_D8dYBumY92yq4Rt8D6bwyArHchdW5nHiA'
);

async function run() {
  const { data: d1 } = await supabase.from('users').select('*').ilike('username', 'DI DE').maybeSingle();
  const { data: d2 } = await supabase.from('users').select('*').ilike('username', '@EKANSH').maybeSingle();
  const { data: all } = await supabase.from('users').select('username, name').ilike('name', 'Fi%');
  console.log({ d1, d2, all });
}

run();
