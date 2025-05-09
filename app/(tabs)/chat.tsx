// app/(chat)/ChatScreen.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  ticket?: boolean;
  avatar: any;
}

const messages: Message[] = [
  {
    id: '1',
    name: 'Customer Support',
    message: 'We will assist you shortly',
    time: '',
    ticket: true,
    avatar: require('../../assets/images/support.png'),
  },
  {
    id: '2',
    name: 'Sophia',
    message: 'Okay, see you then.',
    time: '9:30',
    avatar: require('../../assets/images/sophia.jpg'),
  },
  {
    id: '3',
    name: 'Lucas Boyd',
    message: 'Sounds good!',
    time: '8:15',
    avatar: require('../../assets/images/lucas.jpg'),
  },
  {
    id: '4',
    name: 'Ethan',
    message: 'Thank you!',
    time: 'Yesterday',
    avatar: require('../../assets/images/ethan.jpg'),
  },
  {
    id: '5',
    name: 'Olivia King',
    message: 'Have a nice day! 😊',
    time: 'Yesterday',
    avatar: require('../../assets/images/olivia.jpg'),
  },
];

export default function ChatScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <View style={styles.meta}>
        {item.ticket ? (
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketText}>TICKET</Text>
          </View>
        ) : (
          <Text style={styles.time}>{item.time}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const PURPLE = '#bd93f9';
const DARK_BG = '#282a36';
const BORDER = '#44475a';
const TICKET_BG = '#50fa7b';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#f8f8f2',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: PURPLE,
    fontSize: 14,
    marginTop: 2,
  },
  meta: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  ticketBadge: {
    backgroundColor: TICKET_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },
});