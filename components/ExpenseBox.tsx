import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';

import {formatTimestamp} from '../utils/item.utils';
import CategoryStamp from './CategoryStamp';

const ExpenseBox = ({item}: {item: Item}) => {
  return (
    <View style={styles.expenseBoxContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 8}}>
        <Image
          source={{uri: item.users?.image}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 400 / 2,
          }}
        />
        <View style={{marginLeft: 10, width: '100%'}}>
          <CategoryStamp categoryId={item.categoryId} />

          <Text
            style={{
              fontSize: 12,
              color: 'black',
              fontWeight: 'bold',
              width: '100%',
            }}>
            {item.description}
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: 'black',
              opacity: 0.7,
            }}>
            {formatTimestamp(item?.createdAt ?? '')}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 2.4,
          marginRight: 6,
        }}>
        <Icon
          name="rupee"
          style={{marginRight: 5, marginTop: 6}}
          size={18}
          color="#000"
        />
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default ExpenseBox;

const styles = StyleSheet.create({
  expenseBoxContainer: {
    width: '98%',
    backgroundColor: '#d9d9d959',
    shadowColor: '#d9d9d96e',
    minHeight: 60,
    borderRadius: 8,
    elevation: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
