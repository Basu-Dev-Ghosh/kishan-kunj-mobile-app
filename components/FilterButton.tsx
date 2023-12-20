import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
const FilterButton = ({
  name,
  value,
  selectedValue,
  setValue,
}: {
  name: string | undefined;
  value: number | undefined;
  selectedValue: number | undefined;
  setValue: ((value: number) => void) | undefined;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (value === selectedValue) setValue && setValue(0);
        else setValue && setValue(value ?? 0);
      }}
      style={{
        width: 100,
        height: 30,
      
        borderRadius: 10,
        backgroundColor: value === selectedValue ? '#1000F0' : '#D9D9D94a',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginHorizontal: 10,
        marginTop: 10,
        elevation: 10,
        shadowColor: '#D9D9D94a',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Icon
          name="check"
          size={12}
          color={value === selectedValue ? '#fff' : '#000'}
        />
        <Text
          style={{
            fontSize: 14,
            marginLeft: 7,
            color: value === selectedValue ? '#fff' : '#000',
          }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterButton;

const styles = StyleSheet.create({});
