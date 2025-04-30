import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, History, Share2, Users } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const HomePage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Plus size={24} color="#4c9eeb" />,
      title: 'Create Match',
      description: 'Set up new 6v6, 7v7 or 8v8 football matches',
      action: () => router.push('/create'),
    },
    {
      icon: <Users size={24} color="#4caf50" />,
      title: 'Balance Teams',
      description: 'Auto-create fair teams based on positions and skills',
      action: () => router.push('/create'),
    },
    {
      icon: <Share2 size={24} color="#ff9800" />,
      title: 'Share Lineups',
      description: 'Share team compositions with other players',
      action: () => router.push('/create'),
    },
    {
      icon: <History size={24} color="#9c27b0" />,
      title: 'View History',
      description: 'Access past match formations and teams',
      action: () => router.push('/matches'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
          }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Animated.Text 
            entering={FadeIn.delay(300).duration(800)}
            style={styles.heroTitle}
          >
            Football Team Organizer
          </Animated.Text>
          <Animated.Text 
            entering={FadeIn.delay(600).duration(800)}
            style={styles.heroSubtitle}
          >
            Create balanced teams for your football matches
          </Animated.Text>
          <Animated.View entering={FadeIn.delay(900).duration(800)}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.heroButtonText}>Create New Match</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={SlideInRight.delay(300 + index * 100).duration(500)}
              style={styles.featureCard}
            >
              <TouchableOpacity
                style={styles.featureCardInner}
                onPress={feature.action}
              >
                <View style={styles.featureIconContainer}>{feature.icon}</View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          {[
            'Select match format (6v6, 7v7, or 8v8)',
            'Enter player names, positions, and skill levels',
            'Generate balanced teams automatically',
            'View team formation on the field and share with players',
          ].map((step, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(300 + index * 150).duration(500)}
              style={styles.stepItem}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  heroContainer: {
    position: 'relative',
    height: 220,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#4c9eeb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  heroButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    fontSize: 16,
  },
  sectionContainer: {
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 16,
    color: '#333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 48) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureCardInner: {
    padding: 16,
    alignItems: 'center',
    height: 160,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },
  stepsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4c9eeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    fontSize: 16,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});

export default HomePage;