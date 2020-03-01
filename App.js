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
  View, Dimensions, Modal, TouchableOpacity, Text,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import ImageViewer from 'react-native-image-zoom-viewer';
import MasonryList from "react-native-masonry-list";
import ImageSize from 'react-native-image-size';
import RNFetchBlob from "rn-fetch-blob";
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
const phoneWidth = Dimensions.get("window").width;

const initState = [];
let page = 1;
const App: () => React$Node = () => {

  const [list, setList] = useState(initState);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [index, setIndex] = useState(null);
  const listPhoto = list.map((item, index) => {
    return item.url_t;
  });
  const listUrl = listPhoto.map((item, index) => {

    return {
      url: item,
      width: Dimensions.get("window").width,
      height: 200
    }
  })
  const masonryUris = listPhoto.map((uri, index) => {
    const { width, height } = ImageSize.getSize(uri);
    const ratio = (phoneWidth / 2) / width;
    const newHeight = height / ratio;
    return {
      uri: uri, dimensions: {
        width: (phoneWidth / 2),
        height: newHeight
      }
    }
  })


  const onShowImage = (index) => {
    setVisible(!visible);
    setIndex(index)
  }
  const onSwipeDown = () => {
    setVisible(false);
  }
  const fetchData = () => {
    setRefresh(true);
    fetch('https://www.flickr.com/services/rest', {
      method: 'POST',
      body: new URLSearchParams({
        api_key: '865371b683a2ab8811362780c058828e',
        user_id: '187294171@N08',
        extras: 'views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o',
        format: 'json',
        method: 'flickr.favorites.getList',
        nojsoncallback: '1',
        per_page: 10,
        page: page,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => response.json())
      .then((json) => {
        setRefresh(false);
        page++;
        const data = [...list, ...json.photos.photo];
        setList(data)
      })
  }
  const onPressItem = (item, index) => {
    onShowImage(index);
  }
  const onSaveImage = async (currentIndex) => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
      if (result == RESULTS.UNAVAILABLE) {
        return;
      } else {
        let today = new Date();
        let fileName = today.getFullYear() + "." + today.getHours() + "." + today.getMinutes() + "." + today.getSeconds();
        let dirs = RNFetchBlob.fs.dirs;
        const uri = listPhoto[currentIndex];
        console.log("<><<><><", uri)
        RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          path: dirs.PictureDir + fileName + ".jpg",
          fileCache: true
        }).fetch(uri).then(() => {
          alert("Tai anh thanh cong")
        }).catch((err) => {
          console.log("errr ", err)
        })
      }
    })

  }
  useEffect(() => {

    fetchData();
  }, []);
  const onLoadMore = () => {
    if (refresh) {
      return;
    } else {
      console.log("poage", page);
      fetchData();
    }

  }
  console.log("log list data", list);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MasonryList
          images={masonryUris}
          onEndReached={onLoadMore}
          onEndReachedThreshold={8}
          numColumns={2}
          imageContainerStyle={{ borderRadius: 5, margin: 1 }}
          onPressImage={onPressItem}
        />
        <Modal visible={visible}>
          <ImageViewer
            enableSwipeDown
            onSwipeDown={onSwipeDown}
            index={index}
            renderFooter={(currentIndex) => {
              return <TouchableOpacity
                onPress={() => {
                  onSaveImage(currentIndex);
                }}
                style={{ justifyContent: "center", alignItems: "center", marginBottom: 50, marginLeft: phoneWidth - 60 }}>
                <Text style={{ color: "#FFF", fontWeight: "bold", alignSelf: "center" }}>Save</Text>
              </TouchableOpacity>
            }}
            imageUrls={listUrl} />
        </Modal>
      </View>
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
