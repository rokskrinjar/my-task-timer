import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: 'admin' | 'user' | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    console.log('useAuth: Setting up auth listener');
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change event:', event, session ? `user: ${session.user.email}` : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile and assign default role if user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            // Create profile
            const { error } = await supabase
              .from('profiles')
              .upsert({
                user_id: session.user.id,
                display_name: session.user.user_metadata?.display_name || 'Neimenovan igralec'
              }, {
                onConflict: 'user_id'
              });
            
            if (error) {
              console.error('Error creating profile:', error);
            }

            // Assign default user role if not exists
            const { error: roleError } = await supabase
              .from('user_roles')
              .upsert({
                user_id: session.user.id,
                role: 'user'
              }, {
                onConflict: 'user_id,role'
              });

            if (roleError) {
              console.error('Error creating user role:', roleError);
            }

            // Fetch user role
            fetchUserRole(session.user.id);
          }, 0);
        } else if (session?.user) {
          // Fetch role for existing sessions
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          // Clear role when signed out
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial session check:', session ? `user: ${session.user.email}` : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for userId:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('role', { ascending: true }) // admin comes before user
        .limit(1)
        .single();

      console.log('User role query result:', { data, error });

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching user role:', error);
        setUserRole('user'); // default to user role
      } else {
        const role = data?.role || 'user';
        console.log('Setting user role to:', role);
        setUserRole(role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // default to user role
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear local state regardless of server response
      setSession(null);
      setUser(null);
      setUserRole(null);
      
      // Handle session_not_found as success (user already logged out)
      if (error && !error.message.includes('session_not_found')) {
        console.error('Logout error:', error);
        toast({
          title: "Logout warning",
          description: "You've been logged out, but there was a minor issue clearing your session.",
          variant: "default",
        });
      } else {
        toast({
          title: "Successfully logged out",
          description: "You've been logged out successfully.",
          variant: "default",
        });
      }
      
      // Force navigation to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Force clear local state even on error
      setSession(null);
      setUser(null);
      setUserRole(null);
      
      toast({
        title: "Logged out",
        description: "You've been logged out (with local cleanup).",
        variant: "default",
      });
      
      // Force navigation even on error
      window.location.href = '/';
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};