import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import NotificationBox from './NotificationBox';
import {useCurrentUser} from '../store/UserStore';
import {useQuery} from '@tanstack/react-query';
import {getNotifications} from '../utils/notification.util';
import {queryClient} from '../App';
import NotificationModal from './NotificationModal';

const NotificationTab = () => {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const currentUser = useCurrentUser(state => state.currentUser);
  const {data: notifiactions, isLoading} = useQuery<Notification[] | null>({
    queryKey: ['notifications', currentUser?.id],
    queryFn: () => getNotifications(currentUser?.id),
    enabled: !!currentUser?.id,
  });
  const renderItem = ({item}: {item: Notification}) => {
    return (
      <NotificationBox
        notification={item}
        setSelectedNotification={setSelectedNotification}
      />
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
      }}>
      {notifiactions?.length === 0 ? (
        <Text style={{marginTop: 20, color: '#000', textAlign: 'center'}}>
          No Notifications
        </Text>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                queryClient.refetchQueries({
                  queryKey: ['notifications', currentUser?.id],
                });
              }}
              // progressViewOffset={-400}
              style={{top: 10, zIndex: 100}}
              progressBackgroundColor={'#fff'}
            />
          }
          data={notifiactions}
          renderItem={renderItem}
          keyExtractor={item => item?.id?.toString() ?? ''}
        />
      )}
      {selectedNotification && (
        <NotificationModal
          showNotification={selectedNotification !== null}
          setShowNotification={setSelectedNotification}
          {...(selectedNotification && {
            notificationId: selectedNotification.id,
          })}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationTab;
