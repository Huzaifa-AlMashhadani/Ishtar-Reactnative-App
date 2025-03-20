import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import LoginScreen from '../login';
import Color from '@/contalors/Color';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
// إنشاء Stack Navigator
const Stack = createStackNavigator();

const _layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return isLoggedIn ? <TabsScreen /> : <LoginScreen />;
};

// مكون التبويبات (Tabs) 
const TabsScreen = () => (
  <Tabs screenOptions={{ 
    tabBarStyle: {
      backgroundColor: Color.light.mainColor, // لون خلفية التبويبات
      borderTopWidth: 1,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderTopColor: Color.light.mainColor,
      height: 80 , // ارتفاع الـ Tabs
      paddingBottom: 10, // مساحة إضافية للأيقونات
    },
    tabBarActiveTintColor: Color.light.waithColor, // لون الأيقونة عند التحديد
    tabBarInactiveTintColor: "rgba(168, 167, 167, 0.3)", // لون الأيقونة عند عدم التحديد
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: 20,
      display: 'none'
    },
    tabBarIconStyle: {
      marginBottom: -5, // تقليل المسافة بين الأيقونة والنص
      margin: 15
    },


  }}
  
  >
    <Tabs.Screen
      name="index"
      options={{
        headerShown: false,
        
        tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
      }}
    />
    <Tabs.Screen
      name="orders"
      options={{
        headerShown: false,
  
        tabBarIcon: ({ color }) => <Feather name="truck" size={28} color={color} />,
      }}
    />
    <Tabs.Screen
      name="addorders"
  
      options={{
        tabBarIconStyle: {fontSize: 50, width: 100, height: 60},
       headerShown: false,
        tabBarIcon: ({ color }) => <AntDesign name="pluscircle" size={50} color={color} />,
      }}
    />
    <Tabs.Screen
      name="createorder"
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" size={28} color={color} />,
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
      
        headerShown: false,
        tabBarIcon: ({ color }) => <AntDesign name="user" size={28} color={color} />,
      }}
    />
  </Tabs>
 


);

export default _layout;
