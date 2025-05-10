import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import BottomTabs from "../../components/BottomTabsAdmin";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { AlignCenter } from "lucide-react-native";
import BottomTabsAdmin from "../../components/BottomTabsAdmin";
import { useRoomList } from "@/hooks/useRoomList";

const router = useRouter();


export default function HomeScreen() {
  const {rooms, loading, error} = useRoomList();
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const vacantCount = safeRooms.filter((room) => room.status === "vacant").length;
  const occupiedCount = safeRooms.filter((room) => room.status === "occupied").length;
  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">4Bros</Text>
        <Feather name="menu" size={24} color="black" />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome!</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
        <Pressable style={styles.tabButton}>
            <LinearGradient
                colors={['rgba(45, 179, 152, 0.88)', 'rgb(61, 200, 172)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
            /> 
                <Text style={[styles.tabText, { color: "white" }]}>Phòng trống</Text>
                <Text style={[styles.tabBottomNum,{color:"#2DB398"}]}>{vacantCount}</Text>   
        </Pressable>
        <Pressable style={styles.tabButton}>
            <LinearGradient
                colors={['rgb(230, 92, 74)', 'rgb(246, 128, 112)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
            /> 
                <Text style={[styles.tabText, { color: "white" }]}>Phòng đã thuê</Text>
                <Text style={[styles.tabBottomNum,{color:"#E65D4A"}]}>{occupiedCount}</Text>   
        </Pressable>
        <Pressable style={[styles.tabButton, {height:135}]} onPress={() => router.push('/electionList')}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <FontAwesome5 name="vote-yea" size={32} color="black" />
                <Text style={[styles.tabText, { color: "black", marginTop: 8 }]}>Bầu cử</Text>
            </View>
        </Pressable>
        <Pressable style={[styles.tabButton, {height:135}]} onPress={() => router.push('/Notification')}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <FontAwesome5 name="bell" size={32} color="black" />
                <Text style={[styles.tabText, { color: "black", marginTop: 8 }]}>Danh sách thông báo</Text>
            </View>
        </Pressable>
        <Pressable style={[styles.tabButton, { height: "60%", width: "100%" }]}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome5 name="frown" size={164} color="red" />
                <View style={{ position: 'absolute', top: 0, left: 0 }}>
                <Text style={[styles.tabText, { color: "black" }]}>Khiếu nại</Text>
                </View>
            </View>
        </Pressable>
        </View>

      </ScrollView>
      <BottomTabsAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // backgroundColor: "red",
    padding: 10,
    marginBottom: 16,
    height: 600,
    justifyContent: "space-between",
  },
  tabButton: {
    width: '48%',        
    padding: 20,
    height: 80,
    borderRadius: 12,
    marginBottom: 10,       
    marginHorizontal: '1%', 
    position: 'relative',
    backgroundColor:"white",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  tabText: {
    color:"white",
    fontWeight:"bold",
    fontSize:15,
  },
  tabBottomNum: {
    textAlign: 'center',         
    padding: 0,                   
    width: 20,
    height: 20,
    borderRadius: 50,            
    backgroundColor: "white",
    right: 10,
    bottom: 10,
    position:"absolute"   
  },
});
