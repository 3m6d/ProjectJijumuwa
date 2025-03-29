import { createStackNavigator } from "@react-navigation/stack"
import CaretakerDashboard from "../Screens/CaretakerDashboard"
import AppointmentManagement from "../Screens/AppointmentManagement"
import MedicationManagement from "../Screens/MedicationManagement"

const Stack = createStackNavigator()

const CaretakerNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaretakerDashboard" component={CaretakerDashboard} />
      <Stack.Screen name="AppointmentManagement" component={AppointmentManagement} />
      <Stack.Screen name="MedicationManagement" component={MedicationManagement} />
    </Stack.Navigator>
  )
}

export default CaretakerNavigation

