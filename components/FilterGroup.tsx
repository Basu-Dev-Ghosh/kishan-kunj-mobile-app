import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FilterButton from './FilterButton';

const FilterGroup = ({filter}: {filter: FilterType}) => {
  return (
    <View style={{alignItems: 'center', marginTop: 22}}>
      <Text style={{marginBottom: 10, color: '#000', fontWeight: 'bold'}}>
        {filter.title ?? ''}
      </Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          flexWrap: 'wrap',
        }}>
        {filter?.options?.map((option, index) => {
          return (
            <FilterButton
              key={index}
              name={option.title}
              value={option.value}
              selectedValue={filter.value}
              setValue={filter.setValue}
            />
          );
        })}
      </View>
    </View>
  );
};

export default FilterGroup;

const styles = StyleSheet.create({});
