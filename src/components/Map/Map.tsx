import React from 'react';
import { View, StyleSheet, Animated, Image, Text, ImageURISource, Dimensions } from 'react-native';
import MapView, { MarkerProps, Marker } from 'react-native-maps';

const ImageSources: Array<ImageURISource> = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" }
];

const { height, width } = Dimensions.get('window');
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

interface MapState {
  markers: Array<MarkerProps>;
}

export default class Map extends React.Component<{}, MapState> {
  private cardAnimation: {};
  constructor(props: {}) {
    super(props);
    this.state = {
      markers: [
        {
          coordinate: {
            latitude: 45.524548,
            longitude: -122.6749817,
          },
          title: "Best Place",
          description: "This is the best place in Portland",
          image: ImageSources[0],
        },
        {
          coordinate: {
            latitude: 45.524698,
            longitude: -122.6655507,
          },
          title: "Second Best Place",
          description: "This is the second best place in Portland",
          image: ImageSources[1],
        },
        {
          coordinate: {
            latitude: 45.5230786,
            longitude: -122.6701034,
          },
          title: "Third Best Place",
          description: "This is the third best place in Portland",
          image: ImageSources[2],
        },
        {
          coordinate: {
            latitude: 45.521016,
            longitude: -122.6561917,
          },
          title: "Fourth Best Place",
          description: "This is the fourth best place in Portland",
          image: ImageSources[3],
        },
      ]
    }
    this.cardAnimation = new Animated.Value(0);
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.container}
          initialRegion={{
            latitude: 45.52220671242907,
            longitude: -122.6653281029795,
            latitudeDelta: 0.04864195044303443,
            longitudeDelta: 0.040142817690068,
          }}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
              >
              </Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          style={styles.cardContainer}
          contentContainerStyle={styles.cardInnerContainer}
          horizontal={true}
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.cardAnimation,
                  }
                }
              },
            ],
            { useNativeDriver: true }
          )}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <View
                style={styles.card}
                key={index}
              >
                {marker.image && (
                  <Image
                    source={marker.image}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.cardTextContent}>
                  <Text
                    style={styles.cardTextTitle}
                    numberOfLines={1}
                  >
                    {marker.title}
                  </Text>
                  <Text
                    style={styles.cardTextDescription}
                    numberOfLines={1}
                  >
                    {marker.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </Animated.ScrollView>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 16,
  },
  cardInnerContainer: {
    // カードの一番右の余白
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 8,
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  cardTextContent: {
    flex: 1,
    marginTop: 8,
  },
  cardTextTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTextDescription: {
    fontSize: 12,
    color: '#444',
  }
})