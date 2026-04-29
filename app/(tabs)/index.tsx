import { ImageBackground } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

// Goal: Solve unstoppable tick update
export default function Mainpage() {
  const [tick, setTick] = useState(0);
  console.log(tick);
  if (tick >= 0) {
    return <StartStudy setter={setTick} curstate={tick} />;
  } else {
    return <StartBreak />;
  }
}

function StartStudy({
  setter,
  curstate,
}: {
  curstate: number;
  setter: (fn: (prev: number) => number) => void;
}) {
  const [status, setStatus] = useState(0);
  const curref = useRef(0);
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (status === 1) {
        if (curref.current !== 0) setter((prev) => prev - 1);
        else clearInterval(intervalID);
      }
    }, 100);
    return () => clearInterval(intervalID);
  }, [status, curstate]);
  useEffect(() => {
    curref.current = curstate;
  }, [curstate]);
  if (status === 1 && curstate === 0) setStatus((prev) => prev - 1);
  return (
    <ImageBackground
      source={require("/home/benfills/MobileApp/MoramindProject/Moramind/assets/images/StudyWallpaper.webp")}
      style={styles.overlay}
      contentFit={"fill"}
    >
      <View style={styles.card}>
        <Text style={styles.title}> Study Time </Text>
        <Text style={styles.timerValue}> {curstate} </Text>
        <Pressable
          style={styles.buttonMain}
          onPress={() => {
            if (status === 0 && curstate > 0) {
              setStatus((prev) => prev + 1);
            } else if (status === 0 && curstate === 0) {
              alert("Please Set Your Timer First");
            } else setStatus((prev) => prev - 1);
          }}
        >
          {status === 0 ? (
            <Text style={styles.buttonTextMainStart}>
              {" "}
              Start Study {status}{" "}
            </Text>
          ) : (
            <Text style={styles.buttonTextMainStart}>
              {" "}
              Stop Study {status}{" "}
            </Text>
          )}
        </Pressable>
        <Pressable
          style={styles.buttonOutline}
          onPress={() => setter((prev: number) => prev + 60)}
        >
          <Text style={styles.buttonTextOutline}>
            {" "}
            Increase Study Time to 60{" "}
          </Text>
        </Pressable>
        <Pressable
          style={styles.buttonOutline}
          onPress={() => setter((prev) => prev + 120)}
        >
          <Text style={styles.buttonTextOutline}>
            {" "}
            Increase Study Time to 120{" "}
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

function StartBreak() {
  return (
    <View style={styles.container}>
      <Text> Start Break time </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: "800",
    color: "#000",
    marginBottom: 24,
  },
  buttonMain: {
    backgroundColor: "#0062ff",
    height: 52,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    height: 48,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0062ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  buttonTextMainStart: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextOutline: {
    color: "#0062ff",
    fontSize: 14,
    fontWeight: "500",
  },
});
