import React from 'react';
import { View, StyleSheet, Animated, Image, Text, ImageURISource, Dimensions } from 'react-native';
import MapView, { MarkerProps, Marker, Region } from 'react-native-maps';

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
  region: Region;
}

export default class Map extends React.Component<{}, MapState> {
  private cardAnimation: Animated.Value;
  private index: number;
  private regionTimeout?: number;
  private map?: MapView;
  constructor(props: {}) {
    super(props);
    this.state = {
      markers: [
        {
          coordinate: {
            latitude: 45.524548,
            longitude: -122.6749817,
          },
          title: 'Best Place',
          description: 'This is the best place in Portland',
          image: ImageSources[0],
        },
        {
          coordinate: {
            latitude: 45.524698,
            longitude: -122.6655507,
          },
          title: 'Second Best Place',
          description: 'This is the second best place in Portland',
          image: ImageSources[1],
        },
        {
          coordinate: {
            latitude: 45.5230786,
            longitude: -122.6701034,
          },
          title: 'Third Best Place',
          description: 'This is the third best place in Portland',
          image: ImageSources[2],
        },
        {
          coordinate: {
            latitude: 45.521016,
            longitude: -122.6561917,
          },
          title: 'Fourth Best Place',
          description: 'This is the fourth best place in Portland',
          image: ImageSources[3],
        },
      ],
      region: {
        latitude: 45.52220671242907,
        longitude: -122.6653281029795,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
    }
    this.cardAnimation = new Animated.Value(0);
    this.index = 0;
  }
  componentDidMount() {
    this.cardAnimation.addListener(({ value }) => {
      let index = Math.floor((value / CARD_WIDTH) + 0.3);
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      } else if (index <= 0) {
        index = 0;
      }

      if (this.regionTimeout) {
        window.clearTimeout(this.regionTimeout);
      }

      this.regionTimeout = window.setTimeout(() => {
        if (index !== this.index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          if (this.map) {
            this.map.animateToRegion({
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            } as Region, 350);
          }
        }
      }, 10);
    });
  }
  render() {
    const interpolations = this.state.markers.map((_, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH
      ];
      const scale = this.cardAnimation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: 'clamp', // 最後までScaleしないように調整するため
      });
      const opacity = this.cardAnimation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp', // 最後までOpacityしないように調整するため
      });
      return { scale, opacity };
    });
    const ringSizes = [24, 24 * 2.5, 24];
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref: MapView) => { this.map = ref; }}
          style={styles.container}
          initialRegion={this.state.region}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [{ scale: interpolations[index].scale }],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
              >
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.markerRing, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
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
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 71, 111, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(239, 71, 111, 0.5)',
  },
  marker: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(239, 71, 111, 0.9)',
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