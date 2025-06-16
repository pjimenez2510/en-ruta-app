import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_API_STORAGE_PASSWORD
export const supabase = createClient(supabaseUrl!, supabaseKey!);
