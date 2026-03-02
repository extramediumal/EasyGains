import { View, Text, StyleSheet } from 'react-native';
export default function WeeklyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Weekly View</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18 },
});
