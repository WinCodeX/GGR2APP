import React, { useState } from 'react'; import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity, } from 'react-native';

const PURPLE = '#bd93f9'; const BG = '#1a1b26';

const dummyPackages = [ { id: 1, name: 'John Smith', address: '123 Main St, Nairobi', amount: 500, status: 'awaiting' }, ];

export default function TrackScreen() { const [packages, setPackages] = useState(dummyPackages); const [search, setSearch] = useState('');

const filteredPackages = packages.filter(pkg => pkg.name.toLowerCase().includes(search.toLowerCase()) );

const renderPackage = ({ item }) => ( <View style={styles.card}> <View style={styles.cardHeader}> <View> <Text style={styles.status}>Pending</Text> <Text style={styles.name}>{item.name}</Text> <Text style={styles.address}>{item.address}</Text> </View> <Text style={styles.amount}>Ksh {item.amount}</Text> </View>

<View style={styles.statusRow}>
    {['awaiting', 'processing', 'out', 'delivered'].map(stage => (
      <View key={stage} style={styles.statusItem}>
        <View style={[styles.dot, item.status === stage && styles.dotActive]} />
        <Text style={[styles.statusLabel, item.status === stage && styles.statusLabelActive]}>
          {stage === 'awaiting'
            ? 'Awaiting Drop-off'
            : stage === 'processing'
            ? 'Processing'
            : stage === 'out'
            ? 'Out for Delivery'
            : 'Delivered'}
        </Text>
      </View>
    ))}
  </View>

  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.trackButton}>
      <Text style={styles.buttonText}>Track order</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.viewAllButton}>
      <Text style={styles.buttonText}>View All</Text>
    </TouchableOpacity>
  </View>
</View>

);

return ( <SafeAreaView style={styles.container}> <View style={styles.header}> <Text style={styles.headerTitle}>My Orders</Text> </View> <TextInput
placeholder="Search packages"
placeholderTextColor="#888"
style={styles.searchInput}
value={search}
onChangeText={setSearch}
/> <FlatList data={filteredPackages} keyExtractor={(item) => item.id.toString()} renderItem={renderPackage} /> </SafeAreaView> ); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: BG, padding: 16, }, header: { marginBottom: 12, }, headerTitle: { color: '#f8f8f2', fontSize: 22, fontWeight: 'bold', }, searchInput: { backgroundColor: '#2e2e3e', color: '#f8f8f2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderColor: PURPLE, borderWidth: 1, marginBottom: 16, }, card: { backgroundColor: '#1e1e2e', borderRadius: 12, padding: 16, marginBottom: 16, }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, }, status: { color: PURPLE, fontSize: 14, marginBottom: 4, }, name: { color: '#f8f8f2', fontSize: 18, fontWeight: 'bold', }, address: { color: '#ccc', fontSize: 14, marginTop: 2, }, amount: { color: '#f8f8f2', fontSize: 16, fontWeight: '600', }, statusRow: { marginTop: 8, }, statusItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#444', marginRight: 8, }, dotActive: { backgroundColor: PURPLE, }, statusLabel: { color: '#555', }, statusLabelActive: { color: '#fff', fontWeight: '500', }, buttonRow: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between', }, trackButton: { flex: 1, backgroundColor: PURPLE, borderRadius: 8, paddingVertical: 10, marginRight: 8, alignItems: 'center', }, viewAllButton: { flex: 1, backgroundColor: '#333', borderRadius: 8, paddingVertical: 10, alignItems: 'center', }, buttonText: { color: '#fff', fontSize: 16, }, });

