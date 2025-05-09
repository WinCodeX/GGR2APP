import React, { useEffect, useState } from 'react'; import { View, Text, StyleSheet, FlatList, SafeAreaView, } from 'react-native';

const PURPLE = '#6272a4'; const BG = '#1e1e2e';

const dummyPackages = [ { id: 1, name: 'John Doe', address: '123 Main St', amount: 500, status: 'awaiting' }, { id: 2, name: 'Jane Smith', address: '456 Side Rd', amount: 750, status: 'processing' }, ];

export default function TrackScreen() { const [packages, setPackages] = useState(dummyPackages);

const renderPackage = ({ item }) => ( <View style={styles.card}> <Text style={styles.name}>{item.name}</Text> <Text style={styles.address}>{item.address}</Text> <Text style={styles.amount}>Ksh {item.amount}</Text> </View> );

return ( <SafeAreaView style={styles.container}> <Text style={styles.header}>My Orders</Text> <FlatList data={packages} keyExtractor={(item) => item.id.toString()} renderItem={renderPackage} /> </SafeAreaView> ); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: BG, padding: 16, }, header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16, }, card: { backgroundColor: '#282a36', padding: 16, borderRadius: 8, marginBottom: 12, }, name: { color: '#fff', fontSize: 18, }, address: { color: '#bbb', marginTop: 4, }, amount: { color: '#fff', fontWeight: 'bold', marginTop: 8, }, });

