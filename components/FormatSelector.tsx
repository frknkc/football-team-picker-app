import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useMatch } from '../context/MatchContext';
import { MatchFormat } from '../types';
import { Users } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const FormatSelector: React.FC = () => {
  const { currentFormat, setCurrentFormat } = useMatch();
  const formats: MatchFormat[] = ['6v6', '7v7', '8v8'];

  const handleFormatSelect = (format: MatchFormat) => {
    setCurrentFormat(format);
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
      <Text style={styles.title}>Select Match Format</Text>
      
      <View style={styles.formatsContainer}>
        {formats.map((format) => (
          <TouchableOpacity
            key={format}
            style={[
              styles.formatButton,
              currentFormat === format && styles.selectedFormat,
            ]}
            onPress={() => handleFormatSelect(format)}
          >
            <Users 
              size={24} 
              color={currentFormat === format ? '#ffffff' : '#3a3a3a'} 
            />
            <Text 
              style={[
                styles.formatText,
                currentFormat === format && styles.selectedFormatText,
              ]}
            >
              {format}
            </Text>
            <Text style={[
              styles.formatDescription,
              currentFormat === format && styles.selectedFormatText,
            ]}>
              {format === '6v6' ? '5 players + GK' : 
               format === '7v7' ? '6 players + GK' : 
               '7 players + GK'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Select the match format you want to organize. Each team will have exactly one goalkeeper.
        </Text>
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');
const buttonWidth = (width - 60) / 3;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  formatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formatButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: buttonWidth,
    height: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedFormat: {
    backgroundColor: '#4c9eeb',
  },
  formatText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#3a3a3a',
  },
  formatDescription: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
    textAlign: 'center',
  },
  selectedFormatText: {
    color: '#ffffff',
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FormatSelector;