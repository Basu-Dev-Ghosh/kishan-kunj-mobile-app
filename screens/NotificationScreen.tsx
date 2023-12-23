import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderIcon from '../components/HeaderIcon';
import {useCurrentUser} from '../store/UserStore';
import {NavigationProp} from '@react-navigation/native';
import NotificationTabs from '../components/NotificationTabs';

const NotificationScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back navigation={navigation} />
     
          <View style={styles.contentSection}>
            <NotificationTabs />
          </View>
      
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
});
