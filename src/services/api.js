// This is a mock API service.
// Replace the contents of these functions with actual API calls (e.g., using axios or fetch)
// when connecting to the real backend.

const MOCK_DELAY = 1000;

export const symptomCheckerService = {
  /**
   * Send a message to the AI symptom checker
   * @param {Array} history - The chat history
   * @param {string} message - The new user message
   * @returns {Promise<Object>} The AI response message
   */
  sendMessage: async (history, message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          role: 'ai',
          content: `I received your symptom: "${message}". Please provide more details or wait for the backend to process this properly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, MOCK_DELAY);
    });
  }
};

export const patientProfileService = {
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "John Doe",
          age: 32,
          bloodType: "O+",
          allergies: ["Penicillin", "Peanuts"]
        });
      }, MOCK_DELAY);
    });
  }
};

// Add other services (e.g., xrayAnalysisService, clinicLocatorService) as needed!
