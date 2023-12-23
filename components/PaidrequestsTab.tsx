import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import PaidRequestBox from './PaidRequestBox';
import {useQuery} from '@tanstack/react-query';
import {useCurrentUser} from '../store/UserStore';
import {getPaidRequestsForUser} from '../utils/request.util';
import {queryClient} from '../App';
import ItemDialogModal from './ItemDialogModal';
import RequestModal from './RequestModal';

const PaidrequestsTab = () => {
  const [selectedRequest, setSelectedRequest] = useState<PaidRequest | null>(
    null,
  );
  const currentUser = useCurrentUser(state => state.currentUser);
  const {data: paidRequests, isLoading} = useQuery<PaidRequest[] | null>({
    queryKey: ['paid_requests', currentUser?.id],
    queryFn: () => getPaidRequestsForUser(currentUser?.id),
    enabled: !!currentUser?.id,
  });

  const renderItem = ({item}: {item: PaidRequest}) => {
    return (
      <PaidRequestBox setSelectedRequest={setSelectedRequest} request={item} />
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
      }}>
      {paidRequests && paidRequests?.length === 0 ? (
        <Text style={{marginTop: 20, color: '#000', textAlign: 'center'}}>
          No Paid Requests
        </Text>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                queryClient.refetchQueries({
                  queryKey: ['paid_requests', currentUser?.id],
                });
              }}
              // progressViewOffset={-400}
              style={{top: 10, zIndex: 100}}
              progressBackgroundColor={'#fff'}
            />
          }
          data={paidRequests}
          renderItem={renderItem}
          keyExtractor={item => item?.id?.toString() ?? ''}
        />
      )}

      {selectedRequest && (
        <RequestModal
          showRequest={selectedRequest !== null}
          setShowRequest={setSelectedRequest}
          {...(selectedRequest && {request: selectedRequest})}
        />
      )}
    </SafeAreaView>
  );
};

export default PaidrequestsTab;

const styles = StyleSheet.create({});
