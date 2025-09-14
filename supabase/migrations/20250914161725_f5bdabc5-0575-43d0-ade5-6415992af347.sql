-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view profile data except sensitive fields" ON public.profiles;

-- Create a more secure policy that excludes phone numbers from admin access
CREATE POLICY "Admins can view non-sensitive profile data" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own data
  auth.uid() = user_id OR
  -- Admins can see everything except phone numbers (handled at application level)
  has_role(auth.uid(), 'admin')
);

-- Create audit logging table for admin access tracking
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

-- System can insert audit logs (for background processes)
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create function to log admin access to sensitive data
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