import { View, Text, Image, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../../images/Images';
import Colors from '../../contalors/Color';
import Color from "../../contalors/Color";
import { Link, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook

const { height, width } = Dimensions.get('window');

const Orders = () => {
  const [data, setData] = useState([]); // يجب أن يكون مصفوفة وليس نصًا
  const [error, setError] = useState("");
  const [user_id, setUser_id] = useState(null);
  const router = useRouter();
  const [filterShow, setFilterShow] = useState(false);
  const [searchQuery, setSaerchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isConnected = useInternetStatus();

  const ordersDilverd = data.filter(order => String(order.statues) === "600");
  const ordersFeled = data.filter(order => String(order.statues) === "50");
  const [filterBtnActive, setFilterBtnActive] = useState(null);
  const totalPrice = data.reduce((total, order) => {
    if(order.statues === "600"){
      return total + order.order_price / 1000;
    }
    return total;
  }, 0);

  const translateY = useSharedValue(-10); // يبدأ خارج الشاشة
  const opacity = useSharedValue(0); // شفاف في البداية
  const buttonColor = useSharedValue(Color.light.mainColor); // اللون الافتراضي للزر

  const toggleFilter = () => {
    if (filterShow) {
      // إغلاق النافذة
      translateY.value = withSpring(-10, { damping: 15 }); // انزلاق لأسفل
      opacity.value = withSpring(0);
      buttonColor.value = withSpring(Color.light.mainColor);
      setTimeout(() => setFilterShow(false), 200); // انتظار خروج الأنميشن
    } else {
      // فتح النافذة
      setFilterShow(true);
      translateY.value = withSpring(0, { damping: 15 }); // انزلاق للأعلى
      opacity.value = withSpring(1);
      buttonColor.value = withSpring("#777");
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const buttonAnimatedStyles = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));

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
          `http://192.168.56.1/ishtarwebsite/php/ReactNativeControlerShoworders.php?user_id=${user_id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الطلبات: " + err.message);
      }
    };

    fetchOrders();
  }, [user_id]);

  const ShowItem = (id) => {
    router.push(`items/${id}`);
  };

  // saerch query data inclode 
  const searchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.0.1007ishtarwebsite/php/ReactNativeControlerShoworders.php?user_id=${user_id}`
      );
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // saerch Input IsFOucsed function 
  const onFoucse = () => {
    setIsFocused(true);
    setFilterShow(true);
    translateY.value = withSpring(0, { damping: 15 }); // انزلاق للأعلى
    opacity.value = withSpring(1);
    buttonColor.value = withSpring("#777");
    searchData();
  };

  const onBlurFunction = () => {
    setTimeout(() => {
      setIsFocused(false);
      toggleFilter();
      setSaerchQuery(""); // إعادة تعيين البحث
      setData([]); // إعادة تعيين البيانات عند فقدان التركيز
    }, 200); // انتظار خروج الأنميشن
  };

  const filteredData = data.filter((item) =>
    item.cclaent_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <View style={styles.noInterntPage}>
        <Image source={Images.noInternet} style={styles.nointerntimae} />
        <Text style={styles.nointerntText}> لا يوجد اتصال بالإنترنت</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar / Search */}
      <View style={styles.saerch}>
        <TextInput
          style={styles.saerchInput}
          placeholder="ابحث عن عنصر او طلب ؟ "
          placeholderTextColor="#999"
          onFocus={onFoucse}
          onBlur={onBlurFunction}
          value={searchQuery}
          onChangeText={setSaerchQuery}
        />
        <Pressable onPress={toggleFilter} style={styles.ImageItem}>
          <Animated.View style={[styles.saerchFilter, buttonAnimatedStyles]}>
            <Image source={Images.flitericon} style={{ width: 20, height: 20 }} />
          </Animated.View>
        </Pressable>
      </View>

      {filterShow && (
        <Animated.View style={[styles.filterBox, animatedStyles]}>
          <View style={styles.filterBar}>
            <Pressable onPress={() => setFilterBtnActive("1")}>
              <Text style={[styles.filterOptinText, filterBtnActive === "1" && styles.FilterSelectdStyle]}>
                مثبت
              </Text>
            </Pressable>
            <Pressable onPress={() => setFilterBtnActive("2")}>
              <Text style={[styles.filterOptinText, filterBtnActive === "2" && styles.FilterSelectdStyle]}>
                تم التوصيل
              </Text>
            </Pressable>
            <Pressable onPress={() => setFilterBtnActive("3")}>
              <Text style={[styles.filterOptinText, filterBtnActive === "3" && styles.FilterSelectdStyle]}>
                راجع
              </Text>
            </Pressable>
            <Pressable onPress={() => setFilterBtnActive("4")}>
              <Text style={[styles.filterOptinText, filterBtnActive === "4" && styles.FilterSelectdStyle]}>
                بغداد
              </Text>
            </Pressable>
            <Pressable onPress={() => setFilterBtnActive("5")}>
              <Text style={[styles.filterOptinText, filterBtnActive === "5" && styles.FilterSelectdStyle]}>
                البصره
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {isFocused && (
        <>
          {loading ? (
            <ActivityIndicator size="large" color={Color.light.mainColor} />
          ) : (
            <View style={styles.itemsearchFended}>
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable onPress={() => ShowItem(item.id)}>
                    <View style={styles.itemFeinded}>
                      <Text style={styles.itemFeindedTitle}>{item.cclaent_number}</Text>
                      <Text style={styles.itemFeindedPrice}>{item.cclaent_number} دينار</Text>
                    </View>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <View>
                    <Text style={styles.noResult}>لا توجد نتائج</Text>
                  </View>
                }
              />
            </View>
          )}
        </>
      )}

      {/* Orders Database */}
      <View style={styles.orderDatabaes}>
        <View style={styles.ordersDilvrd}>
          <View style={styles.downDilvrd}>
            <Pressable onPress={() => router.push("../ordersDeilverd/order600")}>
              <Text style={styles.downDilvrdNumber}>{`${ordersDilverd.length}`}</Text>
              <Text style={styles.downDilvrdTitle}>تم التوصيل</Text>
            </Pressable>
          </View>
          <View style={styles.feildDilvrd}>
            <Pressable onPress={() => router.push("../ordersDeilverd/order50")}>
              <Text style={styles.downDilvrdNumber}>{`${ordersFeled.length}`}</Text>
              <Text style={styles.downDilvrdTitle}>راجع</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.MoneyOwed}>
          <Text style={styles.MoneyOwedTitle}>الرصيد المستحق</Text>
          <Text style={styles.MoneyOwedTotle}>{`${(Number(totalPrice)).toFixed(3)} IQD`}</Text>
        </View>
      </View>

      <Text style={styles.Title}>كل الطلبات</Text>
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
                  {item.statues === "200" ? (
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
                    uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${item.order_images.split(',')[0]}`,
                  }}
                  style={styles.LastOrderimage}
                />
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.light.waithColor,
    minHeight: height - 100,
  },
  contactContainer: {
    marginHorizontal: 20,
  },
  Title: {
    marginTop: 20,
    margin: 15,
    marginRight: 25,
    fontSize: 17,
    color: Color.light.text,
  },
  // navbar
  navbar: {
    height: 145,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAcount: {
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: 'center',
  },
  acountImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginLeft: 10,
  },
  AcountName: {
    color: Color.light.text,
    fontWeight: '400',
  },
  logo: {
    color: Color.light.text,
    fontSize: 24,
    marginLeft: 10,
    backgroundColor: Color.light.background,
    padding: 3,
    borderRadius: 50,
  },
  saerch: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  saerchInput: {
    backgroundColor: Color.light.background,
    padding: 10,
    width: '90%',
    // إزالة marginHorizontal: 'auto' لأنها غير مدعومة في React Native
    borderRadius: 4,
    textAlign: "right",
    visibility: 'none',
    fontWeight: '100',
  },
  saerchFilter: {
    backgroundColor: Color.light.mainColor,
    color: Color.light.waithColor,
    borderRadius: 3,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    padding: 8,
  },
  // navbar
  filterBar: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filterOptinText: {
    backgroundColor: Color.light.background,
    padding: 10,
    marginHorizontal: 7,
    borderRadius: 4,
  },
  FilterSelectdStyle: {
    backgroundColor: Color.light.mainColor,
    color: Color.light.waithColor,
  },
  // orders styles start
  Order: {
    backgroundColor: Color.light.background,
    marginTop: 10,
    borderRadius: 4,
    flexDirection: 'row-reverse',
    justifyContent: "space-between",
    alignItems: 'center',
    padding: 10,
  },
  // orders styles end
  // orders Database styles
  orderDatabaes: {
    backgroundColor: Color.light.background,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    zIndex: 3,
  },
  ordersDilvrd: {
    flexDirection: "row-reverse",
    alignItems: 'center',
    justifyContent: "space-around",
  },
  downDilvrd: {
    backgroundColor: 'rgba(34, 236, 27, 0.2)',
    padding: 7,
    borderRadius: 10,
    paddingHorizontal: 30,
    width: '40%',
    alignItems: 'center',
  },
  downDilvrdNumber: {
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
    color: Color.light.text,
  },
  downDilvrdTitle: {
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 13,
    color: Color.light.text,
  },
  feildDilvrd: {
    backgroundColor: 'rgba(236, 27, 27, 0.2)',
    padding: 7,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  MoneyOwed: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 25,
  },
  MoneyOwedTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: Color.light.text,
  },
  MoneyOwedTotle: {
    fontSize: 18,
    fontWeight: '400',
    color: Color.light.text,
  },
  LastOrderimage: {
    width: 50,
    height: 50,
  },
  LastOrderName: {
    marginLeft: 25,
  },
  orderName: {
    textAlign: 'right',
    marginRight: 10,
    width: 100,
  },
  Dilevrdicons: {
    fontSize: 10,
    marginRight: 10,
    color: Color.light.text,
    width: 100,
  },
  itemsearchFended: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    top: 130,
    maxHeight: height - 100,
    backgroundColor: Color.light.background,
    zIndex: 100,
    paddingBottom: 100,
  },
  itemFeinded: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemFeindedTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemFeindedPrice: {
    fontSize: 14,
    color: "gray",
  },
  noResult: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "gray",
  },
  noInterntPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.light.waithColor,
  },
  nointerntText: {
    fontSize: 30,
    color: "#888",
    fontWeight: '500',
  },
  nointerntimae: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
});

export default Orders;
