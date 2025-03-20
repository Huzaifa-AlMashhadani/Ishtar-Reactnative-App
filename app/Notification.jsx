import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Pressable, Dimensions} from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import Color from '../contalors/Color'
import { useRouter } from 'expo-router'

const { height, width } = Dimensions.get('window');
const Notification = () => {
  const data = [
  {
   id : 1,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 2,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 3,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 4,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 5,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 6,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 7,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 8,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 9,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 10,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 11,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  },
  {
   id : 12,
   title: "Order Wes Dilverd suscfyle",
   body: "your order caled ali huseen wes dilvird , you have 100,000 IQD on your walt"
  }
];


const [loading, setLodaing] = useState(false);
const rotuer = useRouter()
const showNoti = (notiID)=>{
rotuer.push(`noti/${notiID}`);
}
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
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body} numberOfLines={1}>{item.body}</Text>
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
  color: Color.light.text,
  fontWeight: "900",
  marginBottom: 5
},
body:{
  color: "#666",
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