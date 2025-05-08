import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const toastConfig = {
  successToast: ({ text1 }: any) => (
    <View style={[styles.toast, { backgroundColor: '#50fa7b' }]}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  warningToast: ({ text1 }: any) => (
    <View style={[styles.toast, { backgroundColor: '#f1fa8c' }]}>
      <Text style={styles.toastTextDark}>{text1}</Text>
    </View>
  ),
  defaultToast: ({ text1 }: any) => (
    <View style={[styles.toast, { backgroundColor: '#bd93f9' }]}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 50,
    elevation: 5,
    alignItems: 'center',
  },
  toastText: {
    color: '#f8f8f2',
    fontSize: 14,
  },
  toastTextDark: {
    color: '#282a36',
    fontSize: 14,
  },
});