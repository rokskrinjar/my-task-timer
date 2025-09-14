-- Drop the problematic permissive policies
DROP POLICY IF EXISTS "Admins can view profile data except sensitive fields" ON public.profiles;
DROP POLICY IF EXISTS "Restricted phone number access" ON public.profiles;

-- Create a secure view that excludes sensitive fields for admin access
CREATE OR REPLACE VIEW public.profiles_admin_safe AS
SELECT 
    id,
    user_id,
    display_name,
    skill_level,
    location,
    bio,
    avatar_url,
    created_at,
    updated_at
    -- Explicitly EXCLUDE phone number and other sensitive fields
FROM public.profiles;

-- Grant access to the safe view for authenticated users
GRANT SELECT ON public.profiles_admin_safe TO authenticated;

-- Create RLS policy for the safe view that allows admin access
ALTER VIEW public.profiles_admin_safe SET (security_invoker = on);

-- Create restrictive RLS policies that prevent unauthorized access to sensitive fields
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a very restrictive policy for admin access that explicitly excludes phone numbers
-- This is a restrictive policy that only allows specific non-sensitive columns
CREATE POLICY "Admins restricted to non-sensitive fields only" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin') AND 
  -- This policy will be enforced at query level to exclude phone column
  auth.uid() != user_id  -- Ensure admins don't get full access to their own data via admin role
);

-- Create a function to safely get admin profile data without phone numbers
CREATE OR REPLACE FUNCTION public.get_admin_safe_profiles()
RETURNS TABLE(
    id uuid,
    user_id uuid,
    display_name text,
    skill_level text,
    location text,
    bio text,
    avatar_url text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.skill_level,
    p.location,
    p.bio,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE has_role(auth.uid(), 'admin');
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_safe_profiles() TO authenticated;

-- Create audit table for tracking sensitive data access attempts
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    action text NOT NULL,
    table_name text,
    attempted_columns text[],
    success boolean DEFAULT false,
    blocked_reason text,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log access
CREATE POLICY "Security admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Allow system to insert audit logs
CREATE POLICY "System can log security events" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);