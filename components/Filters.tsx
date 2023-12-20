import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
const users = ['Basu', 'Souvik', 'Somu', 'Arnab', 'Ankit'];
const prices = ['0-100', '100-500', '500-1000', '>1000'];
const categories = ['Grocery', 'Bazar', 'Advance', 'others'];
const dates = ['Today', 'Yesterday', 'Manual'];
import Icon from 'react-native-vector-icons/FontAwesome';
const Filters = () => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
      }}>
      <SelectDropdown
        defaultButtonText="Users"
        buttonStyle={{
          borderRadius: 8,
          minWidth: 100,
          flex: 1,
          marginTop: 20,
          marginRight: 20,
          elevation: 8,
          backgroundColor: '#fff',
        }}
        dropdownIconPosition="left"
        renderDropdownIcon={() => <Icon name="user" size={18} />}
        data={users}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />
      <SelectDropdown
        defaultButtonText="Price"
        buttonStyle={{
          borderRadius: 8,
          minWidth: 100,
          flex: 1,
          marginTop: 20,
          marginRight: 20,
          elevation: 8,
          backgroundColor: '#fff',
        }}
        dropdownIconPosition="left"
        renderDropdownIcon={() => <Icon name="rupee" size={18} />}
        data={prices}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />
      <SelectDropdown
        defaultButtonText="Categories"
        buttonStyle={{
          borderRadius: 8,
          minWidth: 100,
          flex: 1,
          marginTop: 20,
          marginRight: 20,
          elevation: 8,
          backgroundColor: '#fff',
        }}
        data={categories}
        dropdownIconPosition="left"
        renderDropdownIcon={() => <Icon name="shopping-cart" size={18} />}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />
      <SelectDropdown
        defaultButtonText="Date"
        buttonStyle={{
          borderRadius: 8,
          width: 110,

          marginTop: 20,
          marginRight: 20,
          elevation: 8,
          backgroundColor: '#fff',
        }}
        dropdownIconPosition="left"
        renderDropdownIcon={() => <Icon name="calendar" size={18} />}
        data={dates}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({});
