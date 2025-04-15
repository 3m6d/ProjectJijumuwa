# care/views.py
import logging
import requests # Required for making HTTP requests to AI service
from datetime import datetime # Required for handling date/time for appointments/reminders
from rest_framework import generics

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated # Ensure only logged-in users can use the chatbot

# Import your models
from .models import (
    MedicationReminder,
    DoctorAppointment,
    EmergencyContact,
    EmergencyEvent,
    Bhajan,
    ConversationLog,
)
# Import  serializers (you might need them for fetching/displaying data)
from .serializers import (
    MedicationReminderSerializer,
    DoctorAppointmentSerializer,
    EmergencyContactSerializer,
    EmergencyEventSerializer,
    BhajanSerializer,
    ConversationLogSerializer,
)
# Import user model if needed (e.g., to find caretaker)
from authentication.models import CustomUser, CaretakerProfile

# Setup logger
logger = logging.getLogger(__name__)

# --- Placeholder Functions ---
# These need to be implemented based on your actual AI service and notification setup

def call_ai_service(user_input, user_id):
    """
    Placeholder function to simulate calling your external AI service.
    Replace this with actual API call to your AI layer.
    """
    # --- Start AI Service Simulation ---
    # In a real scenario, you would make an HTTP request here:
    # try:
    #     response = requests.post('YOUR_AI_SERVICE_ENDPOINT', json={'message': user_input, 'user_id': user_id})
    #     response.raise_for_status() # Raise an exception for bad status codes
    #     ai_data = response.json()
    #     return ai_data
    # except requests.exceptions.RequestException as e:
    #     logger.error(f"AI Service call failed: {e}")
    #     return {
    #         "response": "माफ गर्नुहोस्, म अहिले प्रशोधन गर्न असमर्थ छु।", # Sorry, I'm unable to process right now.
    #         "intent": "error",
    #         "entities": {},
    #         "sentiment": None,
    #         "emergency_triggered": False
    #     }
    # --- End AI Service Simulation ---

    # --- Simulated Response (REMOVE THIS IN PRODUCTION) ---
    processed_input = user_input.lower()
    if "hello" in processed_input or "namaste" in processed_input:
        return {
            "response": "नमस्ते! म तपाईंलाई कसरी मद्दत गर्न सक्छु?", # Namaste! How can I help you?
            "intent": "greeting",
            "entities": {}, "sentiment": "positive", "emergency_triggered": False
        }
    elif "appointment" in processed_input and "schedule" in processed_input:
         return {
            "response": "Appointment scheduling simulation.",
            "intent": "schedule_appointment",
            "entities": {"doctor_name": "Dr. Test", "specialty": "Cardiology", "appointment_time": "2025-04-10T14:00:00Z", "location": "Test Clinic"},
            "sentiment": "neutral", "emergency_triggered": False
        }
    elif "medicine" in processed_input and "remind" in processed_input:
         return {
            "response": "Medication reminder setting simulation.",
            "intent": "set_medication_reminder",
            "entities": {"medication_name": "Paracetamol", "dosage": "500mg", "time": "08:00:00", "frequency": "daily"},
            "sentiment": "neutral", "emergency_triggered": False
        }
    elif "emergency" in processed_input or "help me" in processed_input or "मदत" in processed_input: # Simple keyword check for simulation
         # *** IMPORTANT: Real emergency detection needs robust NLP in your AI layer ***
         # This simulation assumes 'मदत' (madat - help) is the trigger word
         return {
            "response": "आपतकालिन सहायता सक्रिय गर्दै...", # Activating emergency help...
            "intent": "trigger_emergency",
            "entities": {"activation_word": "मदत"},
            "sentiment": "negative", "emergency_triggered": True
        }
    elif "bhajan" in processed_input or "play music" in processed_input:
         return {
            "response": "Playing bhajan simulation.",
            "intent": "play_bhajan",
            "entities": {}, "sentiment": "positive", "emergency_triggered": False
        }
    else:
        return {
            "response": "मैले तपाईंको कुरा बुझिन। कृपया फेरि भन्नुहोस्।", # I didn't understand you. Please say it again.
            "intent": "fallback",
            "entities": {}, "sentiment": "neutral", "emergency_triggered": False
        }
    # --- End Simulated Response ---


def notify_caretaker(elderly_user, event_details):
    """
    Placeholder function to simulate notifying the caretaker.
    Replace this with your actual notification logic (e.g., FCM, SMS).
    """
    try:
        # Find the caretaker associated with the elderly user
        caretaker_profile = CaretakerProfile.objects.filter(elderly=elderly_user).first()
        if caretaker_profile:
            caretaker_user = caretaker_profile.user
            message = f"Emergency alert for {elderly_user.name}. Details: {event_details}. Location: [Add Location if available]"
            logger.info(f"Simulating notification to Caretaker {caretaker_user.name} ({caretaker_user.phone_number}): {message}")
            # --- Add actual notification sending logic here ---
            # Example: send_push_notification(caretaker_user.device_token, message)
            # Example: send_sms(caretaker_user.phone_number, message)
            # --- End notification logic ---
            return True
        else:
            logger.warning(f"No caretaker found for elderly user {elderly_user.name} (ID: {elderly_user.id})")
            return False
    except Exception as e:
        logger.error(f"Failed to send notification for user {elderly_user.id}: {e}")
        return False

