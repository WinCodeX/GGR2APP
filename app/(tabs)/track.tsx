import React, { useState } from 'react'; import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, } from 'react-native';

const PURPLE = '#6272a4'; const BG = '#1e1e2e';

const dummyPackages = [ { id: 1, name: 'John Doe', address: '123 Main St', amount: 500, status: 'awaiting' }, { id: 2, name: 'Jane Smith', address: '456 Side Rd', amount: 750, status: 'processing' }, ];

export default function TrackScreen() { const [packages, setPackages] = useState(dummyPackages); const [search, setSearch] = useState('');

const filteredPackages = packages.filter(pkg => pkg.name.toLowerCase().includes(search.toLowerCase()) );

const renderPackage = ({ item }) => ( <View style={styles.card}> <Text style={styles.name}>{item.name}</Text> <Text style={styles.address}>{item.address}</Text> <Text style={styles.amount}>Ksh {item.amount}</Text> </View> );

return ( <SafeAreaView style={styles.container}> <View style={styles.header}> <Text style={styles.headerTitle}>My Orders</Text> </View>

<TextInput
    placeholder="Search packages"
    placeholderTextColor="#888"
    style={styles.searchInput}
    value={search}
    onChangeText={setSearch}
  />

  <FlatList
    data={filteredPackages}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderPackage}
  />
</SafeAreaView>

); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: BG, padding: 16, }, header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, }, headerTitle: { color: '#f8f8f2', fontSize: 22, fontWeight: 'bold', }, searchInput: { backgroundColor: '#2e2e3e', color: '#f8f8f2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginBottom: 16, }, card: { backgroundColor: '#282a36', padding: 16, borderRadius: 8, marginBottom: 12, }, name: { color: '#fff', fontSize: 18, }, address: { color: '#bbb', marginTop: 4, }, amount: { color: '#fff', fontWeight: 'bold', marginTop: 8, }, });

