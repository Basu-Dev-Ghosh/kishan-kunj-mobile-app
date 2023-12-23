import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useCurrentUser} from '../store/UserStore';
const NotificationBox = ({
  notification,
  setSelectedNotification,
}: {
  notification: Notification;
  setSelectedNotification: (notification: Notification) => void;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  return (
    <>
      {notification && (
        <TouchableOpacity
          onLongPress={() => setSelectedNotification(notification)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#d9d9d98e',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            elevation: 12,
            shadowColor: '#d9d9d96e',
            marginBottom: 10,
          }}>
          <Image
            source={{uri: notification.users.image}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 400 / 2,
            }}
          />
          <View style={{marginLeft: 14, width: '80%'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {notification.status}
            </Text>
            <Text
              style={{
                fontSize: 10,
                marginTop: 2,
                color: '#000',
              }}>
              {`Your request for item ${
                notification.items.description
              } of price Rs${notification.items.price} has been ${
                notification.status === 'Payment Request Denied'
                  ? 'denied'
                  : 'accepted'
              } by ${notification.users.fullName}`}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default NotificationBox;

const styles = StyleSheet.create({});
