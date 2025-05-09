// app/(track)/TrackScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Package } from '../../lib/types'; // your package type

const { width } = Dimensions.get('window');

export default function TrackScreen() {
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with your real data fetch
    (async () => {
      // const res = await api.get('/rider/packages');
      // setPackages(res.data);
      setTimeout(() => {
        setPackages([]); // or [ { id:..., name:..., address:..., amount:..., status: 'pending' } ]
        setLoading(false);
      }, 500);
    })();
  }, []);

  if (loading) {
    return <View style={styles.loader}><Text>Loading…</Text></View>;
  }

  if (!packages || packages.length === 0) {
    return (
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
    );
  }

  const renderPackage = ({ item }: { item: Package }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <Text style={styles.amount}>Ksh {item.amount}</Text>
      </View>

      <View style={styles.statusRow}>
        {['awaiting', 'processing', 'out', 'delivered'].map((stage, idx) => (
          <View key={stage} style={styles.statusItem}>
            <View
              style={[
                styles.dot,
                item.status === stage && styles.dotActive,
              ]}
            />
            <Text style={[
              styles.statusLabel,
              item.status === stage && styles.statusLabelActive
            ]}>
              {stage === 'awaiting' ? 'Awaiting Drop-off'
                : stage === 'processing' ? 'Processing'
                : stage === 'out' ? 'Out for Delivery'
                : 'Delivered'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.trackBtn]}
          onPress={() => {/* track order */}}
        >
          <Text style={styles.trackLabel}>Track order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.viewAllBtn]}
          onPress={() => {/* view all details */}}
        >
          <Text style={styles.viewAllLabel}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={packages}
      keyExtractor={(p) => p.id.toString()}
      renderItem={renderPackage}
      contentContainerStyle={styles.list}
    />
  );
}

const PURPLE = '#6272a4';
const LIGHT_BG = '#222';

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: LIGHT_BG,
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 24,
    tintColor: '#888',
  },
  emptyText: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 24,
  },
  startBtn: {
    borderRadius: 8,
  },
  startBtnContent: {
    height: 48,
  },
  startBtnLabel: {
    color: '#fff',
    fontSize: 16,
  },

  // List
  list: {
    padding: 16,
    backgroundColor: LIGHT_BG,
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { color: '#fff', fontSize: 18, fontWeight: '600' },
  address: { color: '#888', marginTop: 4 },
  amount: { color: '#fff', fontSize: 16 },

  // Status
  statusRow: {
    flexDirection: 'column',
    marginTop: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginRight: 8,
  },
  dotActive: {
    backgroundColor: PURPLE,
  },
  statusLabel: { color: '#555' },
  statusLabelActive: { color: '#fff', fontWeight: '500' },

  // Actions
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  trackBtn: {
    backgroundColor: PURPLE,
    marginRight: 8,
  },
  trackLabel: { color: '#fff', fontSize: 16 },
  viewAllBtn: {
    backgroundColor: '#333',
  },
  viewAllLabel: { color: '#fff', fontSize: 16 },
});