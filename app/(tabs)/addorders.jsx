import React, { useState, useEffect } from 'react';
import { ActivityIndicator,View, Text, SafeAreaView, Image, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFonts, Mirza_500Medium, Mirza_700Bold } from '@expo-google-fonts/mirza';
import Color from '../../contalors/Color';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook
import Images from '../../images/Images';

const AddOrders = () => {
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
    formData.append("descrption", descrption);

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
      const response = await fetch("http://192.168.0.104/ishtarwebsite/php/addorder.php", {
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

  const [loaded, error] = useFonts({
    Mirza_500Medium,
    Mirza_700Bold,
  });

  if (!loaded && !error) {
    return null;
  }
  if (!isConnected) {
    return (
      <View style={styles.noInterntPage}>
        <Image source={Images.noInternet} style={styles.nointerntimae}/>
        <Text style={styles.nointerntText}> لا يوجد اتصال بالإنترنت</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: "#333"}}>

      {loading ? (
                    <ActivityIndicator size="100" style={{marginTop: '50%'}} color="#333" />
                  ) : (
                    <View style={styles.container}>
                    <View style={styles.addOrder}>
                      <Link href="createorder" style={styles.backBtn}><AntDesign name="arrowleft" size={24} color="black" /></Link>
                      <Text style={styles.title}>إنشاء طلب جديد</Text>
          
                      <View style={styles.imagesContainer}>
                        {/* الصورة الأولى */}
                        <Pressable style={styles.imageWrapper} onPress={() => selectImage(setSelectedImage1)}>
                          <Image
                            source={selectedImage1 ? { uri: selectedImage1 } : require('../../assets/images/item-1.jpg')}
                            style={styles.labelImage}
                          />
                          <Text style={styles.uploadText}>اضغط لاختيار الصورة الأولى</Text>
                        </Pressable>
          
                        {/* الصورة الثانية */}
                        <Pressable style={styles.imageWrapper} onPress={() => selectImage(setSelectedImage2)}>
                          <Image
                            source={selectedImage2 ? { uri: selectedImage2 } : require('../../assets/images/item-1.jpg')}
                            style={styles.labelImage}
                          />
                          <Text style={styles.uploadText}>اضغط لاختيار الصورة الثانية</Text>
                        </Pressable>
                      </View>
          
                      <View style={styles.labels}>
                        <TextInput
                            style={[styles.input, {width: "48%"}]}
                            placeholder="الاسم  "
                            placeholderTextColor="rgb(164, 164, 164)"
                            onChangeText={setName}
                            value={name}
                          />
                        <TextInput
                          style={[styles.input, {width: "48%"}]}
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
                        value={price}
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
                        <Pressable onPress={() => Alert.alert("تم!", "تم إدخال البيانات بنجاح.")}>
                        
                          <Text style={styles.buttonDis}>الغاء</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  )}

  
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.light.waithColor,
    flex: 1,
    padding: 20,
    minHeight: 1000,
    borderRadius: 20,
    marginTop: 5
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
    backgroundColor: Color.light.background,
    padding: 10,
    width: 50,
    borderRadius: 50,
    textAlign: 'center',
    position: 'absolute'
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
});

export default AddOrders;
