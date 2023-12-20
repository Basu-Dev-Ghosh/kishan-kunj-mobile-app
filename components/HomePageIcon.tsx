import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationProp} from '@react-navigation/native';
const HomePageIcon = ({
  navigation,
}: {
  navigation?: NavigationProp<any, any>;
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
        <View style={styles.logoIcon}>
          <Icon name="home" size={54} color="#1000F0" />
        </View>
        <Text style={styles.logoTitle}>KISHAN KUNJ</Text>

        <Text
          style={{
            fontSize: 10,
            textAlign: 'center',
            alignSelf: 'center',
            opacity: 0.8,
          }}>
          A Diary app for tracking expenses for our daily grocery
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation?.navigate('Select User Screen')}>
          <View
            style={{
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white'}}>Continue</Text>
            <Icon
              name="chevron-right"
              style={{marginLeft: 10, marginTop: 2}}
              size={13}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoTitle: {
    fontSize: 36,
    fontFamily: 'Aclonica-Regular',
    color: '#000',
    marginTop: -10,
  },
  logoIcon: {
    width: '100%',
    alignItems: 'flex-end',
  },
  continueButton: {
    backgroundColor: '#1000F0',
    width: '80%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 12,
  },
});

export default HomePageIcon;
