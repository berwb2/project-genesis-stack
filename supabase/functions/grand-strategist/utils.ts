
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function validateInput(prompt: string): void {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt is required and cannot be empty');
  }
}

export function validateEnvironment(): { supabaseUrl: string; supabaseServiceKey: string } {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
  }

  return { supabaseUrl, supabaseServiceKey };
}

export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  
  return authHeader.replace('Bearer ', '');
}
