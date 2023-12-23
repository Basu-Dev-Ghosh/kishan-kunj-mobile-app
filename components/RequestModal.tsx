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
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {formatTimestamp} from '../utils/item.utils';
import {queryClient} from '../App';
import {useCurrentUser} from '../store/UserStore';
import {acceptRequest, deleteRequest} from '../utils/request.util';
const RequestModal = ({
  request,
  showRequest,
  setShowRequest,
}: {
  request?: PaidRequest;
  showRequest: boolean;
  setShowRequest: (value: PaidRequest | null) => void;
}) => {
  const currentUser = useCurrentUser(state => state.currentUser);
  async function denyRequest() {
    if (!request || !currentUser) return;
    try {
      const res = await deleteRequest(
        request.id,
        currentUser?.id,
        request.from,
        request.items.id,
      );
      if (!res.status) throw new Error(res.msg);
      queryClient.refetchQueries({
        queryKey: ['paid_requests', currentUser?.id],
      });

      setShowRequest(null);
    } catch (err: any) {
      Alert.alert('Error', err ?? 'Delete failed');
    }
  }
  async function acceptPaymentRequest() {
    if (!request || !currentUser) return;
    try {
      const res = await acceptRequest(
        request.id,
        currentUser?.id,
        request.from,
        request.items.id,
      );
      if (!res.status) throw new Error(res.msg);
      queryClient.refetchQueries({
        queryKey: ['paid_requests', currentUser?.id],
      });

      setShowRequest(null);
    } catch (err: any) {
      Alert.alert('Error', err ?? 'Accept failed');
    }
  }
  return (
    <SafeAreaView>
      {request ? (
        <View>
          <Modal
            propagateSwipe
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onSwipeComplete={() => setShowRequest(null)}
            // animationOut={'slideOutLeft'}
            swipeDirection={['left', 'right', 'down', 'up']}
            onBackButtonPress={() => setShowRequest(null)}
            onBackdropPress={() => setShowRequest(null)}
            hideModalContentWhileAnimating
            style={{
              maxHeight: 700,
              marginTop: 'auto',
              flex: 1,
              marginBottom: 0,
              marginHorizontal: 0,
            }}
            isVisible={showRequest}>
            <View
              style={{
                backgroundColor: '#040f16',
                flex: 1,
                borderRadius: 6,
                elevation: 10,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={() => setShowRequest(null)}
                  style={{position: 'absolute', top: 20, right: 20}}>
                  <Icon name="close" color={'#fff'} size={20} />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 32,
                    paddingTop: 30,
                    marginBottom: 10,
                  }}>
                  <View style={{width: '100%', flex: 1}}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#fff',
                        fontWeight: 'bold',
                        width: '100%',
                      }}>
                      {request.from_fullname} Sent You A Payment
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#fff',
                        marginTop: 4,
                        width: '90%',
                      }}>
                      {`${request.items.description} of price Rs${request.items.price} has been paid by ${request.from_fullname}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: '#fff',
                        opacity: 0.7,
                        marginTop: 3,
                      }}>
                      {formatTimestamp(request?.createdAt ?? '')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      alignSelf: 'flex-start',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    Screenshot of Payment
                  </Text>
                  <Image
                    source={{uri: request.screenshot}}
                    style={{
                      width: 320,
                      height: 400,
                      marginTop: 10,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  onPress={denyRequest}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#d00000',
                    paddingVertical: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="trash"
                    color={'#fff'}
                    size={22}
                    style={{marginRight: 10}}
                  />

                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                    Deny
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={acceptPaymentRequest}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#1000F0',
                    paddingVertical: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="check"
                    color={'#fff'}
                    size={22}
                    style={{marginRight: 10}}
                  />

                  <Text
                    style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                    Approve
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

export default RequestModal;

const styles = StyleSheet.create({});
