import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ScrollView, Alert } from "react-native"
import { Calendar, Clock, ChevronLeft, Edit2, Trash2, X, Check } from "react-native-feather"
import DateTimePicker from "@react-native-community/datetimepicker"
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from "../../services/caretakerApi"

const AppointmentManagement = ({ navigation, route }) => {
  const { elderlyUser, action } = route.params
  const [appointments, setAppointments] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(action === "add")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    doctor: "",
    location: "",
    notes: "",
    date: new Date(),
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments(elderlyUser.id)
      // Sort appointments by date (newest first)
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
      setAppointments(data)
    } catch (error) {
      console.error("Error loading appointments:", error)
    }
  }

  const handleAddAppointment = () => {
    setSelectedAppointment(null)
    setFormData({
      title: "",
      doctor: "",
      location: "",
      notes: "",
      date: new Date(),
    })
    setIsModalVisible(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      title: appointment.title,
      doctor: appointment.doctor,
      location: appointment.location || "",
      notes: appointment.notes || "",
      date: new Date(appointment.date),
    })
    setIsModalVisible(true)
  }

  const handleDeleteAppointment = (appointmentId) => {
    Alert.alert("Delete Appointment", "Are you sure you want to delete this appointment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAppointment(elderlyUser.id, appointmentId)
            loadAppointments()
          } catch (error) {
            console.error("Error deleting appointment:", error)
            Alert.alert("Error", "Failed to delete appointment")
          }
        },
      },
    ])
  }

  const handleSaveAppointment = async () => {
    if (!formData.title || !formData.doctor) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      const appointmentData = {
        ...formData,
        elderlyUserId: elderlyUser.id,
      }

      if (selectedAppointment) {
        await updateAppointment(elderlyUser.id, selectedAppointment.id, appointmentData)
      } else {
        await createAppointment(elderlyUser.id, appointmentData)
      }

      setIsModalVisible(false)
      loadAppointments()
    } catch (error) {
      console.error("Error saving appointment:", error)
      Alert.alert("Error", "Failed to save appointment")
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const currentTime = formData.date
      selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes())
      setFormData({ ...formData, date: selectedDate })
    }
  }

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(formData.date)
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
      setFormData({ ...formData, date: newDate })
    }
  }

  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date)

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.dateContainer}>
            <Calendar width={16} height={16} color="#4A90E2" />
            <Text style={styles.dateText}>{appointmentDate.toLocaleDateString()}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Clock width={16} height={16} color="#4A90E2" />
            <Text style={styles.timeText}>
              {appointmentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>

        <Text style={styles.appointmentTitle}>{item.title}</Text>
        <Text style={styles.doctorText}>Dr. {item.doctor}</Text>

        {item.location && <Text style={styles.locationText}>{item.location}</Text>}

        {item.notes && <Text style={styles.notesText}>{item.notes}</Text>}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditAppointment(item)}
          >
            <Edit2 width={16} height={16} color="#4A90E2" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAppointment(item.id)}
          >
            <Trash2 width={16} height={16} color="#FF6B6B" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments scheduled</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddAppointment}>
        <Text style={styles.addButtonText}>+ Add Appointment</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAppointment ? "Edit Appointment" : "New Appointment"}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <X width={24} height={24} color="#2E3A59" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Appointment title"
              />

              <Text style={styles.inputLabel}>Doctor *</Text>
              <TextInput
                style={styles.input}
                value={formData.doctor}
                onChangeText={(text) => setFormData({ ...formData, doctor: text })}
                placeholder="Doctor name"
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Location"
              />

              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <Calendar width={20} height={20} color="#4A90E2" />
                <Text style={styles.datePickerText}>{formData.date.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
                <Clock width={20} height={20} color="#4A90E2" />
                <Text style={styles.datePickerText}>
                  {formData.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes"
                multiline={true}
                numberOfLines={4}
              />
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAppointment}>
              <Check width={20} height={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker value={formData.date} mode="date" display="default" onChange={handleDateChange} />
        )}

        {showTimePicker && (
          <DateTimePicker value={formData.date} mode="time" display="default" onChange={handleTimeChange} />
        )}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9F0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  listContainer: {
    padding: 15,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 5,
    color: "#4A90E2",
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    color: "#4A90E2",
    fontSize: 14,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  doctorText: {
    fontSize: 16,
    color: "#2E3A59",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: "#8F9BB3",
    fontStyle: "italic",
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: "#F0F7FF",
  },
  editButtonText: {
    color: "#4A90E2",
    marginLeft: 5,
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#FFF0F0",
  },
  deleteButtonText: {
    color: "#FF6B6B",
    marginLeft: 5,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#8F9BB3",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    margin: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F7F9FC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2E3A59",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
})

export default AppointmentManagement

