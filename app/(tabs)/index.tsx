// stale closure: tickref closure pada saat status = 1 dan harus mutasi status dari 0 ke 1 lagi
import { ImageBackground } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ffbb00",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
})

export default function StudyTime() {
    const [tick, setTick] = useState(1);
    const [status, setStatus] = useState(0);
    const [rest, setRest] = useState(0)
    const tickref = useRef(0);
    const restref = useRef(0)
    useEffect(() => {
        if (status === 1) {
          if (tickref.current !== 0) {
            const intervalID = setInterval(() => {
            if (tickref.current !== 0) setTick(prev => prev - 1);
            else if (tickref.current === 0) clearInterval(intervalID);
            else
        }, 100);
        return () => clearInterval(intervalID);
        }
    }
    }, [status]);
    useEffect(() => {
      tickref.current = tick;
    }, [tick]);
    console.log("tickref: ",tickref.current)
    console.log("status: ", status)
    if (tick > 0) {
      return (
      <ImageBackground source={require('/home/benfills/MobileApp/MoramindProject/Moramind/assets/images/StudyWallpaper.webp')} style={styles.container} contentFit={'fill'}>
      <View style={styles.container}>
          <Text> Study Time {tick} </Text>
          <Pressable
          style={styles.button}
          onPress={() => {
            if (status === 0 && tick > 0) {
              setStatus((prev) => prev + 1);
            } else if (status === 0 && tick <= 0) {
              alert("Please Set Your Timer First");
            } else setStatus((prev) => prev - 1);
          }}
        >
          <Text> Start </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setTick((prev) => prev + 60)}
        >
          <Text> Increase Study Time to 60</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setTick((prev) => prev + 120)}
        >
          <Text> Increase Study Time to 120 </Text>
        </Pressable>
        <Pressable>
          <Text> Increase Rest Time to 60 </Text>
        </Pressable>
        <Pressable>
          <Text> Increase Rest Time to 120 </Text>
        </Pressable>
      </View>
      </ImageBackground>
    )}
    else {
      return (
      <ImageBackground source={require('/home/benfills/MobileApp/MoramindProject/Moramind/assets/images/BreakWallpaper.webp')} style={styles.container} contentFit={'fill'}>
      <View style={styles.container2}>
          <Text> Rest Time {rest} </Text>
      </View>
      </ImageBackground>
      )
    }
}

function StartStudy() {
  return (
    <View>
      <Text> Start </Text>
    </View>
  )
}

function StartBreak() {
  
}