# --- Chatbot Interaction View ---

class ChatbotInteractionView(APIView):
    """
    Handles interactions between the user and the AI chatbot.
    Receives user input, processes it via the AI layer, performs backend actions,
    and returns the chatbot's response.
    """
    permission_classes = [IsAuthenticated] # Only authenticated users can access

    def post(self, request):
        user_input = request.data.get('message')
        user = request.user # Get the authenticated user object

        if not user_input:
            return Response({"error": "No message provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the user has the 'elderly' role (or adjust as needed)
        if user.role != 'elderly':
             return Response({"error": "Only elderly users can interact with the chatbot."}, status=status.HTTP_403_FORBIDDEN)

        logger.info(f"Received chat input from user {user.id}: {user_input}")

        # 1. Call the AI Service Layer
        # ===========================
        ai_result = call_ai_service(user_input, user.id)
        bot_response_text = ai_result.get("response", "माफ गर्नुहोस्, केहि गडबड भयो।") # Sorry, something went wrong.
        intent = ai_result.get("intent")
        entities = ai_result.get("entities", {})
        is_emergency = ai_result.get("emergency_triggered", False)
        sentiment = ai_result.get("sentiment") # Can be used for analytics or response tuning

        logger.info(f"AI Service Result for user {user.id}: Intent={intent}, Emergency={is_emergency}, Sentiment={sentiment}")

        # 2. Perform Backend Actions Based on Intent
        # ========================================
        try:
            if is_emergency:
                activation_word = entities.get("activation_word", "Unknown")
                # Create Emergency Event record
                event = EmergencyEvent.objects.create(elderly=user, activation_word=activation_word)
                logger.info(f"Emergency event created for user {user.id} (Event ID: {event.id})")
                # Notify Caretaker
                notify_caretaker(user, f"Emergency triggered with word: {activation_word}")
                # Override response for emergency
                bot_response_text = f"आपतकालिन सहायता सक्रिय गरिएको छ। तपाईंको हेरचाहकर्तालाई सूचित गरिएको छ।" # Emergency help activated. Your caretaker has been notified.

            elif intent == 'schedule_appointment':
                # Extract details (ensure proper validation and type conversion)
                try:
                    appointment_time_str = entities.get('appointment_time')
                    appointment_time_dt = datetime.fromisoformat(appointment_time_str.replace('Z', '+00:00')) if appointment_time_str else None
                    
                    if appointment_time_dt:
                        appointment = DoctorAppointment.objects.create(
                            elderly=user,
                            doctor_name=entities.get('doctor_name', 'N/A'),
                            specialty=entities.get('specialty', 'N/A'),
                            appointment_time=appointment_time_dt,
                            location=entities.get('location', 'N/A')
                        )
                        logger.info(f"Appointment created for user {user.id} (Appt ID: {appointment.id})")
                        bot_response_text = f"तपाईंको अपोइन्टमेन्ट {entities.get('doctor_name', '')} सँग {appointment_time_dt.strftime('%Y-%m-%d %I:%M %p')} बजेको लागि तय गरिएको छ।" # Your appointment with {doc_name} is scheduled for {time}.
                    else:
                         bot_response_text = "अपोइन्टमेन्ट समय भेटिएन। कृपया फेरि प्रयास गर्नुहोस्।" # Appointment time not found. Please try again.
                except Exception as e:
                    logger.error(f"Error creating appointment for user {user.id}: {e}")
                    bot_response_text = "अपोइन्टमेन्ट बनाउन असमर्थ। कृपया विवरणहरू जाँच गर्नुहोस्।" # Unable to create appointment. Please check details.


            elif intent == 'set_medication_reminder':
                 # Extract details (ensure proper validation and type conversion)
                try:
                    time_str = entities.get('time') # Expecting "HH:MM:SS"
                    if time_str:
                        reminder = MedicationReminder.objects.create(
                            elderly=user,
                            medication_name=entities.get('medication_name', 'N/A'),
                            dosage=entities.get('dosage', 'N/A'),
                            time=time_str,
                            frequency=entities.get('frequency', 'daily') # Default to daily if not provided
                        )
                        logger.info(f"Medication reminder created for user {user.id} (Reminder ID: {reminder.id})")
                        bot_response_text = f"{entities.get('medication_name', '')} को लागि {time_str} बजेको रिमाइन्डर सेट गरिएको छ।" # Reminder set for {med_name} at {time}.
                    else:
                        bot_response_text = "रिमाइन्डर समय भेटिएन। कृपया फेरि प्रयास गर्नुहोस्।" # Reminder time not found. Please try again.
                except Exception as e:
                    logger.error(f"Error creating medication reminder for user {user.id}: {e}")
                    bot_response_text = "रिमाइन्डर बनाउन असमर्थ। कृपया विवरणहरू जाँच गर्नुहोस्।" # Unable to create reminder. Please check details.

            elif intent == 'query_appointment':
                # Fetch upcoming appointments
                appointments = DoctorAppointment.objects.filter(elderly=user, appointment_time__gte=datetime.now()).order_by('appointment_time')
                if appointments.exists():
                    response_list = ["तपाईंका आगामी अपोइन्टमेन्टहरू:"] # Your upcoming appointments:
                    for appt in appointments[:3]: # Limit to first 3
                        response_list.append(f"- {appt.doctor_name} ({appt.specialty}) at {appt.appointment_time.strftime('%Y-%m-%d %I:%M %p')} in {appt.location}")
                    bot_response_text = "\n".join(response_list)
                else:
                    bot_response_text = "तपाईंको कुनै आगामी अपोइन्टमेन्टहरू छैनन्।" # You have no upcoming appointments.

            elif intent == 'query_medication':
                 # Fetch pending medication reminders for today (example logic)
                reminders = MedicationReminder.objects.filter(elderly=user, status='pending') # Add date filtering if needed
                if reminders.exists():
                    response_list = ["आजका लागि तपाईंको औषधि रिमाइन्डरहरू:"] # Your medication reminders for today:
                    for rem in reminders[:5]: # Limit to first 5
                        response_list.append(f"- {rem.medication_name} ({rem.dosage}) at {rem.time.strftime('%I:%M %p')}")
                    bot_response_text = "\n".join(response_list)
                else:
                    bot_response_text = "तपाईंको आजका लागि कुनै औषधि रिमाइन्डरहरू छैनन्।" # You have no medication reminders for today.

            elif intent == 'play_bhajan':
                 # Fetch a bhajan (e.g., random or first one)
                 bhajan = Bhajan.objects.order_by('?').first() # Get a random Bhajan
                 if bhajan:
                     # The frontend would need to handle playing the audio from the file_path URL
                     # The backend just provides the info.
                     bot_response_text = f"भजन बजाउँदै: {bhajan.title}।" # Playing bhajan: {title}.
                     # Include URL in response if frontend needs it directly
                     # return Response({"reply": bot_response_text, "bhajan_url": request.build_absolute_uri(bhajan.file_path.url)}, status=status.HTTP_200_OK)
                 else:
                     bot_response_text = "माफ गर्नुहोस्, अहिले कुनै भजन उपलब्ध छैन।" # Sorry, no bhajans available right now.

            # Add more intents as needed...

            elif intent == 'error':
                 # AI service failed, use the error response from call_ai_service
                 pass # bot_response_text already set

            elif intent == 'fallback':
                 # AI couldn't understand, use the fallback response
                 pass # bot_response_text already set


        except Exception as e:
            logger.error(f"Error processing intent '{intent}' for user {user.id}: {e}")
            bot_response_text = "माफ गर्नुहोस्, तपाईंको अनुरोध प्रशोधन गर्दा त्रुटि भयो।" # Sorry, an error occurred while processing your request.



        try:
            ConversationLog.objects.create(
                elderly=user,
                user_input=user_input,
                bot_response=bot_response_text,
                is_emergency=is_emergency
                # Consider adding intent and sentiment fields to the ConversationLog model for better tracking
            )
        except Exception as e:
            logger.error(f"Failed to save conversation log for user {user.id}: {e}")


        # 4. Return the Response
        # ======================
        return Response({"reply": bot_response_text}, status=status.HTTP_200_OK)




class DoctorAppointmentCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = DoctorAppointment.objects.all()  # Adjust filtering as needed
    serializer_class = DoctorAppointmentSerializer

class DoctorAppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer

class EmergencyContactCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = EmergencyContact.objects.all()  # Adjust filtering as needed
    serializer_class = EmergencyContactSerializer

class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer


class EmergencyEventListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = EmergencyEvent.objects.all()  # Adjust filtering as needed
    serializer_class = EmergencyEventSerializer

class BhajanListCreateView(generics.ListCreateAPIView):
    # Uncomment or modify the permission classes as needed:
    # permission_classes = [IsAuthenticated]
    queryset = Bhajan.objects.all()
    serializer_class = BhajanSerializer

class BhajanDetailView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated]  # restrict as needed
    queryset = Bhajan.objects.all()
    serializer_class = BhajanSerializer

class ConversationLogListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ConversationLog.objects.all()  # Adjust filtering as needed (e.g., only user-related logs)
    serializer_class = ConversationLogSerializer


class MedicationReminderListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = MedicationReminder.objects.all() 
    serializer_class = MedicationReminderSerializer

class MedicationReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = MedicationReminder.objects.all()
    serializer_class = MedicationReminderSerializer

