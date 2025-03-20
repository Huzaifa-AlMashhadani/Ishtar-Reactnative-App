import { Text, View, SafeAreaView, StyleSheet , Image, ScrollView, TextInput, StatusBar, Pressable , ActivityIndicator} from "react-native";
import Images from '../../images/Images';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import Color from "../../contalors/Color";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { FlatList, RefreshControl } from "react-native";
import useInternetStatus from "../useInternetStatus"; // استيراد الـ Hook



export default function Index() {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(null);
  const [user_id, Setuser_id] = useState(null)
  const [user_Image, setUser_image] = useState("defult.jpg");
  const [filterShow, setFilterShow] = useState(false);
  const [filterBtnActive, setFilterBtnActive] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null); // إنشاء مرجع
    const isConnected = useInternetStatus();




  const translateY = useSharedValue(-10); // يبدأ خارج الشاشة
  const opacity = useSharedValue(0); // شفاف في البداية
  const buttonColor = useSharedValue(Color.light.mainColor); // اللون الافتراضي للزر


    useEffect(() => {
      fetch(`http://192.168.56.1/ishtarwebsite/php/ReactControlerOrdersShow.php`)
        .then(response => response.json())
        .then(responseData => {
          setData(responseData.slice(0,4))// إزالة الأقواس [] لتجنب خطأ في بنية البيانات
        })
        .catch(err => {
          setError(err.message);
        });
    }, []);
    const onRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        fetch(`http://192.168.56.1/ishtarwebsite/php/ReactControlerOrdersShow.php`)
        .then(response => response.json())
        .then(responseData => {
          setData(responseData)// إزالة الأقواس [] لتجنب خطأ في بنية البيانات
        })
        .catch(err => {
          setError(err.message);
        });
        setRefreshing(false);
      }, 2000); // محاكاة تحميل البيانات
    };

  const toggleFilter = () => {
    if (filterShow) {
      // إغلاق النافذة
      translateY.value = withSpring(-10, { damping: 15 }); // انزلاق لأسفل
      opacity.value = withSpring(0);
      buttonColor.value = withSpring(Color.light.mainColor)
      setTimeout(() => setFilterShow(false), 200); // انتظار خروج الأنميشن
    } else {
      // فتح النافذة
      setFilterShow(true);
      translateY.value = withSpring(0, { damping: 15 }); // انزلاق للأعلى
      opacity.value = withSpring(1);
      buttonColor.value = withSpring("#777")

    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  
  const buttonAnimatedStyles = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));


  useEffect(() => {
  const getUserToken = async () => {
    try {
      const value = await AsyncStorage.getItem('name'); // استرجاع القيمة كنص
  
      if (value !== null) {

        Setuser_id(value)
      } else {
        console.log('❌ لا توجد بيانات مخزنة!');
      }
    } catch (error) {
      console.error('❌ خطأ أثناء جلب البيانات:', error);
    }
  };
  getUserToken()

}, []); 
  // دالة لتغيير اللون عند الضغط على الزر
  const Showitem = (itemShow)=>{
    router.push(`itemShow/${itemShow}`)
  }
  const fetchData = () => {
    setLoading(true);
    fetch("http://192.168.56.1/ishtarwebsite/php/ReactControlerOrdersShow.php") // تأكد من تعديل العنوان حسب جهازك
      .then((response) => response.json())
      .then((responseData) => {
        setSearchData(responseData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطأ في جلب البيانات:", err);
        setLoading(false);
      });
  };

  const onFocusFunction = () => {
    setIsFocused(true);
       setFilterShow(true);
        translateY.value = withSpring(0, { damping: 15 }); // انزلاق للأعلى
        opacity.value = withSpring(1);
        buttonColor.value = withSpring("#777")
    fetchData();
  };

  const onBlurFunction = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSearchQuery(""); // إعادة تعيين البحث
      toggleFilter()
      setSearchData([]); // إعادة تعيين البيانات عند فقدان التركيز
    }, 200); // انتظار خروج الأنميشن

  };

  // تصفية البيانات بناءً على البحث
  const filteredItems = searchData.filter((item) =>
    item.item_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saerchItemName = (val)=>{
    if(inputRef.current){
      inputRef.current.focus();
      setSearchQuery(val)
    }
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


          <SafeAreaView style={styles.container }>
      
      <StatusBar hidden={false}  barStyle="dark-content"/> 

  {/* <ScrollView
  showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    contentContainerStyle={{flexGrow:1}}
          refreshControl={
                   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                 }> */}

 
    
  {/* navbar */}
  
    <View style={styles.navbar}>
      <View style={styles.header}>
       <Link href="Notification"><Text><EvilIcons name="bell" size={24} color={Color.light.text} style={styles.logo} /></Text> </Link>
        <View style={styles.headerAcount}>
          <View>       
            <Text style={[styles.AcountName, {textAlign: 'right'}]}>Hi </Text>
            <Text style={styles.AcountName}> {user_id}</Text>
          </View>
          
          <Link href={"/profile"}>
          <Image source={{  uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/${user_Image}` }}  style={styles.acountImage} />
          </Link>
        </View>
      </View>
      <View style={styles.saerch}>
        <TextInput style={styles.saerchInput} placeholder="ابحث عن عنصر او طلب ؟ "
       placeholderTextColor="#999"
       onFocus={onFocusFunction}
       onBlur={onBlurFunction}
       value={searchQuery}
       onChangeText={setSearchQuery}
       ref={inputRef}
        
        />

          
      <Pressable   onPress={toggleFilter} style={[styles.ImageItem]}>
      <Animated.View  style={[styles.saerchFilter, buttonAnimatedStyles]} ><Image source={Images.flitericon} style={{width: 20, height: 20}}/></Animated.View>
        </Pressable>
      </View>
    </View>
    {isFocused && (
                <>
                  {loading ? (
                  <ActivityIndicator size="large" color={Color.light.mainColor} />
                  ) : (
                  <View style={styles.itemsearchFended}>
                      <FlatList
                      style={{maxHeight: 500}}
                      data={filteredItems}
                      keyExtractor={(item, index) => item.item_id?.toString() || index.toString()}  // تعيين مفتاح فريد
                      nestedScrollEnabled={true} // تمكين التمرير المتداخل
                      contentContainerStyle={styles.itemsearchFend}
                      renderItem={({ item }) => (
                        <Pressable onPress={()=>Showitem(item.item_id)}>
                         <View style={styles.itemFeinded}>
                          <Text style={styles.title}>{item.item_title}</Text>
                          <Text style={styles.price}>{item.item_price} دينار</Text>
                        </View>
                       </Pressable>
                      )}
                      ListEmptyComponent={<Text style={styles.noResult}>لا توجد نتائج</Text>}

                    />
                  </View>
                  )}
                </>
              )}
    {filterShow && (
        <Animated.View style={[styles.filterBox, animatedStyles]} >
          <View style={styles.filterBar}>
            <Pressable onPress={()=>{setFilterBtnActive("1"); saerchItemName("مناسبات")}}><Text style={[styles.filterOptinText, filterBtnActive === "1" && styles.FilterSelectdStyle]}>مناسبات  </Text></Pressable>
            <Pressable onPress={()=>{setFilterBtnActive("4"); saerchItemName("ذكرى")}}><Text style={[styles.filterOptinText, filterBtnActive === "4" && styles.FilterSelectdStyle]}>ذكرى  </Text></Pressable>
            <Pressable onPress={()=>{setFilterBtnActive("2"); saerchItemName("عرض")}}><Text style={[styles.filterOptinText, filterBtnActive === "2" && styles.FilterSelectdStyle]}> عروض خاصه   </Text></Pressable>
            <Pressable onPress={()=>{setFilterBtnActive("3"); saerchItemName("جديد")}}><Text style={[styles.filterOptinText, filterBtnActive === "3" && styles.FilterSelectdStyle]}>  جديد   </Text></Pressable>
          </View>
        </Animated.View>
      )}
    {/* navber  */}


    <View style={styles.HomePgae}>
    <View style={styles.ItemsContainer}>
    <View style={styles.titlesection}>
        <Text style={styles.seeMore}>عرض الكل  </Text>
        <Text style={styles.title}>العناصر  </Text>
      </View>
    <ScrollView horizontal={true}
    nestedScrollEnabled={true} // تمكين التمرير المتداخل
    showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false} >
    <View style={styles.BestItems}>

      <View style={styles.BestItem} >
      <Pressable onPress={()=>saerchItemName("اكسسورارت")}>
      <View style={styles.ImageItem}><Image style={styles.BsetItemsimage} source={Images.gadget} /></View>
      <Text style={styles.BestItemTitle}> اكسسورارت  </Text>
      </Pressable>
      </View>
      <View style={styles.BestItem} >
      <Pressable onPress={()=>saerchItemName("لوحات")}>
      <View style={styles.ImageItem}><Image style={styles.BsetItemsimage} source={Images.canvas} /></View>
      <Text style={styles.BestItemTitle}> لوحات </Text>
      </Pressable>
      </View>
      <View style={styles.BestItem} >
      <Pressable onPress={()=>saerchItemName("مكتب")}>
      <View style={styles.ImageItem}><Image style={styles.BsetItemsimage} source={Images.workspace} /></View>
      <Text style={styles.BestItemTitle}> مكتب </Text>
      </Pressable>
      </View>
      <View style={styles.BestItem} >
      <Pressable onPress={()=>saerchItemName("مكتب")}>
      <View style={styles.ImageItem}><Image style={styles.BsetItemsimage} source={Images.workspace} /></View>
      <Text style={styles.BestItemTitle}> مكتب </Text>
      </Pressable>
      </View>
      <View style={styles.BestItem} >
      <Pressable onPress={()=>saerchItemName("مكتب")}>
      <View style={styles.ImageItem}><Image style={styles.BsetItemsimage} source={Images.workspace} /></View>
      <Text style={styles.BestItemTitle}> مكتب </Text>
      </Pressable>
      </View>
       </View>
    </ScrollView>
    </View>
   
    {/* best items  */}
    {/* BestProduct  */}
    <View style={styles.BestProducts}>
    <View style={styles.titlesection}>
       <Link href="createorder"><Text style={styles.seeMore}>عرض الكل  </Text></Link> 
        <Text style={styles.title}>الأكثر مبيعا </Text>
      </View>     
       <View style={styles.products}>
           <FlatList
                 data={data}
                 keyExtractor={(item, index) => item.item_id?.toString() || index.toString()}  // تعيين مفتاح فريد
                 contentContainerStyle={styles.products}
                 style={{height: 420}}
                //  nestedScrollEnabled={true} // تمكين التمرير المتداخل
                 ListEmptyComponent={<Text style={styles.emptyText}>لا يوجد عناصر </Text>}
                 renderItem={({ item }) => (
                   <Pressable onPress={()=>Showitem(item.item_id)}>
                   <View style={styles.product}>
                   <Image source={{uri: `http://192.168.56.1/ishtarwebsite/php/Orders_images/` + item.item_images.split(',')[0]}}  style={styles.productImage} />
                   <Text style={styles.itemTitle}>{item.item_id}</Text>
                   <View style={styles.contactItem}>
                     <View style={styles.stars}>
                     <Text>5.0</Text> 
                     <MaterialCommunityIcons name="star-minus" size={20} color="#fb8500" />
                     </View>
                     <Text style={styles.itemDescrption} numberOfLines={1}>هناك حقيقة مثبتة منذ زمن طويل وهي </Text>
                   </View>
               </View>
               </Pressable>
                 )}
                 />
      </View>
    </View>
    {/* BestProduct  */}
    </View>
    {/* </ScrollView> */}
    </SafeAreaView>

   

  


  );
}

