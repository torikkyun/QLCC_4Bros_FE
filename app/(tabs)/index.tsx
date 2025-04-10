import React from 'react';
import { FlatList, Text, View } from 'react-native';

const FlatListBasics = () => {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FlatList
        data={[
          { key: 'Devin' },
          { key: 'Dan' },
          { key: 'Dominic' },
          { key: 'Jackson' },
          { key: 'James' },
          { key: 'Joel' },
          { key: 'John' },
          { key: 'Jillian' },
          { key: 'Jimmy' },
          { key: 'Julie' },
        ]}
        renderItem={({ item }) => (
          <Text className="text-lg text-gray-800 p-2 border-b border-gray-300">
            {item.key}
          </Text>
        )}
      />
    </View>
  );
};

export default FlatListBasics;
