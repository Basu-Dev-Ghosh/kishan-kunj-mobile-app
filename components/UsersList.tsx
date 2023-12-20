import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp} from '@react-navigation/native';
import {useCurrentUser} from '../store/UserStore';
import {useQuery} from '@tanstack/react-query';
import {getUsers} from '../utils/user.util';

type ItemProps = {
  item: User;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.userList, {backgroundColor}]}>
    <Image
      source={{uri: item.image}}
      style={{
        width: 50,
        height: 50,
        borderRadius: 400 / 2,
      }}
    />
    <View style={{marginLeft: 15}}>
      <Text
        style={{
          color: textColor,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
        {item.fullName}
      </Text>
      <Text style={{color: textColor, fontSize: 10}}>{item.department}</Text>
    </View>
  </TouchableOpacity>
);

const UsersList = ({navigation}: {navigation: NavigationProp<any, any>}) => {
  const setCurrentUser = useCurrentUser(state => state.setCurrentUser);
  const [selectedId, setSelectedId] = useState<number>(0);
  const {data: userList} = useQuery<User[] | null>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const renderItem = ({item}: {item: User}) => {
    const backgroundColor = item.id === selectedId ? '#1000f0d6' : '#d9d9d96e';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setCurrentUser(item);
          setSelectedId(item.id);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.userListContainer}>
      <FlatList
        data={userList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        extraData={selectedId}
        ListFooterComponent={
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              disabled={selectedId === 0}
              style={[
                styles.continueButton,
                {backgroundColor: selectedId === 0 ? '#D9D9D9' : '#1000F0'},
              ]}
              onPress={() => {
                if (selectedId >= 1 && selectedId <= 5) {
                  navigation.navigate('Password Screen');
                } else {
                  ToastAndroid.show('Invalid User', ToastAndroid.CENTER);
                }
              }}>
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
        }
      />
    </SafeAreaView>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  userListContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: 10,
  },
  userList: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#d9d9d96e',
    marginBottom: 18,
  },
  continueButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 12,
  },
});
