/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import ImageList from './component/ImageList'

const initState = [];
const App: () => React$Node = () => {
  const [list, setList] = useState(initState);

  const fetchData = () => {
    fetch('https://www.flickr.com/services/rest', {
      method: 'POST',
      body: new URLSearchParams({
        api_key: '5e30fe7626d5b173b537385a28e67d39',
        user_id: '187117174@N08',
        extras: 'views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o',
        format: 'json',
        method: 'flickr.favorites.getList',
        nojsoncallback: '1',
        per_page: '10',
        page: '1',
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => response.json())
      .then((json) => setList(json.photos.photo))
  }
  useEffect(() => {
    fetchData();
  }, []);
  console.log("log list data", list);
  return (
    <View style={{ flex: 1 }}>
      <ImageList photos={list} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
