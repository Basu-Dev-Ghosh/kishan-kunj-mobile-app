import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import HeaderIcon from '../components/HeaderIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCurrentUser} from '../store/UserStore';
import {NavigationProp} from '@react-navigation/native';
import {Switch} from 'react-native-switch';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {supabase} from '../supabase/supabase.config';
import {launchImageLibrary} from 'react-native-image-picker';
import {decode} from 'base64-arraybuffer';
import {useAuthState} from '../store/AuthStore';
import {useQuery} from '@tanstack/react-query';
import {getTotalSpend} from '../utils/item.utils';
const ProfileScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [passwordChangeModal, setPasswordChangeModal] =
    useState<boolean>(false);
  const [user, changePresent, changePhoto] = useCurrentUser(state => [
    state.currentUser,
    state.changePresent,
    state.changePhoto,
  ]);
  const signout = useAuthState(state => state.signOut);
  const {data: totalSpend} = useQuery<number | undefined>({
    queryKey: ['total_spend', user?.id],
    queryFn: () => getTotalSpend(user?.id || 0),
    enabled: !!user?.id,
  });
  async function changePassword() {
    try {
      const {data, error} = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        setError(null);
        setNewPassword('');
        Alert.alert('Success', 'Password changed successfully');
        setPasswordChangeModal(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  function logOut() {
    signout();
    navigation.navigate('After Logout Screen');
  }
  async function uploadPhoto() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 400,
        maxWidth: 400,
      });
      if (!result.didCancel) {
        const img = result?.assets?.[0];
        const base64 = img?.base64;
        const filePath = `${img?.fileName}`;
        const contentType = img?.type;
        const {data, error} = await supabase.storage
          .from('user_images')
          .upload(filePath, decode(base64 as string), {
            contentType,
            upsert: true,
          });
        if (error) {
          console.log(error);
          throw new Error(error.message);
        }
        if (data) {
          changePhoto(
            `https://yxzmhgkrjzcahpunapoj.supabase.co/storage/v1/object/public/user_images/${data.path}`,
          );
        }
      }
    } catch (err) {
      // console.log(err);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back={true} navigation={navigation} />

        <View style={styles.contentSection}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                elevation: 10,
                backgroundColor: '#fff',
                borderRadius: 20,
                width: 100,
              }}>
              <Image
                source={{uri: user?.image}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 20,
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  color: '#000',
                  fontSize: 26,
                  fontWeight: 'bold',
                  marginLeft: 20,
                }}>
                {user?.fullName}
              </Text>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  marginLeft: 20,
                }}>
                {user?.department}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}>
                <Text style={{marginRight: 6, fontSize: 16, color: 'black'}}>
                  Present
                </Text>
                <Switch
                  value={user?.ispresent}
                  onValueChange={changePresent}
                  circleSize={30}
                  barHeight={30}
                  circleBorderWidth={3}
                  backgroundActive={'#1000F0'}
                  backgroundInactive={'gray'}
                  circleActiveColor={'#fff'}
                  circleInActiveColor={'#000000'}
                  changeValueImmediately={true}
                  renderActiveText={false}
                  renderInActiveText={false}
                />
              </View>
            </View>
          </View>
          <View style={styles.profileUpdatesContainer}>
            <View style={styles.expensesSpendBox}>
              <Text style={{fontSize: 11, color: 'white', opacity: 0.9}}>
                Total Expenses Spend
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="rupee" size={26} color="white" />
                <Text
                  style={{
                    fontSize: 30,
                    color: 'white',
                    fontWeight: 'bold',
                    marginLeft: 6,
                  }}>
                  {totalSpend?.toFixed(2) ?? 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setPasswordChangeModal(true)}
                style={[styles.changePasswordContainer, {marginRight: 15}]}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="lock" size={26} color="black" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      marginLeft: 6,
                      textAlign: 'center',
                    }}>
                    Change Password
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changePasswordContainer}
                onPress={uploadPhoto}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="image" size={26} color="black" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      marginLeft: 6,
                      textAlign: 'center',
                    }}>
                    Change Photo
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{height: 64, marginTop: 20}}>
              <TouchableOpacity
                style={styles.changePasswordContainer}
                onPress={logOut}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Icon name="unlink" size={20} color="black" />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      marginLeft: 6,
                      textAlign: 'center',
                    }}>
                    Log out
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        isVisible={passwordChangeModal}>
        <View
          style={{
            width: '100%',

            padding: 18,
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 10,
          }}>
          <View style={styles.passwordContainer}>
            <Icon name="lock" color="#0000009b" size={24} />
            <TextInput
              placeholderTextColor="#000"
              style={styles.inputStyle}
              autoCorrect={false}
              placeholder="New Password"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
          </View>
          {error && (
            <View style={{paddingHorizontal: 20, marginTop: 6}}>
              <Text style={{color: 'red'}}>{error}</Text>
            </View>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setNewPassword('');
                setError(null);
                setPasswordChangeModal(false);
              }}
              style={[
                styles.continueButton,
                {marginRight: 10, backgroundColor: '#FFFF'},
              ]}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="close"
                  style={{marginRight: 10, marginTop: 2}}
                  size={13}
                  color="#000"
                />
                <Text style={{color: 'black'}}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={changePassword}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="save"
                  style={{marginRight: 10, marginTop: 2}}
                  size={13}
                  color="#fff"
                />
                <Text style={{color: 'white'}}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  profileUpdatesContainer: {
    marginTop: 20,
    width: '100%',
    flex: 1,
    padding: 20,
  },
  expensesSpendBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#1000F0',
    shadowColor: '#1000F0',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    padding: 20,
  },
  changePasswordContainer: {
    flex: 1,
    height: 100,
    backgroundColor: '#d9d9d947',
    shadowColor: '#d9d9d947',
    borderRadius: 10,
    elevation: 5,
    padding: 20,
  },
  passwordContainer: {
    marginTop: 10,
    padding: 10,
    elevation: 10,
    shadowColor: '#d9d9d959',
    borderRadius: 8,
    backgroundColor: '#d9d9d959',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#1000F0',
    width: '40%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 12,
    flex: 1,
  },
});
