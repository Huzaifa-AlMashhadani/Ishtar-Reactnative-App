import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Pressable } from "react-native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost/ishtarwebsite/php/ReactControlerOrdersShow.php") // تأكد من تعديل العنوان حسب جهازك
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطأ في جلب البيانات:", err);
        setLoading(false);
      });
  };

  const onFocusFunction = () => {
    setIsFocused(true);
    fetchData();
  };

  const onBlurFunction = () => {
    setIsFocused(false);
    setSearchQuery(""); // إعادة تعيين البحث
    setData([]); // إعادة تعيين البيانات عند فقدان التركيز
  };

  // تصفية البيانات بناءً على البحث
  const filteredItems = data.filter((item) =>
    item.item_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ابحث عن منتج..."
        onFocus={onFocusFunction}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isFocused && (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.item_id}
              renderItem={({ item }) => (
                <Pressable>
                    <View style={styles.itemFeinded}>
                  <Text style={styles.itemFeindedTitle}>{item.item_title}</Text>
                  <Text style={styles.itemFeindedPrice}>{item.item_price} دينار</Text>
                </View>
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.noResult}>لا توجد نتائج</Text>}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  input: { height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 5 },
  itemFeinded: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  itemFeindedTitle: { fontSize: 16, fontWeight: "bold" },
  itemFeindedPrice: { fontSize: 14, color: "gray" },
  noResult: { textAlign: "center", fontSize: 16, marginTop: 20, color: "gray" }
});

export default SearchScreen;