const styles = StyleSheet.create({

container:{
 backgroundColor: Color.light.waithColor,
  flex: 1,
  maxHeight: 900
}, 

// navbar 
navbar:{
  height: 145,
  paddingTop: 10,
  paddingHorizontal: 5,

},
header:{
justifyContent: 'space-between',
flexDirection: 'row',
alignItems: 'center'
},
headerAcount:{
justifyContent: "center",
flexDirection: 'row',
alignItems: 'center'
},
acountImage:{
  height:40,
  width: 40,
  borderRadius: 50,
  marginLeft: 10
},
AcountName:{
  color: Color.light.text,
  fontWeight: '400'
},
logo:{
  color: Color.light.text,
  fontSize: 24,
  marginLeft: 10,
  backgroundColor: Color.light.background,
  padding: 3,
  borderRadius: 50
},
saerch:{
  marginTop: 25,
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 25
},
saerchInput:{
  backgroundColor:Color.light.background,
  padding:10,
  width: '90%',
  marginHorizontal: 'auto',
  borderRadius: 6,
  textAlign: "right",
  visibility: 'none',
  fontWeight: '100'
  
},
saerchFilter:{
backgroundColor:  Color.light.mainColor,
color: Color.light.waithColor,
padding:9,
borderRadius: 3,
marginLeft: 5,
justifyContent: 'center',
alignItems: 'center',
display: 'flex'
},
// navbar 

// discout slider 

discountSilder:{
// width: 1000,
marginTop: 30,
marginHorizontal: 10,


},
sliderImages:{
  flexDirection: "row-reverse",
  marginTop: 10,
  marginLeft: -100
  
},
titlesection:{
marginBottom: 10,
flexDirection: 'row',
justifyContent: "space-between",
alignItems:"center"
},
title:{
textAlign: "rtl",
fontSize: 16,
fontWeight: '500',
color: Color.light.text
},
seeMore:{
color: Color.light.text,
fontWeight: '100',
fontSize: 12
},
ImageSilder:{
  width: 200,
  height: 120,
  borderRadius: 6,
  marginRight: 10
},
// discout slider  

// Best Items 
ItemsContainer:{

  padding: 10
},
BestItems:{
marginTop: 10,
flexDirection: 'row',
justifyContent: 'space-between'
},
BestItem:{
justifyContent: 'center',
alignItems: 'center',
marginHorizontal: 10,
backgroundColor: Color.light.background,
padding: 10,
borderRadius: 6
},
ImageItem:{
  backgroundColor: Color.light.waithColor,
  borderRadius: 50,
  padding:10,
  
},
BsetItemsimage:{
  width: 50,
  height: 50,
  marginHorizontal: 'auto',

},
BestItemTitle:{
color: Color.light.text,
fontWeight: '200',
textAlign: 'center',
marginTop: 5
},

// Best Items 
// Best Products 
BestProducts:{
marginTop: 30,
marginBottom: 30,
marginHorizontal: 10
},
products:{
marginTop: 10,
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent:"space-evenly"
},
 product:{
marginTop: 20,
backgroundColor: Color.light.background,
borderRadius: 4,
width: 150,
paddingBottom: 10


},
productImage:{
width:"100%",
height: 150,
borderRadius: 3,
marginTop: -10

},
itemTitle:{
textAlign: 'right',
color: Color.light.text,
width: "100%",
padding: 5,
fontSize: 18
},
itemDescrption:{
color: Color.light.text,
textAlign: 'right',
padding: 5,
fontSize: 12,
fontWeight: '100',
width: "70%",
overflow: "hidden"
},
contactItem:{
justifyContent: "space-between",
alignItems: 'center',
flexDirection: 'row'
},
stars:{
  flexDirection: 'row',
  marginLeft: 10
  },
// Best Products 
filterBar:{
  flexDirection: 'row'
},
filterOptinText:{
  backgroundColor: Color.light.background,
  padding: 10,
  marginHorizontal: 10,
  borderRadius: 4
},
FilterSelectdStyle:{
  backgroundColor: Color.light.mainColor,
  color: Color.light.waithColor
},
itemsearchFended:{
flex: 1,
position: 'absolute',
width: '100%',
top: 200,
backgroundColor: Color.light.background,
zIndex: 100
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

})
