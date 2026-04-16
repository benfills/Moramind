// issue 1 = Dependency Issue: Stale tick state due to missing useEffect dependency
// issue 2 = Closure bug: tick is using an outdated reference of the function

import { ImageBackground } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function StudyTime() {
    const [tick, setTick] = useState(1);
    const [status, setStatus] = useState(0);
    const tickref = useRef(0);
    console.log(tickref.current);
    useEffect(() => {
        if (status === 1) {
          if (tickref.current !== 0) {
            const intervalID = setInterval(() => {
            if (tickref.current !== 0) setTick((prev) => prev - 1);
            else clearInterval(intervalID);
        }, 100);
        console.log(intervalID);
        return () => clearInterval(intervalID);
        }
    }
    }, [status]);
    useEffect(() => {
        tickref.current = tick;
    }, [tick]);
    if (tick !== 0) {
      return (
      <ImageBackground source={require('/home/benfills/MobileApp/MoramindProject/Moramind/assets/images/MainWallpaper.webp')} style={styles.container} contentFit={'fill'}>
      <View style={styles.container}>
          <Text> Study Time {tick} </Text>
          <Text> current Status: {status} </Text>
          <Text> current ref state {tickref.current} </Text>
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
          <Text> Update Status </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setTick((prev) => prev + 60)}
        >
          <Text> Increase to 60</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setTick((prev) => prev + 120)}
        >
          <Text> Increase to 120 </Text>
        </Pressable>
      </View>
      </ImageBackground>
    );
  }
}

function RestTime() {
  const [tick1, setTick1] = useState(0)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
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

});
