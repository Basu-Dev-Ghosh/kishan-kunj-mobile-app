import {
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

      const {data, error} = await createItem(item);

      if (error) throw new Error(error.message);
      queryClient.invalidateQueries({
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
                  style={{width: '100%', paddingHorizontal: 20, paddingTop: 6}}>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {error}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
            <TouchableOpacity style={styles.continueButton} onPress={addItem}>
              {isItemAdding ? (
                <Progress.Circle color="white" size={30} indeterminate={true} />
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
        </View>
      </View>
    </SafeAreaView>
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
