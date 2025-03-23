import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Pressable, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import Color from '../contalors/Color'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { height, width } = Dimensions.get('window');
const Notification = () => {
  const [data, setData]= useState([])
  const [user_id, setUser_id] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const value = await AsyncStorage.getItem('userToken');
        if (value !== null) {
          setUser_id(value);
        }
      } catch (err) {
        console.error("❌ خطأ في استرجاع :", err);
      }
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    if (!user_id) return; // منع الاستدعاء إذا كان user_id غير متوفر

    const fetchOrders = async () => {
      try {

        const response = await fetch(
          `http://192.168.56.1/ishtarwebsite/php/ReactNativeNotification.php?not_user_id=${user_id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchOrders();
  }, [user_id]);


const [loading, setLodaing] = useState(false);
const rotuer = useRouter()
const showNoti = (notiID)=>{
rotuer.push(`noti/${notiID}`);
}
console.log(user_id)
  return (
    <SafeAreaView>
      <Text style={styles.Title}>كل الأشعارات  </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Color.light.mainColor} style={{marginTop: "50%"}} />
      ):(
        <View>
        <FlatList
        data={data}
        style={styles.notis}

        keyExtractor={(item)=> item.id}
        renderItem={({item})=>(
             <View style={styles.noti}>
              <Pressable onPress={()=>showNoti(item.id)}>
                {item.not_status === "1" ? (
                <View>
                         <Text style={[styles.title, {color: "#000"}]}>{item.not_title}</Text>
                         <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                         <Text style={[styles.body, {color: "#000"}]} numberOfLines={1}>{item.not_body}</Text>
                         <View style={{backgroundColor: "#111", width: 15, height: 15, borderRadius: 50, right: 0}}></View>
                         </View>
                </View>
                ) :(
                 <View>
                   <Text style={styles.title}>{item.not_title}</Text>
                   <Text style={styles.body} numberOfLines={1}>{item.not_body}</Text>
                 </View>
                )}

              </Pressable>
             </View>
        )}/>
      </View>
      )}
      

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notis:{
   marginTop: 10,
   maxHeight: height - 100
  },
  Title:{
   fontSize: 30,
   textAlign: 'right',
   marginTop: 20,
   marginRight: 10,
   fontWeight: '900'
  },
noti:{
  backgroundColor: Color.light.background,
  padding: 10,
  marginHorizontal: 10,
  marginTop: 10,
  borderRadius: 10,
  direction: "rtl"
},
title:{
  color: "#9b9999",
  fontWeight: "900",
  marginBottom: 5
},
body:{
  color: "#9b9999",
  fontWeight: '200',
  width: "90%",
  overflow: 'hidden'
},
loading:{
  flex: 1,
  height: 1000,
  justifyContent: 'center',
  alignItems: 'center'
}

})

export default Notification