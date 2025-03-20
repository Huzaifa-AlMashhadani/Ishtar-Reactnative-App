import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const useInternetStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // تنظيف الاشتراك عند خروج المستخدم
  }, []);

  return isConnected;
};

export default useInternetStatus;
