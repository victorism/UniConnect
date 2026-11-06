import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>UniConnect</Text>
      {/* Status row */}
      <View style={styles.statusRow}>
        <View style={styles.statusCircle}><Text>AM +</Text></View>
        <View style={styles.statusCircle}><Text>DO</Text></View>
        <View style={styles.statusCircle}><Text>FA</Text></View>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Following</Text>
        <Text style={styles.tab}>Trending</Text>
        <Text style={styles.tab}>My Department</Text>
      </View>
      {/* Sample post */}
      <View style={styles.post}>
        <Text style={styles.author}>Dr. Daniel Okoh · Lecturer</Text>
        <Text>CSC 301 students: the data structures tutorial moves to a live session tonight at 7pm...</Text>
        <Text style={styles.meta}>Live · 1.2k views · 86 comments · 34 shares</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#0d7a4f', marginBottom: 16 },
  statusRow: { flexDirection: 'row', marginBottom: 16 },
  statusCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  tabs: { flexDirection: 'row', marginBottom: 16 },
  tabActive: { backgroundColor: '#0d7a4f', color: 'white', padding: 8, borderRadius: 20, marginRight: 8 },
  tab: { padding: 8, marginRight: 8 },
  post: { backgroundColor: 'white', padding: 16, borderRadius: 12 },
  author: { fontWeight: 'bold', marginBottom: 4 },
  meta: { color: '#666', marginTop: 8 }
});
