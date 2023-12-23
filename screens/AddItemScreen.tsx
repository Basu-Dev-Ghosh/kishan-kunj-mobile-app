import {
  FlatList,
  Image,
  RefreshControl,
 
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderIcon from '../components/HeaderIcon';
import {useCurrentUser} from '../store/UserStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useCategory} from '../store/CategoryStore';
import * as Progress from 'react-native-progress';
import {NavigationProp} from '@react-navigation/native';
import {createItem} from '../utils/item.utils';
import {queryClient} from '../App';
import {Switch} from 'react-native-switch';
import {useQuery} from '@tanstack/react-query';
import {getOnlineUsers, updatePresentToDB} from '../utils/user.util';
const AddItemScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  const selectedCategory = useCategory(state => state.category);
  const [error, setError] = useState<string | null>(null);
  const [isItemAdding, setIsItemAdding] = useState<boolean>(false);
  const [item, setItem] = useState<Item>({
    description: '',
    price: 0,
    categoryId: selectedCategory?.id || 1,
    userId: user?.id || 1,
  });

  const {data: onlineUsers, isLoading} = useQuery<User[] | null>({
    queryKey: ['online_users', user?.id],
    queryFn: getOnlineUsers,
    enabled: !!user?.id,
  });
  async function addItem() {
    try {
      if (item.description.length < 2) {
        throw new Error('Please enter item description');
      }
      if (item.price === 0) {
        throw new Error('Please enter item price');
      }

      if (isNaN(item.price)) throw new Error('Invalid price');
      if (!user?.ispresent) throw new Error('Please mark your presence');

      const {error} = await createItem(item);

      if (error) throw new Error(error.message);
      queryClient.refetchQueries({
        queryKey: ['recent_items', user?.id],
      });
      navigation.navigate('Home Screen');
    } catch (err: any) {
      setError(err.message);
    }
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back navigation={navigation} />
     
          <View style={styles.contentSection}>
            <View
              style={{
                marginTop: 10,
                alignItems: 'center',
                flex: 4,
              }}>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 26,
                  color: '#000',
                  fontWeight: 'bold',
                }}>
                {selectedCategory?.name}'s Details
              </Text>

              <View
                style={{
                  width: '80%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={styles.passwordContainer}>
                  <Icon
                    name="shopping-cart"
                    color="#0000009b"
                    size={24}
                    style={{marginTop: 10}}
                  />
                  <TextInput
                    placeholderTextColor="#000"
                    multiline={true}
                    numberOfLines={4}
                    style={[
                      styles.inputStyle,
                      {height: 100, textAlignVertical: 'top'},
                    ]}
                    autoCorrect={false}
                    placeholder="Item description"
                    value={item.description}
                    onChangeText={text => setItem({...item, description: text})}
                  />
                </View>
                <View style={styles.passwordContainer}>
                  <Icon
                    name="rupee"
                    color="#0000009b"
                    size={24}
                    style={{marginTop: 12}}
                  />
                  <TextInput
                    placeholderTextColor="#000"
                    style={styles.inputStyle}
                    autoCorrect={false}
                    keyboardType="numeric"
                    placeholder="Item price"
                    onChangeText={text =>
                      setItem({
                        ...item,
                        price: +text,
                      })
                    }
                  />
                </View>
                {error && (
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingTop: 6,
                    }}>
                    <Text style={{color: 'red', fontWeight: 'bold'}}>
                      {error}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                flex: 0.7,
                alignItems: 'center',
                marginTop: 15,
              }}>
              <TouchableOpacity style={styles.continueButton} onPress={addItem}>
                {isItemAdding ? (
                  <Progress.Circle
                    color="white"
                    size={30}
                    indeterminate={true}
                  />
                ) : (
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Add</Text>
                    <Icon
                      name="plus"
                      style={{marginLeft: 10, marginTop: 2}}
                      size={18}
                      color="#fff"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 30,
                alignItems: 'flex-start',
                flex: 2,
                paddingHorizontal: 48,
              }}>
              <Text style={{color: '#000'}}>Present users</Text>
              {onlineUsers && onlineUsers?.length === 0 ? (
                <Text
                  style={{marginTop: 20, color: '#000', textAlign: 'center'}}>
                  No Present Users Right Now
                </Text>
              ) : (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={isLoading}
                      onRefresh={() => {
                        queryClient.refetchQueries({
                          queryKey: ['online_users', user?.id],
                        });
                      }}
                      // progressViewOffset={-400}
                      style={{top: 10, zIndex: 100}}
                      progressBackgroundColor={'#fff'}
                    />
                  }
                  data={onlineUsers}
                  renderItem={renderItem}
                  keyExtractor={item => item?.id?.toString() ?? ''}
                />
              )}
            </View>
          </View>
      
      </View>
    </SafeAreaView>
  );
};
const renderItem = ({item}: {item: User}) => {
  return <UserList user={item} />;
};

const updateUserPresent = async (email: string, setPresent: any) => {
  try {
    setPresent(false);
    await updatePresentToDB(false, email);
    setTimeout(() => {
      queryClient.refetchQueries({
        queryKey: ['online_users', useCurrentUser.getState().currentUser?.id],
      });
      queryClient.refetchQueries({
        queryKey: ['users'],
      });
    }, 500);
  } catch (err) {
    setPresent(true);
  }
};
const UserList = ({user}: {user: User}) => {
  const [present, setPresent] = useState<boolean>(user.ispresent);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: user.image}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 400 / 2,
          }}
        />
        <Text style={{color: '#000', marginLeft: 10}}>{user.displayName}</Text>
      </View>

      <Switch
        value={present}
        onValueChange={() => updateUserPresent(user.email, setPresent)}
        circleSize={23}
        barHeight={23}
        circleBorderWidth={1}
        backgroundActive={'#1000F0'}
        backgroundInactive={'gray'}
        circleActiveColor={'#fff'}
        circleInActiveColor={'#000000'}
        changeValueImmediately={true}
        renderActiveText={false}
        renderInActiveText={false}
      />
    </View>
  );
};
export default AddItemScreen;

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
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 18,
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#1000F0',
    width: '80%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 12,
  },
});
