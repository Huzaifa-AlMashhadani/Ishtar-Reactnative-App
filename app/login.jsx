import { View, Text, SafeAreaView, StyleSheet, Image, TextInput, Pressable, ScrollView, Alert, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Images from '@/images/Images';
import Color from '@/contalors/Color';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; // استيراد useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useInternetStatus from "./useInternetStatus"; // استيراد الـ Hook


const { height, width } = Dimensions.get('window');

  
const Login = () => {

    const navigation = useNavigation(); // الحصول على navigation باستخدام useNavigation

    const [Phnumber, setPhnumber] = useState("");
    const [password, setPassword] = useState("");
    const [res, setRes] = useState("");
    const [loading , setLoding] = useState(false);
    const isConnected = useInternetStatus();

    const send = async () => {
        if (!Phnumber || !password) {
            setRes("يرجى ملء جميع الحقول");
            return;
        }
        setLoding(true)
        try {
            const response = await axios.post('http://192.168.56.1/ishtarwebsite/php/login.php', {
                    PhnumberR: Phnumber,
                    passwordR: password,
            });

            if (response.data.success === true) {
                // حفظ الجلسة
              
               await AsyncStorage.setItem('userToken', response.data.user_id); // استبدل بـ توكن مصادق عليه
               await AsyncStorage.setItem('name', response.data.name); // استبدل بـ توكن مصادق عليه
               if(response.data.image !== null || response.data.image !== ""){
                await AsyncStorage.setItem('image', response.data.image); // استبدل بـ توكن مصادق عليه
                }
                navigation.navigate('(tabs)'); // الانتقال إلى الصفحة الرئيسي
                setLoding(false);
              } else {
                setLoding(false)
                setRes(response.data)
              }

        } catch (error) {
            console.error("Error:", error);
            setLoding(false)
            setRes("حدث خطأ أثناء تسجيل الدخول");
        }
    };
    if (!isConnected) {
        return (
          <View style={styles.noInterntPage}>
            <Text style={styles.nointerntText}>🚫 لا يوجد اتصال بالإنترنت</Text>
            <Image source={Images.noInternet} style={styles.nointerntimae}/>
          </View>
        );
      }
    return (
        <ScrollView>
          <StatusBar hidden={false}  barStyle="dark-content"/> 
            <SafeAreaView>
            {loading ? (
                    <ActivityIndicator size="100" style={{marginTop: '50%'}} color="#333" />
                  ) : (
                <View style={styles.container}>
                    <Image source={Images.profileBg} style={styles.loginImage} />
                    <Image source={Images.appIcon} style={styles.appicon} />
                    <View style={styles.bgOpastiy}></View>
                    <View style={styles.loginField}>
                        <View style={styles.header}>
                            <Text style={styles.title}>WELCOME BACK</Text>
                            <Text style={styles.headerDet}>{res}</Text>
                        </View>
                        <Text style={styles.inputTitle}>رقم الهاتف </Text>
                        <TextInput 
                            placeholder="07811...." 
                            placeholderTextColor={Color.light.text}
                            style={styles.input} 
                            value={Phnumber} 
                            onChangeText={setPhnumber} 
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                         <Text style={styles.inputTitle}> كلمة المرور  </Text>

                        <TextInput 
                            placeholder=" ********"  
                            placeholderTextColor={Color.light.text}
                            style={styles.input} 
                            value={password} 
                            onChangeText={setPassword} 
                            secureTextEntry={true}
                        />
                            <Pressable onPress={send}>
                            <Text style={styles.btnLogin}> تسجيل </Text>
                        </Pressable>
                        <Pressable>
                            <Text style={styles.register}>
                                ألا تملك حسابًا معنا؟ 
                                <Link href={'/register'} style={{ textDecorationLine: 'underline' }}> احصل على حساب </Link>
                            </Text>
                        </Pressable>
                    
                    </View>
                </View>
                  )}
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.light.mainColor,
        flex: 1
    },
    loginImage: {
        width: "100%",
        height: 300,
    },
    appicon:{
        width: 80,
        height: 80,
        zIndex: 10,
        position: 'absolute',
        top: 80,
        left: '43%',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        
    },
    bgOpastiy:{
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        top: 0,
        zIndex: 1,
        height: 300,
        width: '100%'
    },
    loginField: {
        marginTop: -100,
        width: '100%',
        borderTopLeftRadius: 70,
        alignSelf: 'center',
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: Color.light.background,
        padding: 10,
        minHeight: "100vh",
        zIndex: 3
    },
    header: {
        borderBottomColor: "#333",
        borderBottomWidth: 1,
        padding: 10,
        width: "70%",
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 50
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerDet: {
        fontSize: 12,
        textAlign: 'center',
        color: 'red',
        marginTop: 5
    },
    input: {
        textAlign: 'right',
        borderBottomColor: '#ccc',
        padding: 10,
        marginTop: 10,
        width: '90%',
        borderBottomWidth: 1,
        borderRadius: 5,
        alignSelf: 'center'
    },
    inputTitle:{
        textAlign: "right",
        marginRight: 20,
        fontSize: 17,
        color: Color.light.text,
        marginTop: 20
    },
    btnLogin: {
        backgroundColor: Color.light.mainColor,
        padding: 10,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 20,
        color: '#fff',
        textAlign: 'center',
        width: "80%",
        marginHorizontal: "auto"
    },
    register: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 13,
        minHeight: height -500
        
    },
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

export default Login;
