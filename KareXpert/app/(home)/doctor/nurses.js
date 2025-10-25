import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NursesListScreen() {
  const [nurses, setNurses] = useState([]);

  useEffect(() => {
    const dummyNurses = [
      { id: 'n1', name: 'Sree Kumar', shift: 'Morning', department: 'ICU', ward: 'Ward 3' },
      { id: 'n2', name: 'Anita Singh', shift: 'Evening', department: 'General', ward: 'Ward 5' },
    ];
    setNurses(dummyNurses);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Nurses List</Text>
        {nurses.map(n => (
          <View key={n.id} style={styles.card}>
            <Text style={styles.name}>{n.name}</Text>
            <Text style={styles.info}>Shift: {n.shift}</Text>
            <Text style={styles.info}>Department: {n.department}</Text>
            <Text style={styles.info}>Ward: {n.ward}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 1
  },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  info: { fontSize: 14, color: '#6b7280', marginTop: 2 },
});
