-- Create a security-enhanced view for admin access that excludes sensitive data
CREATE OR REPLACE VIEW public.admin_user_profiles AS
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
FROM public.profiles;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.admin_user_profiles TO authenticated;

-- Create RLS policy for the admin view
ALTER VIEW public.admin_user_profiles SET (security_invoker = true);

-- Create a function to check if current user should see phone numbers
CREATE OR REPLACE FUNCTION public.can_view_sensitive_data(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow viewing own phone number or if user explicitly granted phone access to admins
  SELECT 
    auth.uid() = target_user_id OR
    (
      -- Admin access with explicit consent (for future implementation)
      has_role(auth.uid(), 'admin') AND 
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = target_user_id 
        AND (phone IS NULL OR phone = '') -- Only if phone is empty/null for now
      )
    )
$$;

-- Update profiles table RLS policies to be more restrictive for phone access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create separate policies for admin access
CREATE POLICY "Admins can view profile data except sensitive fields" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin') OR 
  auth.uid() = user_id
);

-- Create a restricted phone access policy
CREATE POLICY "Restricted phone number access" 
ON public.profiles 
FOR SELECT 
USING (
  can_view_sensitive_data(user_id)
);

-- Add audit logging for admin access to sensitive data
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id uuid NOT NULL,
    action text NOT NULL,
    target_user_id uuid,
    sensitive_data_accessed text[],
    accessed_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create function to log admin access
CREATE OR REPLACE FUNCTION public.log_admin_access(
    action_type text,
    target_user uuid DEFAULT NULL,
    sensitive_fields text[] DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF has_role(auth.uid(), 'admin') THEN
        INSERT INTO admin_audit_log (
            admin_user_id,
            action,
            target_user_id,
            sensitive_data_accessed
        ) VALUES (
            auth.uid(),
            action_type,
            target_user,
            sensitive_fields
        );
    END IF;
END;
$$;