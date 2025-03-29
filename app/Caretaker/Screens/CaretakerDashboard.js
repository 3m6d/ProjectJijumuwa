import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Calendar, Clock, User, Phone, PlusCircle, AlertCircle } from "react-native-feather"

const CaretakerDashboard = ({ navigation, route }) => {
  const [appointments, setAppointments] = useState([])
  const [medications, setMedications] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [elderlyUser, setElderlyUser] = useState(route.params?.elderlyUser || { id: 1, name: "John Doe" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const appointmentsData = await fetchAppointments(elderlyUser.id)
      const medicationsData = await fetchMedications(elderlyUser.id)
      const contactsData = await fetchEmergencyContacts(elderlyUser.id)

      setAppointments(appointmentsData)
      setMedications(medicationsData)
      setEmergencyContacts(contactsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const renderUpcomingAppointments = () => {
    const upcomingAppointments = appointments.slice(0, 3)

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AppointmentManagement", { elderlyUser })}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Calendar width={24} height={24} color="#4A90E2" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{appointment.title}</Text>
                <Text style={styles.cardSubtitle}>
                  {new Date(appointment.date).toLocaleDateString()} at{" "}
                  {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={styles.cardDetails}>{appointment.doctor}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming appointments</Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AppointmentManagement", {
              elderlyUser,
              action: "add",
            })
          }
        >
          <PlusCircle width={20} height={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderMedications = () => {
    const currentMedications = medications.slice(0, 3)

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MedicationManagement", { elderlyUser })}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {currentMedications.length > 0 ? (
          currentMedications.map((medication) => (
            <View key={medication.id} style={styles.card}>
              <View style={[styles.cardIconContainer, { backgroundColor: "#F0F7FF" }]}>
                <Clock width={24} height={24} color="#FF6B6B" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{medication.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {medication.dosage} - {medication.frequency}
                </Text>
                <Text style={styles.cardDetails}>Next dose: {medication.nextDose}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No medications added</Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("MedicationManagement", {
              elderlyUser,
              action: "add",
            })
          }
        >
          <PlusCircle width={20} height={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderEmergencyContacts = () => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {emergencyContacts.length > 0 ? (
          emergencyContacts.map((contact) => (
            <View key={contact.id} style={styles.card}>
              <View style={[styles.cardIconContainer, { backgroundColor: "#FFF0F0" }]}>
                <Phone width={24} height={24} color="#4CAF50" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{contact.name}</Text>
                <Text style={styles.cardSubtitle}>{contact.relationship}</Text>
                <Text style={styles.cardDetails}>{contact.phoneNumber}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No emergency contacts added</Text>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.elderlyInfoContainer}>
          <View style={styles.elderlyAvatar}>
            <User width={24} height={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.elderlyName}>{elderlyUser.name}</Text>
            <Text style={styles.caretakerLabel}>You are a caretaker</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.alertButton}>
          <AlertCircle width={24} height={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {renderUpcomingAppointments()}
      {renderMedications()}
      {renderEmergencyContacts()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9F0",
  },
  elderlyInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  elderlyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  elderlyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  caretakerLabel: {
    fontSize: 14,
    color: "#8F9BB3",
  },
  alertButton: {
    padding: 10,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  viewAllButton: {
    padding: 5,
  },
  viewAllText: {
    color: "#4A90E2",
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
  },
  cardIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 3,
  },
  cardDetails: {
    fontSize: 14,
    color: "#8F9BB3",
  },
  emptyText: {
    fontSize: 14,
    color: "#8F9BB3",
    fontStyle: "italic",
    textAlign: "center",
    padding: 15,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default CaretakerDashboard

