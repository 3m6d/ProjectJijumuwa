import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, ChevronLeft, Music } from 'react-native-feather';
import Slider from '@react-native-community/slider';
import { fetchMusicList, playMusic, pauseMusic, resumeMusic, stopMusic, setVolume, initializePlayer } from '../Services/VoiceService';

const { width } = Dimensions.get('window');

const MusicPlayer = ({ navigation }) => {
  const [musicList, setMusicList] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolumeLevel] = useState(0.7);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const positionInterval = useRef(null);

  useEffect(() => {
    const setup = async () => {
      try {
        console.log('Starting MusicPlayer setup...');
        await initializePlayer();
        setIsPlayerReady(true);
        await loadMusicList();
      } catch (error) {
        console.error('MusicPlayer setup error:', error);
      }
    };
    setup();

    return () => {
      stopMusic();
      if (positionInterval.current) clearInterval(positionInterval.current);
    };
  }, []);

  const loadMusicList = async () => {
    if (!isPlayerReady) return;
    try {
      const music = await fetchMusicList();
      setMusicList(music);
      if (music.length > 0 && !currentTrack) setCurrentTrack(music[0]);
    } catch (error) {
      console.error('Error loading music list:', error);
    }
  };

  const updatePosition = async () => {
    if (positionInterval.current) clearInterval(positionInterval.current);
    positionInterval.current = setInterval(async () => {
      try {
        const pos = await TrackPlayer.getPosition();
        const dur = await TrackPlayer.getDuration();
        setPosition(pos);
        setDuration(dur);
        if (pos >= dur && dur > 0) {
          clearInterval(positionInterval.current);
          setIsPlaying(false);
          setPosition(0);
        }
      } catch (error) {
        console.error('Position update error:', error);
      }
    }, 1000);
  };

  const handlePlayPause = async () => {
    if (!isPlayerReady || !currentTrack) {
      console.log('Player not ready or no track selected');
      return;
    }
    if (isPlaying) {
      await pauseMusic();
      setIsPlaying(false);
      if (positionInterval.current) clearInterval(positionInterval.current);
    } else {
      if (position > 0) {
        await resumeMusic();
      } else {
        const { duration: trackDuration } = await playMusic(currentTrack.file_path);
        setDuration(trackDuration);
      }
      setIsPlaying(true);
      updatePosition();
    }
  };

  const handlePrevious = async () => {
    if (!isPlayerReady || !currentTrack || musicList.length === 0) return;
    const currentIndex = musicList.findIndex((track) => track.id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : musicList.length - 1;

    await stopMusic();
    setPosition(0);
    setCurrentTrack(musicList[prevIndex]);
    if (isPlaying) {
      const { duration: trackDuration } = await playMusic(musicList[prevIndex].file_path);
      setDuration(trackDuration);
      updatePosition();
    }
  };

  const handleNext = async () => {
    if (!isPlayerReady || !currentTrack || musicList.length === 0) return;
    const currentIndex = musicList.findIndex((track) => track.id === currentTrack.id);
    const nextIndex = currentIndex < musicList.length - 1 ? currentIndex + 1 : 0;

    await stopMusic();
    setPosition(0);
    setCurrentTrack(musicList[nextIndex]);
    if (isPlaying) {
      const { duration: trackDuration } = await playMusic(musicList[nextIndex].file_path);
      setDuration(trackDuration);
      updatePosition();
    }
  };

  const handleSelectTrack = async (track) => {
    if (!isPlayerReady) return;
    if (currentTrack && track.id === currentTrack.id) {
      handlePlayPause();
      return;
    }
    await stopMusic();
    setPosition(0);
    setCurrentTrack(track);
    const { duration: trackDuration } = await playMusic(track.file_path);
    setDuration(trackDuration);
    setIsPlaying(true);
    updatePosition();
  };

  const handleVolumeChange = async (value) => {
    if (!isPlayerReady) return;
    setVolumeLevel(value);
    await setVolume(value);
  };

  const seekTo = async (value) => {
    if (!isPlayerReady) return;
    await TrackPlayer.seekTo(value);
    setPosition(value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderVolumeIcon = () => {
    if (volume === 0) return React.createElement(Volume, { width: 24, height: 24, color: '#FFC107' });
    else if (volume < 0.5) return React.createElement(Volume1, { width: 24, height: 24, color: '#FFC107' });
    else return React.createElement(Volume2, { width: 24, height: 24, color: '#FFC107' });
  };

  const renderTrackItem = ({ item }) => {
    const isActive = currentTrack && item.id === currentTrack.id;
    return React.createElement(
      TouchableOpacity,
      {
        style: [styles.trackItem, isActive && styles.activeTrackItem],
        onPress: () => handleSelectTrack(item),
      },
      React.createElement(Image, { source: { uri: item.file_path }, style: styles.trackArtwork }),
      React.createElement(
        View,
        { style: styles.trackInfo },
        React.createElement(Text, { style: [styles.trackTitle, isActive && styles.activeTrackTitle] }, item.title),
        React.createElement(Text, { style: styles.trackArtist }, item.artist || 'Unknown')
      ),
      isActive && isPlaying &&
        React.createElement(
          View,
          { style: styles.playingIndicator },
          React.createElement(Text, { style: styles.playingText }, 'Playing')
        )
    );
  };

  if (!isPlayerReady) {
    return React.createElement(
      SafeAreaView,
      { style: styles.container },
      React.createElement(Text, null, 'Loading player...')
    );
  }

  return React.createElement(
    SafeAreaView,
    { style: styles.container },
    React.createElement(
      View,
      { style: styles.header },
      React.createElement(
        TouchableOpacity,
        { style: styles.backButton, onPress: () => navigation.goBack() },
        React.createElement(ChevronLeft, { width: 24, height: 24, color: '#FFC107' })
      ),
      React.createElement(Text, { style: styles.headerTitle }, 'संगीत'),
      React.createElement(View, { style: { width: 24 } })
    ),
    React.createElement(
      View,
      { style: styles.playerContainer },
      currentTrack
        ? [
            React.createElement(Image, { source: { uri: currentTrack.file_path }, style: styles.albumArt }),
            React.createElement(Text, { style: styles.songTitle }, currentTrack.title),
            React.createElement(Text, { style: styles.artistName }, currentTrack.artist || 'Unknown'),
            React.createElement(
              View,
              { style: styles.progressContainer },
              React.createElement(Text, { style: styles.timeText }, formatTime(position)),
              React.createElement(Slider, {
                style: styles.progressBar,
                minimumValue: 0,
                maximumValue: duration || 1,
                value: position,
                onSlidingComplete: seekTo,
                minimumTrackTintColor: '#FFC107',
                maximumTrackTintColor: '#FFF9C4',
                thumbTintColor: '#FFC107',
              }),
              React.createElement(Text, { style: styles.timeText }, formatTime(duration))
            ),
            React.createElement(
              View,
              { style: styles.controlsContainer },
              React.createElement(
                TouchableOpacity,
                { style: styles.controlButton, onPress: handlePrevious },
                React.createElement(SkipBack, { width: 30, height: 30, color: '#FFC107' })
              ),
              React.createElement(
                TouchableOpacity,
                { style: styles.playPauseButton, onPress: handlePlayPause },
                isPlaying
                  ? React.createElement(Pause, { width: 40, height: 40, color: '#fff' })
                  : React.createElement(Play, { width: 40, height: 40, color: '#fff' })
              ),
              React.createElement(
                TouchableOpacity,
                { style: styles.controlButton, onPress: handleNext },
                React.createElement(SkipForward, { width: 30, height: 30, color: '#FFC107' })
              )
            ),
            React.createElement(
              View,
              { style: styles.volumeContainer },
              renderVolumeIcon(),
              React.createElement(Slider, {
                style: styles.volumeSlider,
                minimumValue: 0,
                maximumValue: 1,
                value: volume,
                minimumTrackTintColor: '#FFC107',
                maximumTrackTintColor: '#FFF9C4',
                thumbTintColor: '#FFC107',
                onValueChange: handleVolumeChange,
              })
            ),
          ]
        : React.createElement(
            View,
            { style: styles.noTrackContainer },
            React.createElement(Music, { width: 60, height: 60, color: '#FFC107' }),
            React.createElement(Text, { style: styles.noTrackText }, 'No track selected')
          )
    ),
    React.createElement(
      View,
      { style: styles.playlistContainer },
      React.createElement(Text, { style: styles.playlistTitle }, 'भजन र कीर्तन'),
      React.createElement(FlatList, {
        data: musicList,
        renderItem: renderTrackItem,
        keyExtractor: (item) => item.id.toString(),
        contentContainerStyle: styles.playlist,
      })
    )
  );
};

// Updated styles with yellow color scheme
const styles = {
  container: { flex: 1, backgroundColor: '#FFF9C4' }, // Light yellow background
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFE0', // Very light yellow
    borderBottomWidth: 1,
    borderBottomColor: '#FFECB3',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFC107' }, // Vibrant yellow
  playerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFE0',
    borderRadius: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  albumArt: { width: width * 0.6, height: width * 0.6, borderRadius: 10, marginBottom: 20 },
  songTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFC107', textAlign: 'center', marginBottom: 5 },
  artistName: { fontSize: 18, color: '#FFCA28', textAlign: 'center', marginBottom: 20 }, // Slightly lighter yellow
  progressContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  timeText: { fontSize: 14, color: '#FFCA28', width: 40, textAlign: 'center' },
  progressBar: { flex: 1, height: 40 },
  controlsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 },
  controlButton: { padding: 10 },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107', // Vibrant yellow for play/pause button
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  volumeContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  volumeSlider: { flex: 1, height: 40, marginLeft: 10 },
  noTrackContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  noTrackText: { fontSize: 18, color: '#FFCA28', marginTop: 10 },
  playlistContainer: { flex: 1, padding: 15 },
  playlistTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFC107', marginBottom: 15 },
  playlist: { paddingBottom: 20 },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFE0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeTrackItem: { backgroundColor: '#FFF9C4', borderLeftWidth: 5, borderLeftColor: '#FFC107' },
  trackArtwork: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFC107', marginBottom: 5 },
  activeTrackTitle: { color: '#FFEB3B' }, // Brighter yellow for active track
  trackArtist: { fontSize: 14, color: '#FFCA28' },
  playingIndicator: { backgroundColor: '#FFCA28', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  playingText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
};

export default MusicPlayer;