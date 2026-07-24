import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import TabIcon from './src/components/TabIcon';
import Home from './src/screens/Home';
import SurahAscending from './src/screens/SurahAscending';
import About from './src/screens/About';
import Welcome from './src/screens/Welcome';
import { icons } from './src/constants';
import { RootTabParamList } from './src/types';

type TabIconRenderProps = { color: string; focused: boolean };

const HomeTabIcon = ({ color, focused }: TabIconRenderProps) => (
  <TabIcon icon={icons.home} color={color} focused={focused} name="Home" />
);

const SurahAscendTabIcon = ({ color, focused }: TabIconRenderProps) => (
  <TabIcon icon={icons.plus} color={color} focused={focused} name="Surah" />
);

const AboutTabIcon = ({ color, focused }: TabIconRenderProps) => (
  <TabIcon icon={icons.bookmark} color={color} focused={focused} name="About" />
);

const Tab = createBottomTabNavigator<RootTabParamList>();

function AppNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.select({
    ios: 70 + insets.bottom,
    android: 70 + insets.bottom,
    default: 70 + insets.bottom,
  });

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eeeeee',
            // height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
            // paddingBottom: insets.bottom,
            // paddingTop: 8,
            // height: tabBarHeight,
            // paddingBottom: insets.bottom,
            paddingTop: 12,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ tabBarIcon: HomeTabIcon }}
        />
        <Tab.Screen
          name="Surah Ascend"
          component={SurahAscending}
          options={{ tabBarIcon: SurahAscendTabIcon }}
        />
        <Tab.Screen
          name="About"
          component={About}
          options={{ tabBarIcon: AboutTabIcon }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function App() {
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const isFirstTime = await AsyncStorage.getItem('isFirstTime');
      if (isFirstTime === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('isFirstTime', 'false');
      }
      setIsCheckingFirstLaunch(false);
    };

    checkFirstLaunch();
  }, []);

  if (isCheckingFirstLaunch) {
    return <SafeAreaProvider />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {isFirstLaunch ? (
        <Welcome onGetStarted={() => setIsFirstLaunch(false)} />
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  );
}

export default App;
