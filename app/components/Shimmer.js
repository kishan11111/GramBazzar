import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const Shimmer = ({ width = '100%', height = 100, borderRadius = 8, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={[styles.shimmerContainer, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export const CategoryShimmer = () => (
  <View style={styles.categoryShimmerContainer}>
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
    <Shimmer width="31%" height={100} borderRadius={15} style={{ margin: '1%' }} />
  </View>
);

export const PostCardShimmer = () => (
  <View style={styles.postCardShimmerContainer}>
    <Shimmer width="100%" height={180} borderRadius={15} />
    <View style={styles.postDetailsShimmer}>
      <Shimmer width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <Shimmer width="50%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
      <Shimmer width="70%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
      <View style={styles.shimmerRow}>
        <Shimmer width="30%" height={12} borderRadius={4} />
        <Shimmer width="30%" height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

export const PostsGridShimmer = () => (
  <View style={styles.postsGridShimmer}>
    <PostCardShimmer />
    <PostCardShimmer />
    <PostCardShimmer />
    <PostCardShimmer />
  </View>
);

export const BannerShimmer = () => (
  <View style={styles.bannerShimmerContainer}>
    <View style={{ flex: 1 }}>
      <Shimmer width="70%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
      <Shimmer width="90%" height={14} borderRadius={4} />
    </View>
    <Shimmer width={60} height={60} borderRadius={30} />
  </View>
);

export const PostDetailShimmer = () => (
  <View style={styles.postDetailShimmer}>
    <Shimmer width="100%" height={300} borderRadius={0} />
    <View style={styles.detailsShimmer}>
      <Shimmer width="60%" height={28} borderRadius={4} style={{ marginBottom: 12 }} />
      <Shimmer width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
      <Shimmer width="70%" height={14} borderRadius={4} style={{ marginBottom: 20 }} />

      <View style={styles.shimmerRow}>
        <Shimmer width="30%" height={60} borderRadius={12} style={{ marginRight: 10 }} />
        <Shimmer width="30%" height={60} borderRadius={12} style={{ marginRight: 10 }} />
        <Shimmer width="30%" height={60} borderRadius={12} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  shimmerContainer: {
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    width: 300,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ skewX: '-20deg' }],
  },
  categoryShimmerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  postCardShimmerContainer: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: '1%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  postDetailsShimmer: {
    padding: 10,
  },
  shimmerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postsGridShimmer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  bannerShimmerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  postDetailShimmer: {
    flex: 1,
  },
  detailsShimmer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
});