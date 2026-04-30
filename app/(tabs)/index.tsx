import { ImageBackground, Image } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";

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
      source={require("@/assets/images/StudyWallpaper.webp")}
      style={{ flex: 1 }}
      contentFit={"fill"}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-5 py-6">
        <View className="w-full items-center rounded-2xl bg-white/90 px-6 py-8 shadow-xl elevation-8">
          <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            {" "}
            Study Time{" "}
          </Text>
          {status === 0 ? (
            <View className="mb-8 flex-row items-center justify-center">
              <Text className="mx-4 text-7xl font-black leading-none text-black">
                {curstate}
              </Text>
            </View>
          ) : (
            <View className="mb-8 flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/cat.gif")}
                className="h-20 w-20"
                contentFit="contain"
              />
              <Text className="mx-4 text-7xl font-black leading-none text-black">
                {curstate}
              </Text>
              <Image
                source={require("@/assets/images/cat.gif")}
                className="h-20 w-20"
                contentFit="contain"
              />
            </View>
          )}
          <Pressable
            className="mb-3 h-[52px] w-full items-center justify-center rounded-lg bg-blue-600"
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
            className="mb-2 h-12 w-full items-center justify-center rounded-lg border border-blue-600 bg-transparent"
            onPress={() => setter((prev: number) => prev + 60)}
          >
            <Text className="text-sm font-medium text-blue-600">
              {" "}
              Increase Study Time to 60{" "}
            </Text>
          </Pressable>

          <Pressable
            className="mb-2 h-12 w-full items-center justify-center rounded-lg border border-blue-600 bg-transparent"
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
    <View className="flex-1 w-full">
      <Text> Start Break time </Text>
    </View>
  );
}
