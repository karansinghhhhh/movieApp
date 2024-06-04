import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import imagey from '../../assets/images/searchscreen.png'
const { width, height } = Dimensions.get("window");

export default function Show() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async (search) => {
    if (search && search.length > 2) {
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
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <ImageBackground
      source={imagey}  // Correct usage of the imported image
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            onChangeText={handleTextDebounce}
            placeholder="Search for TV shows"
            placeholderTextColor="gray"
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <XMarkIcon size="25" color="white" />
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
              <View style={styles.item}>
                {item.show.image && item.show.image.medium && (
                  <Image
                    source={{ uri: item.show.image.medium }}
                    style={styles.image}
                  />
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.show.name}</Text>
                  <ScrollView>
                    <Text style={styles.details}>{item.show.summary ? (item.show.summary.replace(/<[^>]+>/g, '')) : 'No summary available.'}</Text>
                  </ScrollView>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
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
    color: 'white', // Changed to white
  },
  details: {
    fontSize: 14,
    color: 'white', // Changed to white
  },
});
