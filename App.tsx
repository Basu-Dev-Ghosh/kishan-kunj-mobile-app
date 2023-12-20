import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectUserScreen from './screens/SelectUserScreen';
import PasswordScreen from './screens/PasswordScreen';
import HomeScreen from './screens/HomeScreen';
import {MenuProvider} from 'react-native-popup-menu';
import AllExpensesScreen from './screens/AllExpensesScreen';
import CalculationResultScreen from './screens/CalculationResultScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemCategoryScreen from './screens/ItemCategoryScreen';
import AddItemScreen from './screens/AddItemScreen';
import {supabase} from './supabase/supabase.config';
import {Session} from '@supabase/supabase-js';
import SplashScreen from 'react-native-splash-screen';
import {useCurrentUser} from './store/UserStore';

// Fo offline data getting
import {onlineManager, QueryClient} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthState} from './store/AuthStore';
import LoadingScreen from './screens/LoadingScreen';
import FilterScreen from './screens/FilterScreen';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

const App = () => {
  const [authenticated, checkSession] = useAuthState(state => [
    state.authenticated,
    state.checkSession,
  ]);

  useEffect(() => {
    checkSession();
    SplashScreen.hide();
    return NetInfo.addEventListener(state => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });
  }, []);

  return (
    <PersistQueryClientProvider
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
      persistOptions={{persister}}
      client={queryClient}>
      <MenuProvider>
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
      </MenuProvider>
    </PersistQueryClientProvider>
  );
};

export default App;
