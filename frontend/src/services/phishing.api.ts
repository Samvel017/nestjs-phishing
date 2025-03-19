import api from "./api";

export const phishingApi = {
  getAllAttempts: async () => {
    const response = await api.get("/phishing");
    return response.data;
  },

  getAttemptById: async (id: string) => {
    const response = await api.get(`/phishing/${id}`);
    return response.data;
  },

  sendSimulation: async (data: {
    recipientEmail: string;
    emailTemplate: string;
    customSubject?: string;
    customContent?: string;
  }) => {
    const payload = {
      recipientEmail: data.recipientEmail,
      emailContent: data.customContent || "",
      subject: data.customSubject,
      template: data.emailTemplate,
    };
    const response = await api.post("/phishing/send", payload);
    return response.data;
  },

  deleteAttempt: async (id: string) => {
    const response = await api.delete(`/phishing/${id}`);
    return response.data;
  },
};
