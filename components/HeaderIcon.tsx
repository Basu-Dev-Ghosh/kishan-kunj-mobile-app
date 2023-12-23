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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{marginRight: 24}}
            onPress={() => navigation?.navigate('Notification Screen')}>
            <Icon name="bell-o" color={'#1000F0'} size={30} />
          </TouchableOpacity>
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
        </View>
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
