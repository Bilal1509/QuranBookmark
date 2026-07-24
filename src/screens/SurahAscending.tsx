import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import quranicSurahs from '../data/surahs';
import { useTypography } from '../styles/typography';
import { useResponsive } from '../utils/responsive';
import { Surah } from '../types';

const STORAGE_KEY = '@selectedSurahs';

const SurahAscending = () => {
  const typography = useTypography();
  const { scale, verticalScale, moderateScale } = useResponsive();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurahs, setSelectedSurahs] = useState<Surah[]>([]);
  const [searchBarActivated, setSearchBarActivated] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedSurahs(JSON.parse(saved));
      }
    };
    load();
  }, []);

  const handleChangeSearch = (text: string) => {
    setSearchTerm(text);
    setSearchBarActivated(text.length > 0);
  };

  const handleAddSurah = (surah: Surah) => {
    setSelectedSurahs((prev) => {
      if (prev.some((s) => s.id === surah.id)) {
        return prev;
      }
      const next = [...prev, surah].sort((a, b) => a.id - b.id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSearchTerm('');
    setSearchBarActivated(false);
  };

  const handleRemoveSurah = (id: number) => {
    setSelectedSurahs((prev) => {
      const next = prev.filter((s) => s.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const filteredSurahs = quranicSurahs.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const styles = getStyles(scale, verticalScale, moderateScale);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.heading, styles.header]}>Surah Ascending</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Surahs..."
        value={searchTerm}
        onChangeText={handleChangeSearch}
      />

      {searchBarActivated && (
        <FlatList
          style={styles.resultsList}
          data={filteredSurahs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => handleAddSurah(item)}>
              <Text style={typography.body}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedSurahs.length === 0 ? (
        <Text style={[typography.body, styles.helperText]}>
          {`Tap the search bar and find the Surahs you often recite during Salah\n\nGet in a habit of reciting Surah's in the ascending order.`}
        </Text>
      ) : (
        <>
          <Text style={[typography.subheading, styles.selectedHeading]}>Selected Surahs</Text>
          <FlatList
            style={styles.selectedList}
            data={selectedSurahs}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={typography.body}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveSurah(item.id)}
                >
                  <Icon name="trash" size={moderateScale(20)} color="#000" />
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const getStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: moderateScale(15),
    },
    searchInput: {
      backgroundColor: '#E5E4E2',
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(20),
      marginHorizontal: scale(8),
    },
    resultsList: {
      height: '32%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#AFE1AF',
      borderRadius: moderateScale(20),
      padding: moderateScale(20),
      marginVertical: verticalScale(8),
      marginHorizontal: scale(16),
    },
    helperText: {
      marginHorizontal: scale(8),
      padding: moderateScale(20),
    },
    selectedHeading: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(10),
    },
    selectedList: {
      height: '70%',
    },
    removeButton: {
      backgroundColor: '#E5E4E2',
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(5),
      paddingHorizontal: scale(10),
    },
  });

export default SurahAscending;
