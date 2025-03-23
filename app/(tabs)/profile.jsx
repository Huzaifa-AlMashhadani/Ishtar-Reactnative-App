import { View, Text, StyleSheet, SafeAreaView, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import Images from '@/images/Images';
import Color from '@/contalors/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useNavigation } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook

const profile = () => {
    const navigation = useNavigation(); // الحصول على navigation باستخدام useNavigation

  const logout = ()=>{
     AsyncStorage.removeItem('userToken');
     AsyncStorage.removeItem('image');
     navigation.push("login")
  }
  const [user_id, setUser_id] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [userImage, setUserImage] = useState("defult.jpg");
  const isConnected = useInternetStatus();

  // ✅ جلب الطلبات فقط عندما يكون user_id متاحًا
  useEffect(() => {
    if (!user_id) return; // منع الاستدعاء إذا كان user_id غير متوفر

    const fetchNotification = async () => {
      try {
        const value = await AsyncStorage.getItem('userToken');
  
        if (value !== null) {
          setUser_id(value);
        }
        const response = await fetch(
          `http://192.168.0.112/ishtarwebsite/php/ReactnaitveUserDityles.php?user_id=${user_id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchNotification();
  }, [user_id]); // 📌 يتم تنفيذ `fetchNotification` فقط عندما يتم تحديث `user_id`

  if (!isConnected) {
    return (
      <View style={styles.noInterntPage}>
        <Image source={Images.noInternet} style={styles.nointerntimae}/>
        <Text style={styles.nointerntText}> لا يوجد اتصال بالإنترنت</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.ImagesPorfile}>
        <Image style={styles.profileBackground} source={Images.profileBg}/>
        <View style={styles.profileBackgroundOpasty} ></View>
          <Link href="createorder" style={styles.backBtn}><AntDesign name="arrowleft" size={24} color="black" /></Link>
        <Image style={styles.profileImage} source={{  uri: `http://192.168.0.112/ishtarwebsite/images/${userImage}` }}/>
   
        </View>
        <View style={styles.userInfo}>
          <View style={styles.info}>
          <Text style={styles.infoLiabel}>  الأسم </Text>
          <Text style={styles.infoLiabelVal}>{data.name}</Text>
          <Text style={styles.infoLiabel}>  رقم الهاتف</Text>
          <Text style={styles.infoLiabelVal}>{data.Phnumber}</Text>
          <Text style={styles.infoLiabel}>  البريد اللكتلاوني </Text>
          <Text style={styles.infoLiabelVal}>{data.email}</Text>
            <Pressable ><Text style={styles.btnupdete}>تحديث المعلومات </Text></Pressable>
            <Pressable onPress={logout}><Text style={[styles.btnupdete, {backgroundColor: Color.light.background, color: Color.light.mainColor, borderColor: "#ccc", borderWidth: 1}]}> تسجيل خروج </Text></Pressable>
          </View>
  
        </View>
      </View>
    </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
container:{
  backgroundColor:Color.light.waithColor,
  flex: 1
},
profile:{

},
profileImage:{
width: 120,
height: 120,
borderRadius: 100,
position:"relative",
marginHorizontal: 'auto',
marginTop: -50,
borderColor: Color.light.waithColor,
borderWidth: 6,


},
profileBackground:{
width: "100%",
height: 130,
},
profileBackgroundOpasty:{
backgroundColor: 'rgba(0,0,0,0.5)',
width: '100%',
height: 130,
position: 'absolute',
top: 0,
},
backBtn:{
  position: 'absolute',
  top: 20,
  left: 20,
  backgroundColor: Color.light.background,
  borderRadius: 50,
  padding: 5
},
userName:{
  marginHorizontal: 'auto',
  fontSize: 25,
  marginTop: 10
},
userdetiles:{
  marginHorizontal:'auto',
  marginTop: 5
},
userInfo:{
  gap: 10,
  backgroundColor: Color.light.waithColor,
  marginHorizontal: 20,
  borderRadius: 10
},
infoLiabel:{
  marginTop: 15,
  fontSize: 15,
  color: Color.light.text,
  textAlign: 'right'

},
infoLiabelVal:{
  backgroundColor: Color.light.background,
  padding: 10,
  marginTop: 10,
  textAlign: 'right',
  color: Color.light.text

},
btnupdete:{
  marginHorizontal: 'auto',
  padding: 10,
  marginTop: 15,
  backgroundColor: Color.light.mainColor,
  color: Color.light.background,
  borderRadius: 5,
  width: '100%',
  textAlign: 'center'
},
  noInterntPage:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.light.waithColor
  },
  nointerntText:{
    fontSize: 30,
    color: "#888",
    fontWeight: '500',
  },
  nointerntimae:{
    width: 200,
    height: 200,
    marginBottom: 50
  }
})

export default profile

