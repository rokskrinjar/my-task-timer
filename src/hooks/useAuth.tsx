import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile if user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
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
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear local state regardless of server response
      setSession(null);
      setUser(null);
      
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
      
      toast({
        title: "Logged out",
        description: "You've been logged out (with local cleanup).",
        variant: "default",
      });
      
      // Force navigation even on error
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
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