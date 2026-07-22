import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quranicSurahs from '../data/surahs';
import typography from '../styles/typography';
import { Surah, QuranProgress } from '../types';

const CARD_HEIGHT = 64;
const CARD_MARGIN_VERTICAL = 8;
const ROW_HEIGHT = CARD_HEIGHT + CARD_MARGIN_VERTICAL * 2;

const getItemLayout = (_: unknown, index: number) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * index,
  index,
});

const Home = () => {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahName, setSelectedSurahName] = useState('');
  const [tappedVerses, setTappedVerses] = useState<number[]>([]);
  const [surahScrollPosition, setSurahScrollPosition] = useState(0);
  const [verseScrollPosition, setVerseScrollPosition] = useState(0);
  const [isWelcomeModalVisible, setIsWelcomeModalVisible] = useState(false);
  const [isVerseListReady, setIsVerseListReady] = useState(false);

  const surahListRef = useRef<FlatList<Surah>>(null);
  const verseListRef = useRef<FlatList<number>>(null);
  const savedVersePositionRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    const init = async () => {
      const isFirstTime = await AsyncStorage.getItem('isFirstTime');
      if (isFirstTime === null) {
        setIsWelcomeModalVisible(true);
        await AsyncStorage.setItem('isFirstTime', 'false');
      }

      const saved = await AsyncStorage.getItem('quranData');
      if (saved) {
        const data: QuranProgress = JSON.parse(saved);
        const surah = quranicSurahs.find((s) => s.id === data.selectedSurahId) ?? null;

        setTappedVerses(data.tappedVerses ?? []);
        setSelectedSurahName(data.selectedSurahName ?? '');
        setSurahScrollPosition(data.surahScrollPosition ?? 0);
        setVerseScrollPosition(data.verseScrollPosition ?? 0);
        setSelectedSurah(surah);
        
        // Store the verse position for later restoration
        savedVersePositionRef.current = data.verseScrollPosition ?? 0;

        // Restore surah list position immediately after it's rendered
        setTimeout(() => {
          surahListRef.current?.scrollToOffset({
            offset: data.surahScrollPosition ?? 0,
            animated: false,
          });
        }, 100);
      }
    };

    init();
  }, []);

  // Effect to restore verse list position when the verse list is ready
  useEffect(() => {
    if (selectedSurah && isVerseListReady) {
      // Small delay to ensure the verse list is properly rendered
      setTimeout(() => {
        verseListRef.current?.scrollToOffset({
          offset: savedVersePositionRef.current,
          animated: false,
        });
      }, 200);
    }
  }, [selectedSurah, isVerseListReady]);

  const saveProgress = (payload: QuranProgress) => {
    AsyncStorage.setItem('quranData', JSON.stringify(payload));
  };

  const handleSelectSurah = (surah: Surah) => {
    // Reset verse list ready state when surah changes
    setIsVerseListReady(false);
    
    setSelectedSurah(surah);
    setSelectedSurahName(surah.name);
    setTappedVerses([]);
    savedVersePositionRef.current = 0;
    
    saveProgress({
      tappedVerses: [],
      selectedSurahName: surah.name,
      selectedSurahId: surah.id,
      surahScrollPosition,
      verseScrollPosition: 0,
    });
  };

  const handleTapVerse = (verseNumber: number) => {
    setTappedVerses((prev) => {
      const next = prev.includes(verseNumber)
        ? prev.filter((v) => v !== verseNumber)
        : [...prev, verseNumber];

      saveProgress({
        tappedVerses: next,
        selectedSurahName,
        selectedSurahId: selectedSurah ? selectedSurah.id : null,
        surahScrollPosition,
        verseScrollPosition,
      });

      return next;
    });
  };

  const handleSurahScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setSurahScrollPosition(e.nativeEvent.contentOffset.y);
  };

  const handleVerseScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPosition = e.nativeEvent.contentOffset.y;
    setVerseScrollPosition(newPosition);
    savedVersePositionRef.current = newPosition;
  };

  const verses = selectedSurah
    ? Array.from({ length: selectedSurah.totalVerses }, (_, i) => i + 1)
    : [];

  // Update verse list ready state when it's rendered
  const handleVerseListContentSize = () => {
    if (!isVerseListReady && selectedSurah) {
      setIsVerseListReady(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.heading, styles.header]}>Quran Bookmark</Text>

      <View style={styles.infoCard}>
        <Text style={typography.body}>Selected Surah: {selectedSurahName || 'None'}</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={typography.body}>
          Verses Read: {tappedVerses.length > 0 ? tappedVerses.join(', ') : 'None'}
        </Text>
      </View>

      <View style={styles.listsRow}>
        <FlatList
          ref={surahListRef}
          style={styles.list}
          data={quranicSurahs}
          keyExtractor={(item) => String(item.id)}
          onScroll={handleSurahScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          initialNumToRender={120}
          maxToRenderPerBatch={300}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, selectedSurah?.id === item.id && styles.cardSelected]}
              onPress={() => handleSelectSurah(item)}
            >
              <Text style={typography.body}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {selectedSurah && (
          <FlatList
            ref={verseListRef}
            style={styles.list}
            data={verses}
            keyExtractor={(item) => String(item)}
            onScroll={handleVerseScroll}
            scrollEventThrottle={16}
            getItemLayout={getItemLayout}
            initialNumToRender={300}
            maxToRenderPerBatch={300}
            onContentSizeChange={handleVerseListContentSize}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, tappedVerses.includes(item) && styles.cardSelected]}
                onPress={() => handleTapVerse(item)}
              >
                <Text style={typography.body}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <Modal
        visible={isWelcomeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsWelcomeModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Welcome to Quran Bookmark!</Text>
            <Text style={typography.body}>
              Explore and keep track of your recitations. Slide the list of Surahs, tap and mark
              the verses you have read.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsWelcomeModalVisible(false)}
            >
              <Text style={[typography.body, styles.modalButtonText]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
  },
  infoCard: {
    backgroundColor: '#E5E4E2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  listsRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  list: {
    flex: 1,
  },
  card: {
    height: CARD_HEIGHT,
    backgroundColor: '#AFE1AF',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginVertical: CARD_MARGIN_VERTICAL,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: {
    backgroundColor: '#B0E0E6',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalCard: {
    margin: 40,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#0096FF',
    borderRadius: 30,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 26,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default Home;