import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get('https://api.tvmaze.com/search/shows?q=all');
        setShows(response.data);
        setResults(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleSearch = async (search) => {
    if (search.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${search}`);
        setResults(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults(shows);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [shows]);

  const handleTextChange = (text) => {
    setSearch(text);
    handleTextDebounce(text);
  };

  const handleItemPress = (item) => {
    navigation.navigate('MovieDetails', { item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={handleTextChange}
          placeholder="Search for TV shows"
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => {
            setSearch('');
            setResults(shows);
          }}
        >
          <XMarkIcon size="25" color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.show.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={styles.item}>
                <Image
                  source={{
                    uri: item.show.image ? item.show.image.medium : 'https://via.placeholder.com/100x150?text=No+Image',
                  }}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.show.name}</Text>
                  <ScrollView>
                    <Text style={styles.details}>
                      {item.show.summary ? item.show.summary.replace(/<[^>]+>/g, '') : 'No summary available.'}
                    </Text>
                  </ScrollView>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Radiant Purple
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: width * 0.9,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    color: 'black',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: width * 0.9,
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
  },
});
