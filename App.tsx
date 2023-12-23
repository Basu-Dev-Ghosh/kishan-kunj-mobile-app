import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectUserScreen from './screens/SelectUserScreen';
import PasswordScreen from './screens/PasswordScreen';
import HomeScreen from './screens/HomeScreen';

import AllExpensesScreen from './screens/AllExpensesScreen';
import CalculationResultScreen from './screens/CalculationResultScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemCategoryScreen from './screens/ItemCategoryScreen';
import AddItemScreen from './screens/AddItemScreen';
import SplashScreen from 'react-native-splash-screen';

// Fo offline data getting
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

import {useAuthState} from './store/AuthStore';
import LoadingScreen from './screens/LoadingScreen';
import FilterScreen from './screens/FilterScreen';
import NotificationScreen from './screens/NotificationScreen';
import {supabase} from './supabase/supabase.config';
import {useCurrentUser} from './store/UserStore';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

const App = () => {
  const [authenticated, checkSession] = useAuthState(state => [
    state.authenticated,
    state.checkSession,
  ]);

  useEffect(() => {
    const items = supabase
      .channel('postgresChangesChannel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        payload =>
          queryClient.refetchQueries({
            queryKey: [
              'all_items',
              useCurrentUser.getState().currentUser?.id,
              '',
            ],
          }),
      )
      .subscribe();
    return () => {
      items.unsubscribe();
    };
  }, []);

  useEffect(() => {
    checkSession();

    SplashScreen.hide();
    return NetInfo.addEventListener(state => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
              animationTypeForReplace: authenticated ? 'pop' : 'push',
            }}
            name="Welcome Screen"
            component={
              authenticated === 'checking'
                ? LoadingScreen
                : authenticated
                ? HomeScreen
                : WelcomeScreen
            }
          />

          <Stack.Screen
            options={{headerShown: false}}
            name="Select User Screen"
            component={SelectUserScreen}
          />

          <Stack.Screen
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
            name="Password Screen"
            component={PasswordScreen}
          />

          <Stack.Screen
            options={{headerShown: false}}
            name="Home Screen"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="All Expenses Screen"
            component={AllExpensesScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Calculation Result Screen"
            component={CalculationResultScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Profile Screen"
            component={ProfileScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Item Category Screen"
            component={ItemCategoryScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Add Item Screen"
            component={AddItemScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Notification Screen"
            component={NotificationScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              animationTypeForReplace: authenticated ? 'pop' : 'push',
            }}
            name="After Logout Screen"
            component={WelcomeScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="Filter Screen"
            component={FilterScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
