import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {categories, categoriesColor} from '../data/categories';

const CategoryStamp = ({categoryId}: {categoryId: number}) => {
  return (
    <View
      style={{
        width: 42,
        height: 14,
        backgroundColor: categoriesColor[categoryId - 1],
        borderRadius: 7,
      }}>
      <Text
        style={{
          fontSize: 10,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
        }}>
        {categories[categoryId - 1]?.name}
      </Text>
    </View>
  );
};

export default CategoryStamp;

const styles = StyleSheet.create({});
