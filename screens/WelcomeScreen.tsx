import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import HomePageIcon from '../components/HomePageIcon';
import HeaderIcon from '../components/HeaderIcon';
import {NavigationProp} from '@react-navigation/native';
const WelcomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon />
        <View style={styles.contentSection}>
          <HomePageIcon navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: 100,
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
