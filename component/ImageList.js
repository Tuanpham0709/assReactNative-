import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, Dimensions, Modal, TouchableOpacity } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
const ImageList = ({ photos }) => {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(null);
    const listPhoto = photos.map((item, index) => {
        return item.url_t;
    });
    const listUrl = listPhoto.map((item) => {
        console.log("item .item ", item)
        return {
            url: item,
            width: Dimensions.get("window").width,
            height: 200
        }
    })
    const onShowImage = (index) => {
        setVisible(!visible);
        setIndex(index)
    }
    const onSwipeDown = () => {
        setVisible(false);
    }
    return (
        <View style={{ flex: 1 }}>
            <FlatList data={listPhoto}
                numColumns={2}
                renderItem={(uri, index) => {
                    return <ItemFlat
                        onShowImage={onShowImage}
                        uri={uri}></ItemFlat>
                }}
            />
            <Modal visible={visible}>
                <ImageViewer
                    enableSwipeDown
                    onSwipeDown={onSwipeDown}
                    index={index}
                    imageUrls={listUrl} />
            </Modal>
        </View>
    )
}
const ItemFlat = ({ uri, index, onShowImage }) => {

    return (<TouchableOpacity
        onPress={() => {
            onShowImage(index);
        }}
        activeOpacity={0.8}
        style={{ flex: 1, margin: 5, borderRadius: 10, }}>
        <Image

            style={{ width: Dimensions.get("window").width / 2 - 10, height: 300, borderRadius: 10 }}
            source={{ uri: uri.item }}
        >

        </Image>
    </TouchableOpacity>)
}
export default ImageList;