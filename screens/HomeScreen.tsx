import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderIcon from '../components/HeaderIcon';
import {useCurrentUser} from '../store/UserStore';
import Icon from 'react-native-vector-icons/FontAwesome';

import {FloatingAction} from 'react-native-floating-action';
import ExpenseBox from '../components/ExpenseBox';
import {NavigationProp} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getCurrentUser, getUsers} from '../utils/user.util';
import {
  getRecentItems,
  getTotalExpenseForCurrentMonth,
} from '../utils/item.utils';

const HomeScreen = ({navigation}: {navigation: NavigationProp<any, any>}) => {
  const {data: userList} = useQuery<User[] | null>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const {data: currentUser} = useQuery<User | null>({
    queryKey: ['current_user'],
    queryFn: getCurrentUser,
  });
  const {data: recentItems} = useQuery<Item[] | null>({
    queryKey: ['recent_items', currentUser?.id],
    queryFn: getRecentItems,
    enabled: !!currentUser?.id,
  });
  const {data: totalExpense} = useQuery<number | null>({
    queryKey: ['total_expense', currentUser?.id],
    queryFn: getTotalExpenseForCurrentMonth,
    enabled: !!currentUser?.id,
  });

  const [user, setCurrentUser] = useCurrentUser(state => [
    state.currentUser,
    state.setCurrentUser,
  ]);
  useEffect(() => {
    if (currentUser && !user) {
      setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const renderItem = ({item}: {item: Item}) => {
    return <ExpenseBox item={item} />;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} navigation={navigation} />
        <View style={styles.contentSection}>
          <View style={styles.totalExpensesContainer}>
            <View style={styles.totalExpensesBox}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                TOTAL{' '}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="rupee"
                  style={{marginRight: 10, marginTop: 6}}
                  size={44}
                  color="#fff"
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 44,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {totalExpense?.toFixed(2) ?? 0}
                </Text>
              </View>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                PRESENT USERS{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 11,
                  justifyContent: 'center',
                  width: '100%',
                }}>
                {userList
                  ?.filter(({ispresent}) => ispresent)
                  ?.map(({image, id}) => (
                    <Image
                      key={id}
                      source={{uri: image}}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 400 / 2,
                        marginLeft: -12,
                      }}
                    />
                  ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => navigation.navigate('All Expenses Screen')}>
                  <View style={styles.checkHistoryButton}>
                    <Icon
                      name="history"
                      style={{marginRight: 10, marginTop: 3}}
                      size={18}
                      color="#000000"
                    />
                    <Text style={{fontSize: 14, color: '#000000'}}>
                      Check Usage
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('Calculation Result Screen')
                  }>
                  <View style={styles.checkHistoryButton}>
                    <Icon
                      name="calculator"
                      style={{marginRight: 10, marginTop: 3}}
                      size={18}
                      color="#000000"
                    />
                    <Text style={{fontSize: 14, color: '#000000'}}>
                      Calcualte
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.recentExpensesContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
              }}>
              <Text style={{color: '#000'}}>Recent Expenses</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('All Expenses Screen')}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>See all</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',

                marginTop: 10,
                padding: 6,
                alignItems: 'center',
              }}>
              {recentItems?.length === 0 ? (
                <Text style={{marginTop: 20}}>No Recent Expenses</Text>
              ) : (
                <FlatList
                  data={recentItems}
                  renderItem={renderItem}
                  keyExtractor={item => item?.id?.toString() ?? ''}
                />
              )}
            </View>
          </View>
        </View>
      </View>

      <FloatingAction
        overrideWithAction={true}
        color="#1000F0"
        actions={[
          {
            text: 'Add Expenses',
            icon: <Icon name="plus" size={20} color="#fff" />,
            name: 'add_Expenses',
          },
        ]}
        onPressItem={name => {
          if (user?.ispresent) navigation.navigate('Item Category Screen');
          else Alert.alert('Warning', 'Please mark your presence first');
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  totalExpensesContainer: {
    marginTop: 10,
    alignItems: 'center',
    height: 250,
    width: '100%',
    padding: 20,
  },
  totalExpensesBox: {
    backgroundColor: '#1000F0',
    height: '100%',
    width: '88%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 5,
  },
  checkHistoryButton: {
    backgroundColor: '#fffffff2',
    width: '90%',
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 12,
  },
  recentExpensesContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
});
