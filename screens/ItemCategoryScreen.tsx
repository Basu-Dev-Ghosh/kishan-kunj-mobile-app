import {
  FlatList,
    StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCurrentUser} from '../store/UserStore';
import HeaderIcon from '../components/HeaderIcon';
import {NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {categories} from '../data/categories';
import {useCategory} from '../store/CategoryStore';

type ItemProps = {
  item: Category;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const CategoryItem = ({
  item,
  onPress,
  backgroundColor,
  textColor,
}: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.changePasswordContainer, {margin: 15, backgroundColor}]}>
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Icon name={item.iconName} size={26} color={textColor} />
      <Text
        style={{
          fontSize: 16,
          color: textColor,
          fontWeight: 'bold',
          marginLeft: 6,
          textAlign: 'center',
        }}>
        {item.name}
      </Text>
      <Text
        style={{
          fontSize: 9,
          color: textColor,

          marginLeft: 6,
          textAlign: 'center',
        }}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

const ItemCategoryScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  const setCategory = useCategory(state => state.setCategory);
  const [selectedId, setSelectedId] = useState<number>(0);
  const renderItem = ({item}: {item: Category}) => {
    const backgroundColor = item.id === selectedId ? '#1000f0d6' : '#d9d9d96e';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <CategoryItem
        item={item}
        onPress={() => {
          setCategory(item);
          setSelectedId(item.id);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back={true} navigation={navigation} />
       
          <View style={styles.contentSection}>
            <View
              style={{
                paddingHorizontal: 30,
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 26,
                  color: '#000',
                  fontWeight: 'bold',
                }}>
                Select Category
              </Text>
            </View>
            <View style={styles.profileUpdatesContainer}>
              <FlatList
                numColumns={2}
                contentContainerStyle={{
                  width: '100%',

                  alignItems: 'center',
                  flex: 3,
                }}
                data={categories}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                extraData={selectedId}
              />
            </View>
            <TouchableOpacity
              disabled={selectedId === 0}
              style={[
                styles.continueButton,
                {
                  backgroundColor: selectedId === 0 ? '#D9D9D9' : '#1000F0',
                },
              ]}
              onPress={() => {
                if (selectedId >= 1 && selectedId <= 4) {
                  navigation.navigate('Add Item Screen');
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
     
      </View>
    </SafeAreaView>
  );
};

export default ItemCategoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    padding: 30,
  },
  profileUpdatesContainer: {
    marginTop: 20,
    width: '100%',
    flex: 1,
  },
  changePasswordContainer: {
    width: 140,
    height: 100,
    shadowColor: '#d9d9d947',
    borderRadius: 10,
    elevation: 5,
    padding: 20,
  },
  continueButton: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginTop: 16,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
