import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface HealthcareProvider {
  id: string;
  user_id: string;
  provider_type: string;
  first_name: string;
  last_name: string;
  email: string;
  license_number?: string;
  is_active: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [provider, setProvider] = useState<HealthcareProvider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer provider data fetching to prevent deadlock
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: providerData } = await supabase
                .from('healthcare_providers')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              setProvider(providerData);
            } catch (error) {
              console.error('Error fetching provider data:', error);
              setProvider(null);
            }
          }, 0);
        } else {
          setProvider(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: providerData } = await supabase
              .from('healthcare_providers')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            setProvider(providerData);
          } catch (error) {
            console.error('Error fetching provider data:', error);
            setProvider(null);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    provider,
    loading,
    signOut,
    isAuthenticated: !!user,
    isAdmin: provider?.provider_type === 'admin',
    isDoctor: provider?.provider_type === 'doctor',
    isNurse: provider?.provider_type === 'nurse',
  };
};