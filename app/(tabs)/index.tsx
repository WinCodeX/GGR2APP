import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Images from '../../assets';
//import FloatingMenu from '../../components/FloatingMenu';

const data = [
  { id: '1', title: 'Clothing Store', time: '2h', image: Images.cloth },
  { id: '2', title: 'Kenya Cafe', desc: 'New shelf items available', rating: 4.5, image: Images.cafe },
  { id: '3', title: 'Café', time: '2h', image: Images.coffee },
  { id: '4', title: 'New Smartphone', desc: 'Sponsored', image: Images.phone },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#282a36', paddingHorizontal: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
        <Text style={{ color: '#f8f8f2', fontSize: 26, fontWeight: 'bold' }}>Home</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 24, color: '#bd93f9' }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#1e1e2f',
            borderRadius: 10,
            marginBottom: 20,
            width: '48%'
          }}>
            <Image
              source={item.image ? item.image : { uri: 'https://via.placeholder.com/100x100' }}
              style={{ height: 100, width: '100%' }}
              resizeMode="cover"
            />
            <View style={{ padding: 10 }}>
              <Text style={{ color: '#f8f8f2', fontWeight: 'bold' }}>{item.title}</Text>
              {item.time && <Text style={{ color: '#888', fontSize: 12 }}>{item.time}</Text>}
              {item.desc && <Text style={{ color: '#999', fontSize: 12 }}>{item.desc}</Text>}
              {item.rating && <Text style={{ color: '#50fa7b', fontSize: 12 }}>⭐ {item.rating}</Text>}
            </View>
          </View>
        )}
      />

   
    </SafeAreaView>
  );
}