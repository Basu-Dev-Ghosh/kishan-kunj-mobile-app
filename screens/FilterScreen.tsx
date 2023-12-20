import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderIcon from '../components/HeaderIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationProp} from '@react-navigation/native';
import FilterGroup from '../components/FilterGroup';
import {useQuery} from '@tanstack/react-query';
import {getUsers} from '../utils/user.util';
import {useFilter} from '../store/FilterStore';
import {queryClient} from '../App';
import {useCurrentUser} from '../store/UserStore';

const categoryFilters: FilterType = {
  title: 'Categories',
  options: [
    {
      title: 'Grocery',
      value: 1,
    },
    {
      title: 'Bazar',
      value: 2,
    },
    {
      title: 'Advance',
      value: 3,
    },
    {
      title: 'Others',
      value: 4,
    },
  ],
};
const priceFilters: FilterType = {
  title: 'Price',
  options: [
    {
      title: '1-100',
      value: 1,
    },
    {
      title: '100-500',
      value: 2,
    },
    {
      title: '500-1000',
      value: 3,
    },
    {
      title: '>1000',
      value: 4,
    },
  ],
};

const FilterScreen = ({navigation}: {navigation: NavigationProp<any, any>}) => {
  const {data: userList} = useQuery<User[] | null>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const [
    filter,
    setUserFilter,
    setCategoryFilter,
    setPriceFilter,
    resetFilter,
  ] = useFilter(state => [
    state.filter,
    state.setUserFilter,
    state.setCategoryFilter,
    state.setPriceFilter,
    state.resetFilter,
  ]);

  const user = useCurrentUser(state => state.currentUser);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon back navigation={navigation} />
        <View style={styles.contentSection}>
          <View style={{flex: 4}}>
            <FilterGroup
              filter={{
                title: 'Users',
                options: userList?.map(user => {
                  return {
                    title: user.displayName,
                    value: user.id,
                  };
                }),
                value: filter.user,
                setValue: setUserFilter,
              }}
            />
            <FilterGroup
              filter={{
                ...categoryFilters,
                value: filter.category,
                setValue: setCategoryFilter,
              }}
            />
            <FilterGroup
              filter={{
                ...priceFilters,
                value: filter.price,
                setValue: setPriceFilter,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', flex: 1, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                resetFilter();
                queryClient.invalidateQueries({
                  queryKey: ['all_items', user?.id, ''],
                });
                navigation.goBack();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="backward" size={16} color={'white'} />
                <Text style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                  Reset
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                queryClient.invalidateQueries({
                  queryKey: ['all_items', user?.id, ''],
                });
                navigation.goBack();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="save" size={16} color={'white'} />
                <Text style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                  Apply
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;

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
  continueButton: {
    backgroundColor: '#1000F0',
    width: '100%',
    marginHorizontal: 10,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 12,
    flex: 1,
  },
});
