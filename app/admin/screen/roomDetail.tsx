import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function InputLayout() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.singleInput}
            placeholder="Trạng thái"
            placeholderTextColor="#888"
          />

          <View style={styles.row}>
            <TextInput
              style={styles.halfInput}
              placeholder="Người thuê"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="Giá"
              placeholderTextColor="#888"
            />
          </View>

          <TextInput
            style={[
              styles.singleInput,
              { height: '40%', textAlignVertical: 'top' },
            ]}
            placeholder="Mô tả"
            multiline={true}
            placeholderTextColor="#888"
          />

          {/* Khu vực chọn hình ảnh */}
          <TouchableOpacity
            style={[
              styles.singleInput,
              {
                height: '20%',
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
            ) : (
              <Text style={{ color: '#888' }}>Nhấn để chọn hình ảnh</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={() => console.log('Submit')}>
                    <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexGrow: 1,
    gap: 10,
  },
  singleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '40%',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#13C39C',
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
