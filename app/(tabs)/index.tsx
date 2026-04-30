import { ImageBackground, Image } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";

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
      source={require("@/assets/images/StudyWallpaper.webp")}
      style={{ flex: 1 }}
      contentFit={"fill"}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 24,
        }}
        className="bg-black/40"
      >
        <View
          style={{ width: "100%", alignItems: "center", padding: 24 }}
          className="rounded-2xl bg-white/90 shadow-xl"
        >
          <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            {" "}
            Study Time{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Image
              source={require("@/assets/images/cat.gif")}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
            <Text
              style={{
                marginHorizontal: 16,
                fontSize: 72,
                fontWeight: "900",
                lineHeight: 80,
              }}
              className="text-black"
            >
              {curstate}
            </Text>
            <Image
              source={require("@/assets/images/cat.gif")}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
          </View>
          <Pressable
            style={{
              height: 52,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
            className="rounded-lg bg-blue-600"
            onPress={() => {
              if (status === 0 && curstate > 0) {
                setStatus((prev) => prev + 1);
              } else if (status === 0 && curstate === 0) {
                alert("Please Set Your Timer First");
              } else setStatus((prev) => prev - 1);
            }}
          >
            {status === 0 ? (
              <Text className="text-base font-semibold text-white">
                {" "}
                Start Study{" "}
              </Text>
            ) : (
              <Text className="text-base font-semibold text-white">
                {" "}
                Stop Study{" "}
              </Text>
            )}
          </Pressable>
          <Pressable
            style={{
              height: 48,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
            className="rounded-lg border border-blue-600 bg-transparent"
            onPress={() => setter((prev: number) => prev + 60)}
          >
            <Text className="text-sm font-medium text-blue-600">
              {" "}
              Increase Study Time to 60{" "}
            </Text>
          </Pressable>

          <Pressable
            style={{
              height: 48,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
            className="rounded-lg border border-blue-600 bg-transparent"
            onPress={() => setter((prev) => prev + 120)}
          >
            <Text className="text-sm font-medium text-blue-600">
              {" "}
              Increase Study Time to 120{" "}
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

function StartBreak() {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Text> Start Break time </Text>
    </View>
  );
}
