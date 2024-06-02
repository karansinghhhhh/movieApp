import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function MovieDetailsScreen({ route }) {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: item.show.image ? item.show.image.original : 'https://via.placeholder.com/300x450?text=No+Image' }}
        style={styles.image}
      />
      <Text style={styles.title}>{item.show.name}</Text>
      <Text style={styles.genre}>{item.show.genres.join(', ')}</Text>
      <Text style={styles.details}>
        {item.show.summary ? item.show.summary.replace(/<[^>]+>/g, '') : 'No summary available.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: (width * 0.9) * 1.5,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  genre: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    textAlign: 'justify',
  },
});
