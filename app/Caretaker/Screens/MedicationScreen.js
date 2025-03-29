import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, ScrollView, Alert } from "react-native"
import { Clock, ChevronLeft, Edit2, Trash2, X, Check, AlertCircle } from "react-native-feather"
import { fetchMedications, createMedication, updateMedication, deleteMedication } from "../../services/caretakerApi"

const MedicationManagement = ({ navigation, route }) => {
  const { elderlyUser, action } = route.params
  const [medications, setMedications] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(action === "add")
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    instructions: "",
    nextDose: "",
  })

  useEffect(() => {
    loadMedications()
  }, [])

  const loadMedications = async () => {
    try {
      const data = await fetchMedications(elderlyUser.id)
      setMedications(data)
    } catch (error) {
      console.error("Error loading medications:", error)
    }
  }

  const handleAddMedication = () => {
    setSelectedMedication(null)
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      instructions: "",
      nextDose: "",
    })
    setIsModalVisible(true)
  }

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time || "",
      instructions: medication.instructions || "",
      nextDose: medication.nextDose || "",
    })
    setIsModalVisible(true)
  }

  const handleDeleteMedication = (medicationId) => {
    Alert.alert("Delete Medication", "Are you sure you want to delete this medication?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMedication(elderlyUser.id, medicationId)
            loadMedications()
          } catch (error) {
            console.error("Error deleting medication:", error)
            Alert.alert("Error", "Failed to delete medication")
          }
        },
      },
    ])
  }

  const handleSaveMedication = async () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      const medicationData = {
        ...formData,
        elderlyUserId: elderlyUser.id,
      }

      if (selectedMedication) {
        await updateMedication(elderlyUser.id, selectedMedication.id, medicationData)
      } else {
        await createMedication(elderlyUser.id, medicationData)
      }

      setIsModalVisible(false)
      loadMedications()
    } catch (error) {
      console.error("Error saving medication:", error)
      Alert.alert("Error", "Failed to save medication")
    }
  }

  const renderMedicationItem = ({ item }) => {
    return (
      <View style={styles.medicationCard}>
        <View style={styles.medicationHeader}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <View style={styles.dosageContainer}>
            <Text style={styles.dosageText}>{item.dosage}</Text>
          </View>
        </View>

        <View style={styles.frequencyContainer}>
          <Clock width={16} height={16} color="#8F9BB3" />
          <Text style={styles.frequencyText}>{item.frequency}</Text>
        </View>

        {item.time && <Text style={styles.timeText}>Time: {item.time}</Text>}

        {item.nextDose && (
          <View style={styles.nextDoseContainer}>
            <AlertCircle width={16} height={16} color="#FF6B6B" />
            <Text style={styles.nextDoseText}>Next dose: {item.nextDose}</Text>
          </View>
        )}

        {item.instructions && <Text style={styles.instructionsText}>Instructions: {item.instructions}</Text>}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditMedication(item)}>
            <Edit2 width={16} height={16} color="#4A90E2" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteMedication(item.id)}
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
        <Text style={styles.headerTitle}>Medications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medications added</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
        <Text style={styles.addButtonText}>+ Add Medication</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMedication ? "Edit Medication" : "New Medication"}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <X width={24} height={24} color="#2E3A59" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Medication Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Medication name"
              />

              <Text style={styles.inputLabel}>Dosage *</Text>
              <TextInput
                style={styles.input}
                value={formData.dosage}
                onChangeText={(text) => setFormData({ ...formData, dosage: text })}
                placeholder="e.g., 10mg, 1 tablet"
              />

              <Text style={styles.inputLabel}>Frequency *</Text>
              <TextInput
                style={styles.input}
                value={formData.frequency}
                onChangeText={(text) => setFormData({ ...formData, frequency: text })}
                placeholder="e.g., Once daily, Twice daily"
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="e.g., Morning, After meals"
              />

              <Text style={styles.inputLabel}>Next Dose</Text>
              <TextInput
                style={styles.input}
                value={formData.nextDose}
                onChangeText={(text) => setFormData({ ...formData, nextDose: text })}
                placeholder="e.g., Today 8:00 PM"
              />

              <Text style={styles.inputLabel}>Instructions</Text>
              <TextInput
                style={[styles.input, styles.instructionsInput]}
                value={formData.instructions}
                onChangeText={(text) => setFormData({ ...formData, instructions: text })}
                placeholder="Special instructions"
                multiline={true}
                numberOfLines={4}
              />
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMedication}>
              <Check width={20} height={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Medication</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  medicationCard: {
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
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
    flex: 1,
  },
  dosageContainer: {
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  dosageText: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  frequencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  frequencyText: {
    marginLeft: 8,
    color: "#8F9BB3",
    fontSize: 14,
  },
  timeText: {
    color: "#8F9BB3",
    fontSize: 14,
    marginBottom: 8,
  },
  nextDoseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nextDoseText: {
    marginLeft: 8,
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "bold",
  },
  instructionsText: {
    color: "#8F9BB3",
    fontSize: 14,
    fontStyle: "italic",
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
  instructionsInput: {
    height: 100,
    textAlignVertical: "top",
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

export default MedicationManagement

