// VoiceService.js
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'

class VoiceService {
    constructor() {
        this.recording = null
        this.isRecording = false
        this.setupAudioPermissions()
    }

    // Initialize permissions
    async setupAudioPermissions() {
        try {
            const permission = await Audio.requestPermissionsAsync()
            if (permission.status !== 'granted') {
                throw new Error('Microphone permission not granted')
            }
        } catch (error) {
            console.error("Permission error:", error)
            throw error
        }
    }

    // Start recording
    async startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            })

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            )

            this.recording = recording
            this.isRecording = true
            return true
        } catch (error) {
            console.error("Recording error:", error)
            throw error
        }
    }

    // Stop recording and get text
    async stopRecording() {
        if (!this.recording) return null

        try {
            this.isRecording = false
            await this.recording.stopAndUnloadAsync()
            const uri = this.recording.getURI()
            this.recording = null

            const base64Audio = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            })

            // Send to your speech-to-text service
            // Replace YOUR_API_ENDPOINT with your actual endpoint
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    audio: base64Audio,
                    language: 'ne-NP'
                })
            })

            const result = await response.json()
            return result.text || null

        } catch (error) {
            console.error("Stop recording error:", error)
            throw error
        }
    }

    // Check recording status
    getRecordingStatus() {
        return this.isRecording
    }

    // Clean up resources
    async cleanup() {
        if (this.recording) {
            try {
                await this.recording.stopAndUnloadAsync()
            } catch (error) {
                console.error("Cleanup error:", error)
            }
            this.recording = null
        }
    }
}

export default new VoiceService()