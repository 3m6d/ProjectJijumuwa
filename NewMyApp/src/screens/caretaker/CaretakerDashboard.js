import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { caretakerService } from '../../services/caretaker/caretakerService';
import { Ionicons } from '@expo/vector-icons';

const CaretakerDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [profitSummary, setProfitSummary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'appointment', 'contact', 'medicine'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, contactsRes, medicinesRes, profitRes] = await Promise.all([
        caretakerService.getAppointments(),
        caretakerService.getEmergencyContacts(),
        caretakerService.getMedicines(),
        caretakerService.getProfitSummary(),
      ]);

      if (appointmentsRes.success) setAppointments(appointmentsRes.data);
      if (contactsRes.success) setEmergencyContacts(contactsRes.data);
      if (medicinesRes.success) setMedicines(medicinesRes.data);
      if (profitRes.success) setProfitSummary(profitRes.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Navigation will be handled by the AuthContext
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      let result;
      switch (modalType) {
        case 'appointment':
          result = await caretakerService.createAppointment(formData);
          break;
        case 'contact':
          result = await caretakerService.addEmergencyContact(formData);
          break;
        case 'medicine':
          result = await caretakerService.addMedicine(formData);
          break;
      }

      if (result.success) {
        Alert.alert('Success', 'Item added successfully');
        setModalVisible(false);
        loadDashboardData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'appointment' && 'Add Appointment'}
              {modalType === 'contact' && 'Add Emergency Contact'}
              {modalType === 'medicine' && 'Add Medicine'}
            </Text>

            {modalType === 'appointment' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                />
              </>
            )}

            {modalType === 'contact' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Relationship"
                  value={formData.relationship}
                  onChangeText={(text) => setFormData({ ...formData, relationship: text })}
                />
              </>
            )}

            {modalType === 'medicine' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Medicine Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Dosage"
                  value={formData.dosage}
                  onChangeText={(text) => setFormData({ ...formData, dosage: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Schedule"
                  value={formData.schedule}
                  onChangeText={(text) => setFormData({ ...formData, schedule: text })}
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profit Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profit Summary</Text>
          <View style={styles.profitCard}>
            <Text style={styles.profitAmount}>
              ₹{profitSummary?.total_profit || 0}
            </Text>
            <Text style={styles.profitLabel}>Total Profit</Text>
          </View>
        </View>

        {/* Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <TouchableOpacity onPress={() => openModal('appointment')}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {appointments.map((appointment, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{appointment.title}</Text>
              <Text style={styles.cardSubtitle}>{appointment.date}</Text>
              <Text style={styles.cardText}>{appointment.notes}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={() => openModal('contact')}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{contact.name}</Text>
              <Text style={styles.cardSubtitle}>{contact.phone}</Text>
              <Text style={styles.cardText}>{contact.relationship}</Text>
            </View>
          ))}
        </View>

        {/* Medicines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <TouchableOpacity onPress={() => openModal('medicine')}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{medicine.name}</Text>
              <Text style={styles.cardSubtitle}>Dosage: {medicine.dosage}</Text>
              <Text style={styles.cardText}>Schedule: {medicine.schedule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profitCard: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  profitAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profitLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CaretakerDashboard; 