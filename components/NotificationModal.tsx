import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {queryClient} from '../App';
import {useCurrentUser} from '../store/UserStore';
import {deleteNotification} from '../utils/notification.util';
const NotificationModal = ({
  notificationId,
  showNotification,
  setShowNotification,
}: {
  notificationId?: number;
  showNotification: boolean;
  setShowNotification: (value: Notification | null) => void;
}) => {
  const currentUser = useCurrentUser(state => state.currentUser);
  async function removeNotification() {
    if (!notificationId) return;
    try {
      const res = await deleteNotification(notificationId);
      if (!res.status) throw new Error(res.msg);
      queryClient.refetchQueries({
        queryKey: ['notifications', currentUser?.id],
      });
      setShowNotification(null);
    } catch (err: any) {
      Alert.alert('Error', err ?? 'Delete failed');
    }
  }
  return (
    <SafeAreaView>
      {notificationId ? (
        <View>
          <Modal
            propagateSwipe
            animationIn={'slideInUp'}
            onSwipeComplete={() => setShowNotification(null)}
            // animationOut={'slideOutLeft'}
            swipeDirection={['left', 'right', 'down', 'up']}
            onBackButtonPress={() => setShowNotification(null)}
            onBackdropPress={() => setShowNotification(null)}
            hideModalContentWhileAnimating
            style={{
              maxHeight: 80,
              marginTop: 'auto',
              marginBottom: 0,
              marginHorizontal: 0,
            }}
            isVisible={showNotification}>
            <View
              style={{
                backgroundColor: '#040f16',
                flex: 1,
                borderRadius: 2,
                elevation: 10,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={removeNotification}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 32,
                    paddingTop: 30,
                    marginBottom: 10,
                  }}>
                  <Icon name="trash" color={'red'} size={20} />
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'red',
                      marginLeft: 7,
                      width: '100%',
                    }}>
                    Delete Notification
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({});
