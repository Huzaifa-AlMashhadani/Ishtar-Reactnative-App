import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image} from "react-native";
import Images from "../../images/Images";
import Color from "../../contalors/Color";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
export default function ShowOrder(){

    const [error, setError] = useState("");
    const [data, setData] = useState("");

    const {id} = useLocalSearchParams();
  useEffect(() => {
    if (!id) return; // منع الاستدعاء إذا كان user_id غير متوفر

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://192.168.56.1/ishtarwebsite/php/ReactnaitveOrderShowen.php?id=${id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchOrders();
  }, [id]); // 📌 يتم تنفيذ `fetchOrders` فقط عندما يتم تحديث `user_id`



    return (
        <SafeAreaView style={{flex: 1}}>
           <ScrollView>
           <View style={styles.navBar}>
                <Text>الطلب : {data.id} </Text>
                <Link href={'/orders'}> <AntDesign name="arrowleft" size={24} color="black" />  </Link>
            </View>
            <View style={styles.container}>
                <View style={styles.order}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderTitle}>مطبعة بوابة عشتار </Text>
                    </View>
                    <View style={styles.orderBody}>
                        <Text style={styles.textContact}>ID: {data.id}</Text>
                        <Text style={styles.textContact}>الاسم : {data.claent_name}</Text>
                        <Text style={styles.textContact}>العنوان : {data.addres}</Text>
                        <Text style={styles.textContact}>رقم الهاتف : {data.cclaent_number}</Text>
                        <Text style={styles.textContact}>السعر : {data.order_price / 1000},000</Text>
                        <Text style={styles.textContact}>{data.descrption}</Text>
                    </View>
                    <View style={styles.orderFooter}>
                        <Image source={{ uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.order_images?.split(',')[0]}` }} style={styles.orderimage}/>
                        <Image source={{ uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.order_images?.split(',')[1]}` }} style={styles.orderimage}/>
                        <Image source={{ uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.order_images?.split(',')[2]}` }} style={styles.orderimage}/>
                        <Image source={{ uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.order_images?.split(',')[3]}` }} style={styles.orderimage}/>
                    </View>
                </View>
            </View>
           </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    navBar:{
        backgroundColor: "#ccc",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 50,
        flexDirection:"row-reverse",
        width: "100%",
        paddingRight: 10,
        paddingLeft: 10,
        zIndex: 10
    },
    container:{
        // paddingTop: 150,
        height: 900,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1,
        backgroundColor: Color.light.mainColor
    },
    order:{
        backgroundColor: '#ccc',
        width: '100%',
        borderRadius: 5,
        padding: 15,
        textAlign: 'center',
        maxWidth: 600,
        boxShadow: '0px 2px 11px 0px #333',
        overflow: 'hidden'
    },
    orderTitle:{
        fontSize: 30,
        textAlign: 'center',
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#333'
    },
    orderBody:{
        marginTop: 15,   
    },
    textContact:{
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        padding: 5,
        borderBottomColor: '#33333352'
    },
    orderimage:{
        width: 150,
        height: 150
    },
    orderFooter:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap:10
    }

})