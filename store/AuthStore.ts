import {create} from 'zustand';
import {supabase} from '../supabase/supabase.config';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface authState {
  authenticated: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string | null,
  ) => Promise<
    {data: string | undefined; error: null} | {data: null; error: unknown}
  >;
  signOut: () => void;
  checkSession: () => void;
}

export const useAuthState = create(
  persist<authState>(
    (set, get) => ({
      authenticated: 'checking',
      loading: false,
      signIn: async (email, password) => {
        try {
          if (!password) {
            throw new Error('Password is required');
          }

          set({loading: true});
          const loggedIn = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (!loggedIn.data || loggedIn.error) {
            throw new Error(loggedIn.error?.message || 'Error logging in');
          }
          set({authenticated: loggedIn.data.user.email, loading: false});

          return {data: loggedIn.data.user?.email, error: null};
        } catch (error: any) {
          const errorMessage = error?.message || 'Login failed';

          set({loading: false});
          return {data: null, error: errorMessage};
        }
      },
      signOut: () => {
        supabase.auth.signOut();
        set({authenticated: null});
      },
      checkSession: async () => {
        const {data, error} = await supabase.auth.getSession();
        if (data) {
          set({authenticated: data.session?.user.email});
        } else {
          set({authenticated: null});
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
