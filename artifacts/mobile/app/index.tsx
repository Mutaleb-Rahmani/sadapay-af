import React from "react";
import { ActivityIndicator, View } from "react-native";

// AuthWatcher in _layout.tsx handles the redirect.
// This screen is just a loading placeholder shown briefly on startup.
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D1117" }}>
      <ActivityIndicator color="#00C896" size="large" />
    </View>
  );
}
