import { Link, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Images from "../../images/Images";
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRef } from "react";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator,View, Text, SafeAreaView, Image, TextInput, StyleSheet, Pressable, Alert, ScrollView, Dimensions } from 'react-native';
import { useFonts, Mirza_500Medium, Mirza_700Bold } from '@expo-google-fonts/mirza';
import Color from '../../contalors/Color';
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";



const { width,height } = Dimensions.get('window'); // نحصل على ارتفاع الشاشة

export default function ShowItem(){

    const [error, setError] = useState("");
    const [data, setData] = useState("");
    const scrollViewRef = useRef(null);
    const router = useRouter(); // الحصول على navigation باستخدام useNavigation
    const [itemImage, setitemImage] = useState("");
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [selectedImage2, setSelectedImage2] = useState(null);
    const [ordernumber, setOrdernumber] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [adrese, setAdrese] = useState("");
    const [price, setPrice] = useState("");
    const [descrption, setDescrption] = useState("");
    const [loading, setloding] = useState(false);
    const isConnected = useInternetStatus();
    const [show, setShow] = useState(false)


    // test anmadtion 
      const translateY = useSharedValue(1000); // يبدأ خارج الشاشة
      const opacity = useSharedValue(1); // شفاف في البداية

    const test = ()=>{
      if(show === true){
        translateY.value = withSpring(1000, { damping: 10 }); // انزلاق لأسفل
        opacity.value = withSpring(1);
        setTimeout(() => setShow(false), 100); // انتظار خروج الأنميشن
      }else{
              translateY.value = withSpring(0, { damping: 15 }); // انزلاق للأعلى
              opacity.value = withSpring(1);
              setTimeout(() => setShow(true), 100); // انتظار خروج الأنميشن
              
      }
    }
      const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
      }));
    // test anmadtion 
    const {itemShow} = useLocalSearchParams();
  useEffect(() => {
    if (!itemShow) return; // منع الاستدعاء إذا كان user_itemShow غير متوفر

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://192.168.56.1/ishtarwebsite/php/reactnaitveShowitems.php?item_id=${itemShow}`
        );
        const jsonData = await response.json();
        setData(jsonData);
        setitemImage(jsonData.item_images?.split(',')[0])
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchOrders();
  }, [itemShow]); // 📌 يتم تنفيذ `fetchOrders` فقط عندما يتم تحديث `user_itemShow`
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current.scrollTo({ y: height / 5, animated: true });
    }, 500); // ننتظر قليلًا حتى يتم تحميل المحتوى
  }, []);






  // طلب الإذن للوصول إلى الاستوديو
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("صلاحيات مفقودة", "يجب منح الإذن للوصول إلى الاستوديو!");
      }
    })();
  }, []);

  // دالة فتح الاستوديو لاختيار صورة
  const selectImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // setloding();
    }
  };

  // دالة لاستخراج اسم ونوع الملف
  const getFileInfo = (uri) => {
    if (!uri) return null;

    const fileName = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName);
    const fileType = match ? `image/${match[1]}` : `image/jpeg`; 

    return { name: fileName, type: fileType };
  };

  const handleSubmit = async () => {
    
    if (!ordernumber || !name || !number || !adrese || !price) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const { name: name1, type: type1 } = getFileInfo(selectedImage1);
    const { name: name2, type: type2 } = getFileInfo(selectedImage2);

    const formData = new FormData();
    formData.append("ordernumber", ordernumber);
    formData.append("name", name);
    formData.append("number", number);
    formData.append("adrese", adrese);
    formData.append("ClintPrice", price);
    formData.append("descrption", descrption + data.item_title);

    // إضافة الصور إلى formData
    if (selectedImage1) {
      formData.append("image1", {
        uri: selectedImage1,
        name: name1 || "image.jpg",
        type: type1 || "image/jpeg",
      });
    }

    if (selectedImage2) {
      formData.append("image2", {
        uri: selectedImage2,
        name: name2 || "image.jpg",
        type: type2 || "image/jpeg",
      });
    }

    try {
      setloding(true)
      const response = await fetch("http://192.168.56.1/ishtarwebsite/php/addorder.php", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = await response.json();
    console.log(responseData)
      if (responseData.status === "success") {
        setloding(false)
        Alert.alert("نجاح", "تم إرسال الطلب بنجاح!");
        setOrdernumber("");
        setName("");
        setNumber("");
        setAdrese("");
        setPrice("");
        setDescrption("");
        setSelectedImage1(null);
        setSelectedImage2(null);
      } else {
        Alert.alert("خطأ", responseData.message);
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل الإرسال، تحقق من الاتصال بالخادم.");
      console.error("Upload error:", error);
    }
  };

  const [loaded] = useFonts({
    Mirza_500Medium,
    Mirza_700Bold,
  });

    return (
      <SafeAreaView style={{ flex: 1 }}>
      {/* شريط التنقل */}
      <View style={styles.navBar}>
        <Text style={{ color: "#333" }}>ID : {data.item_id}</Text>
        <Pressable onPress={() => router.push("createorder")} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={28} color={Color.light.mainColor}  />
          {/* <MaterialIcons name="arrow-back-ios" size={30} color={Color.light.mainColor} style={{backgroundColor: "rgba(255, 255, 255, 0.3)", padding: 6, borderRadius:4}} /> */}
        </Pressable>
      </View>
    
      <View style={styles.container}>
        <View style={styles.boxImage}>
          <View style={styles.ImageSadow} />
          <Image
            source={{
              uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${itemImage}`,
            }}
            resizeMode="contain"
            style={styles.itemImage}
          />
        </View>
    
        <ScrollView
          ref={scrollViewRef} // اجعل التمرير يبدأ من منتصف الشاشة
          style={{
            height: height + 1000,
            backgroundColor: "rgba(40, 153, 25, 0)",
            marginTop: -350,
            zIndex: 10,
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <View style={styles.contact}>
            <View style={styles.itemsImages}>
              <Pressable onPress={() => setitemImage(data.item_images?.split(",")[0])}>
                {data.item_images ? (
                  <Image
                    source={{
                      uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.item_images.split(",")[0]}`,
                    }}
                    style={styles.itemImageIcon}
                  />
                ) : (
                  <Text>صورة غير متوفرة</Text> // النص مغلف داخل <Text>
                )}
              </Pressable>
              <Pressable onPress={() => setitemImage(data.item_images?.split(",")[1])}>
                {data.item_images ? (
                  <Image
                    source={{
                      uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.item_images.split(",")[1]}`,
                    }}
                    style={styles.itemImageIcon}
                  />
                ) : (
                  <Text>صورة غير متوفرة</Text>
                )}
              </Pressable>
              <Pressable onPress={() => setitemImage(data.item_images?.split(",")[2])}>
                {data.item_images ? (
                  <Image
                    source={{
                      uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.item_images.split(",")[2]}`,
                    }}
                    style={styles.itemImageIcon}
                  />
                ) : (
                  <Text>صورة غير متوفرة</Text>
                )}
              </Pressable>
              <Pressable onPress={() => setitemImage(data.item_images?.split(",")[3])}>
                {data.item_images ? (
                  <Image
                    source={{
                      uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.item_images.split(",")[3]}`,
                    }}
                    style={styles.itemImageIcon}
                  />
                ) : (
                  <Text>صورة غير متوفرة</Text>
                )}
              </Pressable>
            </View>
    
            <View style={styles.Titles}>
              <Text style={styles.itemPrice}>
                {`${(Number(data.item_price / 1000)).toFixed(3)} IQD`}
              </Text>
              {/* فصل النص عن الأيقونة داخل View منفصل */}
              <View style={styles.itemStarsContainer}>
                <Text style={styles.itemStarsText}>5.0</Text>
                <AntDesign name="star" size={20} color="#FA9003" />
              </View>
            </View>
    
            <View style={styles.itemDiteles}>
              <Text style={styles.DitelesTitle}>{data.item_title}</Text>
              <Text style={styles.DitelesDescrption}>{data.item_descrption}</Text>
              <Text style={styles.DitelesDescription}>
                <Feather name="check-circle" size={25} color="#1DA734" /> متوفر الان
              </Text>
            </View>
    
            <View style={styles.actinsButtons}>
              <Pressable
                style={[styles.btn, { borderColor: Color.light.mainColor }]}
                onPress={() => test()}
              >
                <Text style={{ color: Color.light.waithColor }}>اطلب الان</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor: Color.light.background }]}>
                <Text style={{ color: Color.light.text }}>واتساب</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    
      {show ? (
        <Animated.View style={[styles.addOrder, animatedStyles]}>
          {/* استخدام <Link> بدون تغليف الأيقونة داخل <Text> */}
  
          <Text style={styles.title}>إنشاء طلب جديد</Text>
    
          <View style={styles.imagesContainer}>
            {/* الصورة الأولى */}
            <Pressable
              style={styles.imageWrapper}
              onPress={() => selectImage(setSelectedImage1)}
            >
              <Image
                source={{
                  uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${data.item_images.split(",")[0]}`,
                }}
                style={styles.labelImage}
              />
              <Text style={styles.uploadText}>اضغط لاختيار الصورة الأولى</Text>
            </Pressable>
    
            {/* الصورة الثانية */}
            <Pressable
              style={styles.imageWrapper}
              onPress={() => selectImage(setSelectedImage2)}
            >
              <Image
                source={
                  selectedImage2
                    ? { uri: selectedImage2 }
                    : require("../../assets/images/item-1.jpg")
                }
                style={styles.labelImage}
              />
              <Text style={styles.uploadText}>اضغط لاختيار الصورة الثانية</Text>
            </Pressable>
          </View>
    
          <View style={styles.labels}>
            <TextInput
              style={[styles.input, { width: "48%" }]}
              placeholder="الاسم  "
              placeholderTextColor="rgb(164, 164, 164)"
              onChangeText={setName}
              value={name}
            />
            <TextInput
              style={[styles.input, { width: "48%" }]}
              placeholder="رقم الطلب"
              placeholderTextColor="rgb(164, 164, 164)"
              onChangeText={setOrdernumber}
              value={ordernumber}
            />
          </View>
          <Text style={styles.inputTitle}> رقم الهاتف </Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder=" مثال : 07811930693 "
            placeholderTextColor="rgb(164, 164, 164)"
            onChangeText={setNumber}
            value={number}
          />
          <Text style={styles.inputTitle}>  العنوان الكامل  </Text>
          <TextInput
            style={styles.input}
            placeholder=" مثال : بغداد / السيديه / شارع الضباط "
            placeholderTextColor="rgb(164, 164, 164)"
            onChangeText={setAdrese}
            value={adrese}
          />
          <Text style={styles.inputTitle}> السعر  الكامل   </Text>
          <TextInput
            style={styles.input}
            placeholder=" 49000 IQD"
            placeholderTextColor="rgb(164, 164, 164)"
            onChangeText={setPrice}
            value={`${(Number(data.item_price / 1000)).toFixed(3)} IQD`}
          />
          <Text style={styles.inputTitle}>   الوصف   </Text>
    
          <TextInput
            style={styles.inputTextArea}
            placeholder="الوصف او الملاحظات"
            placeholderTextColor="rgb(164, 164, 164)"
            onChangeText={setDescrption}
            value={descrption}
          />
    
          <View style={styles.buttons}>
            <Pressable onPress={handleSubmit}>
              <Text style={styles.button}>إرسال</Text>
            </Pressable>
            <Pressable onPress={() => test()}>
              <Text style={styles.buttonDis}>الغاء</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : (
        <View />
      )}
    </SafeAreaView>
    
    )
}
const styles = StyleSheet.create({
    navBar:{
      display:'flex',
        position: 'absolute',
        justifyContent: "space-between",
        alignItems: 'center',
        height: 50,
        flexDirection:"row-reverse",
        width: "100%",
        zIndex: 10,
        paddingHorizontal: 10,
        top: 0,
    },

    container:{
        backgroundColor: "#b7b7b7",
        flex: 1,
    },
    contact:{
        borderRadius: 20,
        backgroundColor: Color.light.waithColor,
        // position: "absolute",
        width: "100%",
        top: 350,
        padding:20,
        flex: 1, 
        minHeight: height + 300,
        zIndex: 2,
        
        

    },
    boxImage:{
        // code 
        
    },
    itemImage:{
        width: '100%',
        height: 300,
        zIndex: 0,
        marginTop: 50,
        marginBottom: 50
    },
    ImageSadow:{
        width: '100%',
        height: 400,
        position: 'absolute',
        top: 50,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0, 0.0)"
    },
    itemsImages:{
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    itemImageIcon:{
        width: 70,
        height: 70,
        borderRadius: 5
    },
    Titles:{
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        marginTop: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 10,
        alignItems: 'center',
        marginHorizontal: 10
    },
    itemPrice:{
        color: Color.light.text,
        fontSize: 30,
    },
    itemStars: {
        color: Color.light.text,
        fontSize: 20,
        fontWeight: '100'
        
    },
    itemDiteles:{
        marginTop: 25
    },
    DitelesTitle:{
        color: Color.light.text,
        fontSize: 24,
        fontWeight: '100',
        textAlign: 'right'
    },
    DitelesDescrption:{
        color: "rgba(69, 69, 69, 0.7)",
        marginTop: 5,
        fontWeight: '100',
        minHeight: 70,
        textAlign: 'right'
    },
    DitelesDescription:{
        color: Color.light.text,
        textAlign: "right",
        marginTop: 20,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse'
        
    },
    actinsButtons:{
        flexDirection: "row-reverse",
        justifyContent: 'space-evenly',
        marginTop: 50
    },
    btn:{
        fontSize: 20,
        backgroundColor: Color.light.mainColor,
        padding: 10,
        borderRadius: 7,
        fontWeight: '100',
        borderColor: Color.light.text,
        borderWidth: 2
    },
    addOrder:{
        zIndex: 199,
        position: 'absolute',
        backgroundColor: Color.light.waithColor,
        width: "100%",
        top: 0,
        minHeight: height,
        paddingTop: 20,
        paddingHorizontal: 10
    },
      title: {
        textAlign: 'center',
        fontSize: 24,
        color: Color.light.text,
        marginBottom: 20,
        fontWeight: '500'
      },
      imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
      },
      imageWrapper: {
        alignItems: 'center',
      },
      labelImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
      },
      uploadText: {
        marginTop: 5,
        color: 'gray',
        fontSize: 14,
      },
      input: {
        backgroundColor:Color.light.background,
        padding: 10,
        marginTop: 10,
        borderRadius: 6,
        textAlign: 'right',
      },
      inputTextArea: {
        backgroundColor: Color.light.background,
        padding: 10,
        marginTop: 10,
        borderRadius: 6,
        textAlign: 'right',
        height: 100,
      },
      button: {
        textAlign: 'center',
        marginTop: 20,
        backgroundColor: Color.light.mainColor,
        padding: 12,
        borderRadius: 6,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        width: 100,
        marginHorizontal: 'auto',
      },
      buttonDis: {
        textAlign: 'center',
        marginTop: 20,
        backgroundColor: Color.light.cardBg,
        padding: 12,
        borderRadius: 6,
        color: Color.light.text,
        fontWeight: 'bold',
        fontSize: 18,
        width: 100,
        marginHorizontal: 'auto',
      },
      buttons: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-evenly',
      },
      labels: {
        flexDirection: 'row-reverse',
        justifyContent: "space-between",
      },
      inputTitle:{
        textAlign: 'right',
        marginRight: 10,
        marginTop: 15,
        color: Color.light.text
      },
      backBtn:{
        padding: 10,
        width: 50,
        borderRadius: 50,
        textAlign: 'center',
        marginTop: 10,

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
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      itemStarsContainer:{
        flexDirection:"row",
        alignItems: "center",
        justifyContent: 'center'
      }
})