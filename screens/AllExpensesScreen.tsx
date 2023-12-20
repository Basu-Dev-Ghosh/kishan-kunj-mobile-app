import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {debounce} from 'lodash';
import React, {useState} from 'react';
import {useCurrentUser} from '../store/UserStore';
import HeaderIcon from '../components/HeaderIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationProp} from '@react-navigation/native';

import ExpenseBox from '../components/ExpenseBox';
import {useQuery} from '@tanstack/react-query';
import {getAllItems} from '../utils/item.utils';
import {useFilter} from '../store/FilterStore';

const AllExpensesScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  const [searchTerm, setSearchTerm] = useState<string>('' as string);
  const {data: allItems} = useQuery<Item[] | null>({
    queryKey: ['all_items', user?.id, searchTerm],
    queryFn: () => getAllItems(searchTerm),
    enabled: !!user?.id,
  });

  const renderItem = ({item}: {item: Item}) => {
    return <ExpenseBox item={item} />;
  };

  const debouncedSearch = debounce(async value => {
    setSearchTerm(value);
  }, 300);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back={true} navigation={navigation} />
        <View style={styles.contentSection}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 25,
              marginTop: 20,
              width: '100%',
            }}>
            <Text style={{color: '#000', flex: 1, fontSize: 20}}>
              All Expenses
            </Text>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('Calculation Result Screen')}>
              <View style={styles.calcualteExpensesButton}>
                <Icon
                  name="calculator"
                  style={{marginRight: 10, marginTop: 3}}
                  size={18}
                  color="#fff"
                />
                <Text style={{fontSize: 14, color: '#fff'}}>Calcualte</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 26,
              alignItems: 'center',
              marginTop: 10,
              // height: 60,
            }}>
            <View style={styles.passwordContainer}>
              <Icon name="search" color="#0000009b" size={16} />
              <TextInput
                placeholderTextColor="#000"
                style={styles.inputStyle}
                autoCorrect={false}
                placeholder="Search here..."
                onChangeText={debouncedSearch}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Filter Screen')}
              style={{
                flex: 0.3,
                shadowColor: '#d9d9d959',
                // width: 20,
                borderRadius: 12,
                height: 60,
                alignSelf: 'center',
                backgroundColor: '#d9d9d959',
                marginLeft: 10,
                marginTop: 13,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="filter" color="#0000009b" size={26} />
            </TouchableOpacity>
          </View>
          <Text style={{marginLeft: 40, marginTop: 20, color: '#000'}}>
            {allItems?.length ?? 0 + '  '} Results
          </Text>
          <View
            style={{
              width: '100%',
              flex: 1,
              marginTop: 14,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            {allItems?.length === 0 ? (
              <Text style={{marginTop: 20}}>No Expenses Found</Text>
            ) : (
              <FlatList
                data={allItems}
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

export default AllExpensesScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  calcualteExpensesButton: {
    backgroundColor: '#1000F0',
    width: '70%',
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 8,
  },
  passwordContainer: {
    marginTop: 10,
    padding: 8,
    paddingLeft: 24,
    elevation: 10,
    shadowColor: '#d9d9d959',
    borderRadius: 10,
    backgroundColor: '#d9d9d959',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 13,
    fontSize: 14,
    color: '#000',
  },
});
