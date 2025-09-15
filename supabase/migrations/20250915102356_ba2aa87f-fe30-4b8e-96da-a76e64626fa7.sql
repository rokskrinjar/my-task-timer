-- Add email column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email text;

-- Drop and recreate the get_admin_safe_profiles function with email
DROP FUNCTION IF EXISTS public.get_admin_safe_profiles();

CREATE OR REPLACE FUNCTION public.get_admin_safe_profiles()
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  display_name text, 
  email text,
  skill_level text, 
  location text, 
  bio text, 
  avatar_url text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.email,
    p.skill_level,
    p.location,
    p.bio,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE has_role(auth.uid(), 'admin');
$function$;

-- Migrate existing users: populate missing names and emails from auth.users metadata
UPDATE public.profiles 
SET 
  display_name = COALESCE(
    NULLIF(display_name, 'Neimenovan igralec'),
    (SELECT COALESCE(
      au.raw_user_meta_data->>'full_name',
      au.raw_user_meta_data->>'name',
      split_part(au.email, '@', 1)
    ) FROM auth.users au WHERE au.id = profiles.user_id)
  ),
  email = (SELECT au.email FROM auth.users au WHERE au.id = profiles.user_id)
WHERE display_name = 'Neimenovan igralec' OR email IS NULL;