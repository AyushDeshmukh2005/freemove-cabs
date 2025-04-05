
// Fix the implementation of generateSplitPaymentLink to match the component usage

export const generateSplitPaymentLink = async (rideId: string): Promise<{link: string, amount: number}> => {
  try {
    const response = await axios.post(`${API_URL}/${rideId}/split-payment`);
    return response.data; // This should return {link: string, amount: number}
  } catch (error) {
    console.error('Error generating split payment link:', error);
    throw error;
  }
};
