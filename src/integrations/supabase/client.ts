// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qgbxtpnqvejebgauqdlv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnYnh0cG5xdmVqZWJnYXVxZGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDc0ODUsImV4cCI6MjA1ODY4MzQ4NX0.YH26Jn3lMicXGunzqHQQq3QhQ7TbK2imPWHwgIeud_4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);