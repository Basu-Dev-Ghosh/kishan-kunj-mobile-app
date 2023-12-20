import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import HeaderIcon from '../components/HeaderIcon';
import UsersList from '../components/UsersList';
import {NavigationProp} from '@react-navigation/native';

const SelectUserScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon />
        <View style={styles.contentSection}>
          <View
            style={{
              paddingHorizontal: 30,
              marginTop: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 26,
                color: '#000',
                fontWeight: 'bold',
              }}>
              Select User
            </Text>

            <UsersList navigation={navigation} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectUserScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  hr: {
    marginTop: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginLeft: 15,
  },
});
