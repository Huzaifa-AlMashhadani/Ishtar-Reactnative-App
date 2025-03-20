import { View, Text, SafeAreaView, StyleSheet, Image, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
import Images from '@/images/Images';
import Color from '@/contalors/Color';
import { Link, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import useInternetStatus from './useInternetStatus';

const Register = () => {
    const navigation = useNavigation(); // الحصول على navigation باستخدام useNavigation

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [resMasge, setresMasge] = useState("");
    const [loading, setloding] = useState(false);
    const isConnected = useInternetStatus();

    const sendData = async () => {
        if (!name || !number || !password) {
            setresMasge("يرجى ملء جميع الحقول");
            return;
        }

        

        try {
            setloding(true);
            const response = await fetch("http://192.168.56.1/ishtarwebsite/php/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    number: number,
                    password: password
                }),
            });

            const data = await response.json();
            if(data.success === true){
                await AsyncStorage.setItem('userToken', data.user_id); // استبدل بـ توكن مصادق عليه
               await AsyncStorage.setItem('name', data.name); // استبدل بـ توكن مصادق عليه
                navigation.navigate('(tabs)'); // الانتقال إلى الصفحة الرئيسي
                setloding(false)
            }else{
                setloding(false)
                setresMasge(data.message);
            }
            
            
        } catch (error) {
            // setresMasge("حدث خطا غير متوقع " , error)
            setloding(false)
            console.log(error)
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

    return (        <ScrollView>
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
                          <Text style={styles.title}>WELCOME TO ISHTAR </Text>
                      </View>
                      <Text style={styles.headerDet}>{resMasge}</Text>

                      <Text style={styles.inputTitle}> الأسم </Text>
                      <TextInput 
                          placeholder="احمد حسن ..." 
                          placeholderTextColor={Color.light.text}
                          style={styles.input} 
                          value={name} 
                          onChangeText={setName} 
                        
                      />
                      <Text style={styles.inputTitle}>البريد الالكتروني   </Text>
                      <TextInput 
                          placeholder="(اختياري) user@ishtar.com " 
                          placeholderTextColor={Color.light.text}
                          style={styles.input} 
                          value={email} 
                          onChangeText={setEmail} 
                          
                      />
                      <Text style={styles.inputTitle}>رقم الهاتف </Text>
                      <TextInput 
                          placeholder="07811...." 
                          placeholderTextColor={Color.light.text}
                          style={styles.input} 
                          value={number} 
                          onChangeText={setNumber} 
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
                          <Pressable onPress={sendData}>
                          <Text style={styles.btnLogin}> تسجيل </Text>
                      </Pressable>
                      <Pressable>
                          <Text style={styles.register}>
                             هل لديك حساب معنا ! 
                              <Link href={'/login'} style={{ textDecorationLine: 'underline' }}>  تسجيل دخول  </Link>
                          </Text>
                      </Pressable>
                  
                  </View>
              </View>
                  )}
          </SafeAreaView>
      </ScrollView>
    );
}

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
        fontSize: 13
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

export default Register;
