import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hexogatjhjrmbicxokns.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleG9nYXRqaGpybWJpY3hva25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzg1MDksImV4cCI6MjA2NzExNDUwOX0.5v8GU43LQbX3Q9a9KmrWj6HNYzNyj5KhOif0K6X73pA';

export const supabase = createClient(supabaseUrl, supabaseKey);