import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import NotificationTab from './NotificationTab';
import PaidrequestsTab from './PaidrequestsTab';

const renderScene = SceneMap({
  first: NotificationTab,
  second: PaidrequestsTab,
});

const NotificationTabs = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Notifications'},
    {key: 'second', title: 'Payment Requests'},
  ]);

  return (
    <TabView
      renderTabBar={props => (
        <TabBar
          labelStyle={{
            color: '#000',
            textTransform: 'capitalize',
            fontSize: 16,
          }}
          indicatorStyle={{backgroundColor: '#1000F0'}}
          style={{backgroundColor: 'transparent', elevation: 0}}
          {...props}
        />
      )}
      pagerStyle={{backgroundColor: 'transparent', elevation: 0}}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};

export default NotificationTabs;

const styles = StyleSheet.create({});
