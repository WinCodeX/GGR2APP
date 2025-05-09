// app/(track)/TrackScreen.tsx

import React, { useEffect, useState } from 'react'; import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, TextInput, SafeAreaView, } from 'react-native'; import { Button } from 'react-native-paper'; import { useRouter } from 'expo-router'; import { Package } from '../../lib/types'; // replace with your actual type

const { width } = Dimensions.get('window');

// Theme constants const PURPLE = '#6272a4'; const BG     = '#1e1e2e';

export default function TrackScreen() { const router = useRouter(); const [packages, setPackages] = useState<Package[] | null>(null); const [loading, setLoading] = useState(true); const [search, setSearch] = useState('');

useEffect(() => { // TODO: fetch real packages setTimeout(() => { setPackages([]); // or fetched data array setLoading(false); }, 500); }, []);

if (loading) { return ( <View style={styles.loader}> <Text style={styles.loadingText}>Loading…</Text> </View> ); }

const filtered = packages?.filter(pkg => { const term = search.toLowerCase(); return ( pkg.id.toString().includes(term) || pkg.name.toLowerCase().includes(term) ); });

if (!filtered || filtered.length === 0) { return ( <SafeAreaView style={styles.container}> {/* Header */} <View style={styles.header}> <TouchableOpacity onPress={() => router.back()}> <Image source={require('../../assets/icons/arrow-left-yellow.png')} style={styles.backIcon} /> </TouchableOpacity> <Text style={styles.headerTitle}>My Orders</Text> </View>

{/* Search Bar */}
    <TextInput
      placeholder="Search package"
      placeholderTextColor="#888"
      style={styles.searchInput}
      value={search}
      onChangeText={setSearch}
    />

    {/* Empty State */}
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/images/placeholder-empty.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>You have no packages to show</Text>
      <Button
        mode="contained"
        onPress={() => {/* navigate to send screen */}}
        contentStyle={styles.startBtnContent}
        labelStyle={styles.startBtnLabel}
        style={styles.startBtn}
      >
        Start Sending
      </Button>
    </View>
  </SafeAreaView>
);

}

const renderPackage = ({ item }: { item: Package }) => ( <View style={styles.card}> <View style={styles.cardHeader}> <View> <Text style={styles.name}>{item.name}</Text> <Text style={styles.address}>{item.address}</Text> </View> <Text style={styles.amount}>Ksh {item.amount}</Text> </View>

<View style={styles.statusRow}>
    {['awaiting', 'processing', 'out', 'delivered'].map(stage => (
      <View key={stage} style={styles.statusItem}>
        <View
          style={[styles.dot, item.status === stage && styles.dotActive]}
        />
        <Text
          style={[
            styles.statusLabel,
            item.status === stage && styles.statusLabelActive,
          ]}
        >
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

  <View style={styles.actionRow}>
    <TouchableOpacity style={[styles.actionBtn, styles.trackBtn]}
                      onPress={() => {/* track order */}}>
      <Text style={styles.trackLabel}>Track order</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.actionBtn, styles.viewAllBtn]}
                      onPress={() => {/* view all details */}}>
      <Text style={styles.viewAllLabel}>View All</Text>
    </TouchableOpacity>
  </View>
</View>

);

return ( <SafeAreaView style={styles.container}> {/* Header */} <View style={styles.header}> <TouchableOpacity onPress={() => router.back()}> <Image source={require('../../assets/icons/arrow-left-yellow.png')} style={styles.backIcon} /> </TouchableOpacity> <Text style={styles.headerTitle}>My Orders</Text> </View>

{/* Search Bar */}
  <TextInput
    placeholder="Search package"
    placeholderTextColor="#888"
    style={styles.searchInput}
    value={search}
    onChangeText={setSearch}
  />

  <FlatList
    data={filtered}
    keyExtractor={p => p.id.toString()}
    renderItem={renderPackage}
    contentContainerStyle={styles.list}
  />
</SafeAreaView>

); }

// Stylesheet (outside component) const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 16, }, loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG, }, loadingText: { color: '#fff', },

header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, }, backIcon: { width: 24, height: 24, marginRight: 12, tintColor: '#f1fa8c', }, headerTitle: { color: '#f8f8f2', fontSize: 22, fontWeight: 'bold', },

searchInput: { backgroundColor: '#2e2e3e', color: '#f8f8f2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginBottom: 16, },

emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32, }, emptyImage: { width: width * 0.6, height: width * 0.6, marginBottom: 24, tintColor: '#888', }, emptyText: { color: '#ccc', fontSize: 18, marginBottom: 24, }, startBtn: { borderRadius: 8, }, startBtnContent: { height: 48, }, startBtnLabel: { color: '#fff', fontSize: 16, },

list: { paddingBottom: 16, },

card: { backgroundColor: '#282a36', borderRadius: 12, padding: 16, marginBottom: 16, }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }, name: { color: '#fff', fontSize: 18, fontWeight: '600', }, address: { color: '#888', marginTop: 4, }, amount: { color: '#fff', fontSize: 16, },

statusRow: { marginTop: 16, }, statusItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#444', marginRight: 8, }, dotActive: { backgroundColor: PURPLE, }, statusLabel: { color: '#555', }, statusLabelActive: { color: '#fff', fontWeight: '500', },

actionRow: { flexDirection: 'row', marginTop: 16,

