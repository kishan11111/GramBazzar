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

// Local Card Home Shimmer
export const LocalCardHomeShimmer = () => (
  <View style={styles.localCardHomeShimmer}>
    {/* Create Banner Shimmer */}
    <View style={styles.createBannerShimmer}>
      <Shimmer width={50} height={50} borderRadius={25} style={{ marginRight: 15 }} />
      <View style={{ flex: 1 }}>
        <Shimmer width="70%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
        <Shimmer width="50%" height={14} borderRadius={4} />
      </View>
      <Shimmer width={100} height={36} borderRadius={18} />
    </View>

    {/* Category Section Shimmer */}
    <View style={styles.sectionShimmer}>
      <Shimmer width="40%" height={20} borderRadius={4} style={{ marginBottom: 15 }} />
      <View style={styles.categoriesRowShimmer}>
        <Shimmer width={100} height={100} borderRadius={12} style={{ marginRight: 10 }} />
        <Shimmer width={100} height={100} borderRadius={12} style={{ marginRight: 10 }} />
        <Shimmer width={100} height={100} borderRadius={12} style={{ marginRight: 10 }} />
      </View>
    </View>

    {/* Featured Cards Shimmer */}
    <View style={styles.sectionShimmer}>
      <Shimmer width="50%" height={20} borderRadius={4} style={{ marginBottom: 15 }} />
      <View style={styles.cardsGridShimmer}>
        <LocalCardItemShimmer />
        <LocalCardItemShimmer />
        <LocalCardItemShimmer />
        <LocalCardItemShimmer />
      </View>
    </View>
  </View>
);

// Single Local Card Item Shimmer
export const LocalCardItemShimmer = () => (
  <View style={styles.localCardItemShimmer}>
    <Shimmer width="100%" height={120} borderRadius={12} style={{ marginBottom: 10 }} />
    <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
      <Shimmer width="80%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
      <Shimmer width="60%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <View style={styles.shimmerRow}>
        <Shimmer width="40%" height={12} borderRadius={4} />
        <Shimmer width="30%" height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

// Account Page Shimmer
export const AccountPageShimmer = () => (
  <View style={styles.accountPageShimmer}>
    {/* Profile Card Shimmer */}
    <View style={styles.profileCardShimmer}>
      <View style={styles.profileHeaderShimmer}>
        <Shimmer width={80} height={80} borderRadius={40} style={{ marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Shimmer width="70%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
          <Shimmer width="90%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
          <Shimmer width="60%" height={14} borderRadius={4} />
        </View>
      </View>
      <Shimmer width="100%" height={44} borderRadius={12} style={{ marginTop: 15 }} />
    </View>

    {/* Stats Cards Shimmer */}
    <View style={styles.statsShimmer}>
      <Shimmer width="31%" height={80} borderRadius={12} />
      <Shimmer width="31%" height={80} borderRadius={12} />
      <Shimmer width="31%" height={80} borderRadius={12} />
    </View>

    {/* Quick Actions Shimmer */}
    <View style={styles.quickActionsShimmer}>
      <Shimmer width="40%" height={18} borderRadius={4} style={{ marginBottom: 15 }} />
      <View style={styles.actionsGridShimmer}>
        <Shimmer width="23%" height={80} borderRadius={12} />
        <Shimmer width="23%" height={80} borderRadius={12} />
        <Shimmer width="23%" height={80} borderRadius={12} />
        <Shimmer width="23%" height={80} borderRadius={12} />
      </View>
    </View>

    {/* Tabs Shimmer */}
    <View style={styles.tabsShimmer}>
      <Shimmer width="50%" height={40} borderRadius={8} />
    </View>

    {/* Posts Shimmer */}
    <View style={styles.postsShimmer}>
      <AccountPostItemShimmer />
      <AccountPostItemShimmer />
      <AccountPostItemShimmer />
    </View>
  </View>
);

// Account Post Item Shimmer
export const AccountPostItemShimmer = () => (
  <View style={styles.accountPostItemShimmer}>
    <Shimmer width={100} height={100} borderRadius={12} style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Shimmer width="90%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
      <Shimmer width="50%" height={20} borderRadius={4} style={{ marginBottom: 10 }} />
      <View style={styles.shimmerRow}>
        <Shimmer width="30%" height={12} borderRadius={4} />
        <Shimmer width="30%" height={12} borderRadius={4} />
      </View>
      <View style={[styles.shimmerRow, { marginTop: 10 }]}>
        <Shimmer width="35%" height={32} borderRadius={8} />
        <Shimmer width="35%" height={32} borderRadius={8} />
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
  // Local Card Home Shimmer Styles
  localCardHomeShimmer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  createBannerShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionShimmer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoriesRowShimmer: {
    flexDirection: 'row',
  },
  cardsGridShimmer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  localCardItemShimmer: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // Account Page Shimmer Styles
  accountPageShimmer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileCardShimmer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileHeaderShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsShimmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  quickActionsShimmer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  actionsGridShimmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabsShimmer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  postsShimmer: {
    paddingHorizontal: 15,
  },
  accountPostItemShimmer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});