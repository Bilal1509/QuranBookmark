import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quranicSurahs from '../data/surahs';
import { useTypography } from '../styles/typography';
import { useResponsive } from '../utils/responsive';
import { Surah, QuranProgress } from '../types';

const Home = () => {
  const typography = useTypography();
  const { scale, verticalScale, moderateScale } = useResponsive();

  const CARD_HEIGHT = verticalScale(64);
  const CARD_MARGIN_VERTICAL = verticalScale(8);
  const ROW_HEIGHT = CARD_HEIGHT + CARD_MARGIN_VERTICAL * 2;

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    [ROW_HEIGHT],
  );

  const styles = getStyles(scale, verticalScale, moderateScale, CARD_HEIGHT, CARD_MARGIN_VERTICAL);

  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahName, setSelectedSurahName] = useState('');
  const [tappedVerse, setTappedVerse] = useState<number | null>(null);
  const [surahScrollPosition, setSurahScrollPosition] = useState(0);
  const [verseScrollPosition, setVerseScrollPosition] = useState(0);
  const [isVerseListReady, setIsVerseListReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listHeight, setListHeight] = useState(0);
  const [isScrollingToSurah, setIsScrollingToSurah] = useState(false);

  const surahListRef = useRef<FlatList<Surah>>(null);
  const verseListRef = useRef<FlatList<number>>(null);
  const savedVersePositionRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);
  const targetSurahIdRef = useRef<number | null>(null);

  // Filter surahs based on search query
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return quranicSurahs;
    
    const query = searchQuery.toLowerCase().trim();
    return quranicSurahs.filter(surah => 
      surah.name.toLowerCase().includes(query) ||
      surah.id.toString().includes(query)
    );
  }, [searchQuery]);

  // Highlight matching text in search results
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <Text key={index} style={styles.highlightedText}>{part}</Text> : 
        <Text key={index}>{part}</Text>
    );
  };

  useEffect(() => {
    const init = async () => {
      const saved = await AsyncStorage.getItem('quranData');
      if (saved) {
        const data: QuranProgress = JSON.parse(saved);
        const surah = quranicSurahs.find((s) => s.id === data.selectedSurahId) ?? null;

        setTappedVerse(data.tappedVerse ?? null);
        setSelectedSurahName(data.selectedSurahName ?? '');
        setSurahScrollPosition(data.surahScrollPosition ?? 0);
        setVerseScrollPosition(data.verseScrollPosition ?? 0);
        setSelectedSurah(surah);
        
        savedVersePositionRef.current = data.verseScrollPosition ?? 0;

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
      setTimeout(() => {
        verseListRef.current?.scrollToOffset({
          offset: savedVersePositionRef.current,
          animated: false,
        });
      }, 200);
    }
  }, [selectedSurah, isVerseListReady]);

  // Auto-scroll to selected surah when search is cleared
  useEffect(() => {
    if (!searchQuery && selectedSurah && !isScrollingToSurah) {
      setTimeout(() => {
        scrollToSurahAndCenter(selectedSurah.id);
      }, 200);
    }
  }, [searchQuery, selectedSurah]);

  const saveProgress = (payload: QuranProgress) => {
    AsyncStorage.setItem('quranData', JSON.stringify(payload));
  };

  const scrollToSurahAndCenter = async (surahId: number) => {
    const index = quranicSurahs.findIndex(s => s.id === surahId);
    if (index === -1 || !listHeight) return;

    setIsScrollingToSurah(true);

    const targetOffset = (index * ROW_HEIGHT) - (listHeight / 2) + (ROW_HEIGHT / 2);
    const maxOffset = (quranicSurahs.length * ROW_HEIGHT) - listHeight;
    const finalOffset = Math.max(0, Math.min(targetOffset, maxOffset));

    surahListRef.current?.scrollToOffset({
      offset: finalOffset,
      animated: true,
    });

    setSurahScrollPosition(finalOffset);

    const saved = await AsyncStorage.getItem('quranData');
    const current: QuranProgress = saved
      ? JSON.parse(saved)
      : {
          tappedVerse,
          selectedSurahName,
          selectedSurahId: selectedSurah ? selectedSurah.id : null,
          surahScrollPosition,
          verseScrollPosition,
        };

    saveProgress({ ...current, surahScrollPosition: finalOffset });

    setTimeout(() => {
      setIsScrollingToSurah(false);
    }, 500);
  };

  const handleSelectSurah = (surah: Surah) => {
    setIsVerseListReady(false);
    setSelectedSurah(surah);
    setSelectedSurahName(surah.name);
    setTappedVerse(null);
    savedVersePositionRef.current = 0;

    saveProgress({
      tappedVerse: null,
      selectedSurahName: surah.name,
      selectedSurahId: surah.id,
      surahScrollPosition,
      verseScrollPosition: 0,
    });
  };

  const handleSearchSelect = (surah: Surah) => {
    Keyboard.dismiss();
    targetSurahIdRef.current = surah.id;
    
    // Clear search to show full list
    setSearchQuery('');
    
    // Select the surah
    handleSelectSurah(surah);
    
    // Scroll to center after list updates
    setTimeout(() => {
      scrollToSurahAndCenter(surah.id);
    }, 300);
  };

  const handleTapVerse = (verseNumber: number) => {
    setTappedVerse((prev) => {
      const next = prev === verseNumber ? null : verseNumber;

      saveProgress({
        tappedVerse: next,
        selectedSurahName,
        selectedSurahId: selectedSurah ? selectedSurah.id : null,
        surahScrollPosition,
        verseScrollPosition,
      });

      return next;
    });
  };

  const handleSurahScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrollingToSurah) {
      setSurahScrollPosition(e.nativeEvent.contentOffset.y);
    }
  };

  const handleVerseScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPosition = e.nativeEvent.contentOffset.y;
    setVerseScrollPosition(newPosition);
    savedVersePositionRef.current = newPosition;
  };

  const verses = selectedSurah
    ? Array.from({ length: selectedSurah.totalVerses }, (_, i) => i + 1)
    : [];

  const handleVerseListContentSize = () => {
    if (!isVerseListReady && selectedSurah) {
      setIsVerseListReady(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const renderSurahItem = ({ item }: { item: Surah }) => {
  const isSelected = selectedSurah?.id === item.id;
  const isHighlighted = searchQuery.trim() && 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
     item.id.toString().includes(searchQuery.trim()));

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        isSelected && styles.cardSelected,
        isHighlighted && styles.cardHighlighted
      ]}
      onPress={() => searchQuery ? handleSearchSelect(item) : handleSelectSurah(item)}
    >
      <Text style={typography.body}>
        {searchQuery ? highlightText(item.name, searchQuery) : item.name}
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.heading, styles.header]}>Quran Bookmark</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Surah"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (filteredSurahs.length === 1) {
                handleSearchSelect(filteredSurahs[0]);
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.length > 0 && (
          <Text style={styles.searchResultsCount}>
            {filteredSurahs.length} surah{filteredSurahs.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={typography.body}>Selected Surah: {selectedSurahName || 'None'}</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={typography.body}>
          Verse Read: {tappedVerse !== null ? tappedVerse : 'None'}
        </Text>
      </View>

      <View style={styles.listsRow}>
        <FlatList
          ref={surahListRef}
          style={styles.list}
          data={filteredSurahs}
          keyExtractor={(item) => String(item.id)}
          onScroll={handleSurahScroll}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          initialNumToRender={120}
          maxToRenderPerBatch={300}
          onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No surahs found matching "{searchQuery}"
              </Text>
            </View>
          )}
          renderItem={renderSurahItem}
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
                style={[styles.card, tappedVerse === item && styles.cardSelected]}
                onPress={() => handleTapVerse(item)}
              >
                <Text style={typography.body}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
  cardHeight: number,
  cardMarginVertical: number,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      padding: moderateScale(15),
    },
    searchContainer: {
      paddingHorizontal: scale(8),
      paddingBottom: verticalScale(8),
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E5E4E2',
      borderRadius: moderateScale(20),
      paddingHorizontal: scale(12),
      height: verticalScale(44),
    },
    searchIcon: {
      fontSize: moderateScale(16),
      marginRight: scale(8),
    },
    searchInput: {
      flex: 1,
      fontSize: moderateScale(16),
      fontFamily: 'Poppins-Regular',
      color: '#000',
      height: '100%',
      padding: 0,
    },
    clearButton: {
      padding: moderateScale(4),
    },
    clearButtonText: {
      fontSize: moderateScale(16),
      color: '#999',
    },
    searchResultsCount: {
      fontSize: moderateScale(12),
      color: '#666',
      marginTop: verticalScale(4),
      marginLeft: scale(4),
    },
    infoCard: {
      backgroundColor: '#E5E4E2',
      borderRadius: moderateScale(20),
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(20),
      marginVertical: verticalScale(4),
      marginHorizontal: scale(8),
    },
    listsRow: {
      flex: 1,
      flexDirection: 'row',
      marginTop: verticalScale(10),
    },
    list: {
      flex: 1,
    },
    card: {
      height: cardHeight,
      backgroundColor: '#AFE1AF',
      borderRadius: moderateScale(20),
      paddingHorizontal: scale(20),
      marginVertical: cardMarginVertical,
      marginHorizontal: scale(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardSelected: {
      backgroundColor: '#B0E0E6',
    },
    cardHighlighted: {
      backgroundColor: '#FFE4B5',
    },
    highlightedText: {
      backgroundColor: '#FFD700',
      fontWeight: 'bold',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(20),
      marginTop: verticalScale(50),
    },
    emptyStateText: {
      fontSize: moderateScale(16),
      color: '#666',
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
    },
  });

export default Home;