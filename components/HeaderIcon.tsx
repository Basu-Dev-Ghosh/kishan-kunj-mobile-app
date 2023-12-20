import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationProp} from '@react-navigation/native';

import {useAuthState} from '../store/AuthStore';
import {supabase} from '../supabase/supabase.config';

const HeaderIcon = ({
  user,
  back,
  navigation,
}: {
  user?: User | null;
  back?: boolean;
  navigation?: NavigationProp<any, any>;
}) => {
  const signOut = useAuthState(state => state.signOut);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigation?.navigate('After Logout Screen');
      }
    });
  }, []);

  return (
    <SafeAreaView style={[styles.header]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {back && (
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Icon
              name="arrow-left"
              size={24}
              color="#000"
              style={{marginRight: 15}}
            />
          </TouchableOpacity>
        )}

        <Icon name="home" size={44} color="#1000F0" />
        <Text style={styles.logoTitle}>KISHAN{'\n'}KUNJ</Text>
      </View>
      {user && (
        <TouchableOpacity
          onPress={() => navigation?.navigate('Profile Screen')}>
          <Image
            source={{uri: user?.image}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 400 / 2,
            }}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default HeaderIcon;

const styles = StyleSheet.create({
  header: {
    height: 100,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  logoTitle: {
    fontSize: 16,
    fontFamily: 'Aclonica-Regular',
    marginLeft: 2,
    color: '#000',
  },
});
