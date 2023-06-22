import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  TouchableOpacity,
  Image,
  SectionList,
} from 'react-native';

const SwiperComponent = () => {
  const [data, setData] = useState([
    {
      id: '1',
      name: 'Sumit',
      date: '25/03/1997',
    },
    {
      id: '2',
      name: 'Om',
      date: '02/01/2001',
    },
    {
      id: '3',
      name: 'Parth',
      date: '26/11/1998',
    },
  ]);

  const swipeAnimation = useRef(new Animated.Value(0)).current;
  const [showDeleteIcon, setShowDeleteIcon] = useState(null);

  const handleDelete = (itemId) => {
    console.log('Deleted item:', itemId);
    setData((prevData) => prevData.filter((item) => item.id !== itemId));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gestureState) => {
        const { index } = gestureState;
        setShowDeleteIcon(index);
        Animated.event([null, { dx: swipeAnimation }], {
          useNativeDriver: false,
        })(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        const { index } = gestureState;
        if (index === showDeleteIcon) {
          handleDelete(data[index].id);
        }
        Animated.spring(swipeAnimation, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setShowDeleteIcon(null);
      },
    })
  ).current;

  const swipeStyle = {
    transform: [
      {
        translateX: swipeAnimation,
      },
    ],
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      {showDeleteIcon === index && (
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Image
            source={require('../assets/Images/delete.png')}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.swipeContainer, swipeStyle]}
        {...panResponder.panHandlers}
      >
        <SectionList
          sections={[{ data }]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  swipeContainer: {
    backgroundColor: 'black',
    height: 100,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: 'lime',
    marginRight: 10,
  },
  dateText: {
    color: 'lime',
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: 'red',
  },
});

export default SwiperComponent;
