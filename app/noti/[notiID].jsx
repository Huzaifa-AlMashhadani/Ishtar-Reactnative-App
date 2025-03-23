import { View, Text , StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Color from '../../contalors/Color';

const noti = () => {

  const {notiID} = useLocalSearchParams();
    useEffect(() => {
      if (!notiID) return; // منع الاستدعاء إذا كان user_id غير متوفر
  
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `http://192.168.56.1/ishtarwebsite/php/ReactNativeNotificationnsUpdeteStatus.php?not_id=${notiID}`
          );
          const jsonData = await response.json();
          console.log(jsonData);
        } catch (err) {
          console.log("حدث خطأ أثناء جلب الطلبات: " + err.message);
        }
      };
  
      fetchOrders();
    }, [notiID]); // 📌 يتم تنفيذ `fetchOrders` فقط عندما يتم تحديث `user_id`
  console.log(notiID)
  return (
    <View style={styles.notif}>
       <Text style={styles.title}>title</Text>
       <Text style={styles.body}>ى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها. ولذلك يتم استخدام طريقة لوريم إيبسوم لأنها تعطي توزيعاَ طبيعياَ -إلى حد ما- للأحرف عوضاً عن استخدام "هنا يوجد محتوى نصي، هنا يوجد محتوى نصي" فتجعلها تبدو (أي الأحرف) وكأنها نص مقروء. العديد من برامح النشر المكتبي وبرامح تحرير صفحات الويب تستخدم لوريم إيبسوم بشكل إفتراضي كنموذج </Text>
    </View>
  )
}

const styles = StyleSheet.create({
notif:{
  backgroundColor: Color.light.background,
  marginHorizontal: 10,
  marginTop: 20,
  direction: 'rtl',
  padding: 10
},
title:{
  fontSize: 25,
  color: Color.light.text,
  textAlign: 'center',
  fontWeight: "900"
},
body:{
  color: "#555",
fontWeight: "300",
marginTop: 15,
fontSize: 20,
lineHeight: 40
}
})

export default noti