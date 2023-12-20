import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import HeaderIcon from '../components/HeaderIcon';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <HeaderIcon />
        <View
          style={[
            styles.container,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <ActivityIndicator size="large" color="#1000F0" />

          <Text style={{color: '#1000F0', fontSize: 20, marginLeft: 12}}>
            Loading...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
});
