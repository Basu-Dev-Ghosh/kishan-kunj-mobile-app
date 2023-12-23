import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useCurrentUser} from '../store/UserStore';
import {formatTimestamp} from '../utils/item.utils';

const PaidRequestBox = ({
  request,
  setSelectedRequest,
}: {
  request: PaidRequest;
  setSelectedRequest: (value: PaidRequest | null) => void;
}) => {
  const user = useCurrentUser(state => state.currentUser);
  return (
    <>
      {request && (
        <TouchableOpacity
          onPress={() => setSelectedRequest(request)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#d9d9d98e',
            paddingTop: 10,
            paddingHorizontal: 8,
            borderRadius: 12,
            elevation: 12,
            shadowColor: '#d9d9d96e',
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Image
              source={{uri: request.users.image}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 400 / 2,
              }}
            />
          </View>
          <View style={{marginLeft: 14, flex: 6}}>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {request.from_fullname} Sent You a Payment
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 10,
              }}>
              <Text style={{fontSize: 8, marginTop: 2, color: '#000'}}>
                {formatTimestamp(request?.createdAt ?? '')}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedRequest(request)}
                style={{marginRight: 12, marginTop: 3}}>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#000',
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default PaidRequestBox;

const styles = StyleSheet.create({});
