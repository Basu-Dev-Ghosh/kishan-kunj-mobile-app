import React, {useState} from 'react';
import Modal from 'react-native-modal';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useCurrentUser} from '../store/UserStore';
import {
  deleteItem,
  formatTimestamp,
  paidItemForUser,
} from '../utils/item.utils';
import {queryClient} from '../App';
import CategoryStamp from './CategoryStamp';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ItemDialogModal = ({
  item,
  showInfo,
  setShowInfo,
}: {
  item?: Item;
  showInfo: boolean;
  setShowInfo: (value: Item | null) => void;
}) => {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [uploadingScreenshot, setUploadingScreenshot] =
    useState<boolean>(false);
  const currentUser = useCurrentUser(state => state.currentUser);
  async function handlePress() {
    if (!currentUser) return;
    if (!item) return;
    try {
      if (currentUser?.id === item.userId) {
        const res = await deleteItem(item.id);
        if (res) {
          queryClient.refetchQueries({
            queryKey: ['all_items', currentUser?.id, ''],
          });
          queryClient.refetchQueries({
            queryKey: ['total_expense', currentUser?.id],
          });
          setShowInfo(null);
        } else {
          Alert.alert('Error', 'Delete failed');
        }
      } else {
        setUploadingScreenshot(true);
      }
    } catch (err) {}
  }

  async function uploadPhoto() {
    if (!item) return;
    try {
      setImageUploading(true);
      const res = await paidItemForUser(
        item.id,
        currentUser?.id,
        item.userId,
        currentUser?.fullName,
      );
      if (!res.status) throw new Error(res.msg ?? 'Request sent failed');

      Alert.alert(
        'Success',
        `Paid request generated, please wait for approvement from ${item.users?.fullName}`,
      );
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Request sent failed');
    } finally {
      setImageUploading(false);
      setUploadingScreenshot(false);
      setShowInfo(null);
    }
  }
  return (
    <SafeAreaView>
      {item ? (
        <View>
          <Modal
            propagateSwipe
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onSwipeComplete={() => setShowInfo(null)}
            // animationOut={'slideOutLeft'}
            swipeDirection={['left', 'right', 'down', 'up']}
            onBackButtonPress={() => setShowInfo(null)}
            onBackdropPress={() => setShowInfo(null)}
            hideModalContentWhileAnimating
            style={{
              maxHeight: 250,
              marginBottom: 2,
              marginHorizontal: 0,
              marginTop: 'auto',
              flex: 1,
            }}
            isVisible={showInfo}>
            <View
              style={{
                backgroundColor: '#040f16',
                flex: 1,

                elevation: 15,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  padding: 20,
                }}>
                <TouchableOpacity
                  onPress={() => setShowInfo(null)}
                  style={{position: 'absolute', top: 20, right: 20}}>
                  <Icon2 name="close" color={'#fff'} size={20} />
                </TouchableOpacity>
                <View style={{flexDirection: 'row', padding: 32}}>
                  <Image
                    source={{uri: item.users?.image}}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 400 / 2,
                    }}
                  />
                  <View style={{width: '100%', marginLeft: 10}}>
                    <CategoryStamp categoryId={item.categoryId} />

                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff',
                        fontWeight: 'bold',
                        width: '100%',
                      }}>
                      {item.description}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#fff',
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
                    alignSelf: 'flex-end',
                  }}>
                  <Icon
                    name="rupee"
                    style={{marginRight: 5, marginTop: 6}}
                    size={20}
                    color="#fff"
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 22,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    {item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handlePress}
                style={{
                  flexDirection: 'row',
                  backgroundColor:
                    currentUser?.id === item.userId ? 'red' : '#1000F0',
                  paddingVertical: 20,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {currentUser?.id === item.userId ? (
                  <Icon
                    name="trash-o"
                    color={'#fff'}
                    size={22}
                    style={{marginRight: 10}}
                  />
                ) : (
                  <Icon2
                    name="checkmark-done-sharp"
                    color={'#fff'}
                    size={22}
                    style={{marginRight: 10}}
                  />
                )}

                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                  {currentUser?.id === item.userId
                    ? 'Delete Item'
                    : 'Mark Paid'}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onSwipeComplete={() => setImageUploading(false)}
            swipeDirection={['left', 'right', 'down', 'up']}
            onBackButtonPress={() => setUploadingScreenshot(false)}
            onBackdropPress={() => setUploadingScreenshot(false)}
            hideModalContentWhileAnimating
            style={{
              maxHeight: 250,
              marginBottom: 0,
              marginHorizontal: 0,
              marginTop: 'auto',
              flex: 1,
            }}
            isVisible={uploadingScreenshot}>
            <View
              style={{
                backgroundColor: '#040f16',
                flex: 1,
                borderRadius: 2,
                elevation: 10,
                overflow: 'hidden',
              }}>
              <View style={{padding: 40, flex: 1}}>
                <TouchableOpacity
                  onPress={() => setUploadingScreenshot(false)}
                  style={{position: 'absolute', top: 20, right: 20}}>
                  <Icon2 name="close" color={'#fff'} size={20} />
                </TouchableOpacity>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>
                    Upload Payment Screenshot
                  </Text>
                  <TouchableOpacity
                    onPress={uploadPhoto}
                    style={{
                      marginTop: 26,
                      borderColor: '#666',
                      borderWidth: 2,
                      borderStyle: 'dotted',
                      paddingHorizontal: 80,
                      paddingVertical: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="upload" color={'#555'} size={20} />
                    <Text style={{marginTop: 7, fontSize: 14, color: '#fff'}}>
                      Upload Here
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={uploadPhoto}
                style={{
                  flexDirection: 'row',
                  backgroundColor:
                    currentUser?.id === item.userId ? 'red' : '#1000F0',
                  paddingVertical: 19,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="upload"
                  color={'#fff'}
                  size={18}
                  style={{marginRight: 10}}
                />

                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                  {imageUploading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ItemDialogModal;
