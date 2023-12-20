import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderIcon from '../components/HeaderIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useCurrentUser} from '../store/UserStore';
import * as Progress from 'react-native-progress';
import {NavigationProp} from '@react-navigation/native';
import {useAuthState} from '../store/AuthStore';

const PasswordScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const [password, setPassword] = useState<string>('');
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const user = useCurrentUser(state => state.currentUser);
  const [signIn, isLoggingIn] = useAuthState(state => [
    state.signIn,
    state.loading,
  ]);

  const logIn = async () => {
    const {data, error} = await signIn(user?.email as string, password);
    if (error) setError(error as string);
    if (data) navigation.navigate('Home Screen');
  };

  useEffect(() => {
    if (!password) setError(null);
  }, [password]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon />
        <View style={styles.contentSection}>
          <View
            style={{
              alignItems: 'center',
              flex: 3,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 26,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {user?.displayName}'s Password
            </Text>

            <View
              style={{
                width: '90%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.passwordContainer}>
                <Icon name="lock" color="#0000009b" size={24} />
                <TextInput
                  placeholderTextColor="#000"
                  style={styles.inputStyle}
                  autoCorrect={false}
                  secureTextEntry={isSecure}
                  placeholder="Password"
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                  <Icon
                    name={isSecure ? 'eye-slash' : 'eye'}
                    color="#0000009c"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              {error && (
                <View
                  style={{width: '100%', paddingHorizontal: 20, paddingTop: 6}}>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {error}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={{width: '100%', alignItems: 'flex-end', marginTop: 10}}>
                <Text style={{color: '#000'}}>Forget password ?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                logIn();
              }}>
              {isLoggingIn ? (
                <Progress.Circle color="white" size={30} indeterminate={true} />
              ) : (
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
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },

  passwordContainer: {
    width: '100%',
    marginTop: 30,

    padding: 20,
    elevation: 10,
    shadowColor: '#d9d9d959',
    borderRadius: 10,
    backgroundColor: '#d9d9d959',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#1000F0',
    width: '90%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    elevation: 12,
  },
});
