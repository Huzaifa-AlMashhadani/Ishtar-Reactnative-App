import { View, Text, Image, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../../images/Images';
import Color from "../../contalors/Color";
import { Link, useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook

const { height, width } = Dimensions.get('window');


const Orders = () => {
  const [data, setData] = useState([]); // يجب أن يكون مصفوفة وليس نصًا
  const [error, setError] = useState("");
  const [user_id, setUser_id] = useState(null);
  const router = useRouter();

  const isConnected = useInternetStatus();


  // ✅ جلب user_id عند تحميل المكون فقط
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

  // ✅ جلب الطلبات فقط عندما يكون user_id متاحًا
  useEffect(() => {
    if (!user_id) return; // منع الاستدعاء إذا كان user_id غير متوفر

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost/ishtarwebsite/php/ReactNativeControlerShoworders.php?user_id=${user_id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchOrders();
  }, [user_id]); // 📌 يتم تنفيذ `fetchOrders` فقط عندما يتم تحديث `user_id`

  const ShowItem = (id)=>{
    router.push(`items/${id}`)
  }
const searchQuery = "600";
  const filteredData = data.filter((item) =>
    item.statues.includes(searchQuery)
  );

  if (!isConnected) {
    return (
      <View style={styles.noInterntPage}>
        <Text style={styles.nointerntText}>🚫 لا يوجد اتصال بالإنترنت</Text>
        <Image source={Images.noInternet} style={styles.nointerntimae}/>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>

    {/* Orders databaes  */}
    <View style={styles.orderDatabaes}>

    {/* <Text style={styles.Title}>كل الطلبات </Text> */}
    <FlatList
  data={filteredData}
  keyExtractor={(item) => item.id.toString()} // تحديد مفتاح فريد لكل عنصر
  contentContainerStyle={styles.contactContainer}
  ListEmptyComponent={
    <View>
      <Text style={{ fontSize: 30, textAlign: 'center', marginTop: 50 }}>
        لا يوجد طلبات
      </Text>
    </View>
  }
  renderItem={({ item }) => (
    <Pressable onPress={() => ShowItem(item.id)}>
      <View style={styles.Order}>
        <View style={{ flexDirection: 'row-reverse' }}>
          {/* أيقونة الحالة */}
          <View style={styles.status}>
            {item.status === 200 ? (
              <Entypo name="back-in-time" size={30} color={Color.light.text} />
            ) : (
              <Feather name="check-circle" size={30} color={Color.light.text} />
            )}
          </View>

          {/* معلومات الطلب */}
          <View style={styles.LastOrderName}>
            <Text style={styles.orderName} numberOfLines={1}>
              {item.claent_name}
            </Text>
            <Text style={styles.Dilevrdicons} numberOfLines={1}>
              {item.addres}
            </Text>
          </View>
        </View>

        {/* سعر الطلب */}
        <Text style={styles.LastOrderPrice}>
          {`${(item.order_price / 1000).toFixed(3)} IQD`}
        </Text>

        {/* صورة الطلب */}
        <View>
          <Image
            source={{
              uri: `http://localhost/ishtarwebsite/php/Orders_images/${
                item.order_images.split(',')[0]
              }`,
            }}
            style={styles.LastOrderimage}
          />
        </View>
      </View>
    </Pressable>
  )}
/>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1 ,
    backgroundColor: Color.light.waithColor,
    minHeight: '100vh'

  },
  contactContainer:{
    // code 
    marginTop:20,
    marginHorizontal: 20,
  },

  // orders styles  start 
   Order:{
    backgroundColor: Color.light.background ,
    marginTop: 10,
    borderRadius: 4,
    flexDirection: 'row-reverse',
    justifyContent: "space-between",
    alignItems: 'center',
    padding: 10
  },
  // orders styles end 
  // orders Database styles 

  ordersDilvrd:{
        flexDirection: "row-reverse",
        alignItems: 'center',
        justifyContent: "space-around"
  },
  downDilvrd:{
    backgroundColor: 'rgba(34, 236, 27, 0.2)',
    padding:7,
    borderRadius: 10,
    paddingHorizontal: 30,
    width: '40%',
   alignItems: 'center'
  },
  downDilvrdNumber:{
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
    color: Color.light.text
  },


  LastOrderimage:{
    width: 50,
    height:50
  },
  LastOrderName:{
    marginLeft: 25
  },
  orderName:{
    textAlign: 'right',
    marginRight: 10,
    width: 100
  },
  Dilevrdicons:{
    fontSize: 10, 
    marginRight: 10,
     color: Color.light.text,
     width: 100
  },

  input: { height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 5 },
  itemFeinded: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  itemFeindedTitle: { fontSize: 16, fontWeight: "bold" },
  itemFeindedPrice: { fontSize: 14, color: "gray" },
  noResult: { textAlign: "center", fontSize: 16, marginTop: 20, color: "gray" },
  noInterntPage:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.light.background
  },
  nointerntText:{
    fontSize: 20,
    Color: "#333",
    fontWeight: 'bold',
  },
  nointerntimae:{
    width: 300,
    height: 300
  }
  
});

export default Orders