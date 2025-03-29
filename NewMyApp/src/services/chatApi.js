const BASE_URL = 'http://192.168.1.86:8081/chatbot/'; // Replace with your actual API URL

export const chatApi = {
  sendMessage: async (message) => {
    try {
      const response = await fetch(`${BASE_URL}send/`, { // Adjust the endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), // Send the message to the API
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data; // Return the response from the API
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Rethrow the error for handling in the component
    }
  },
};