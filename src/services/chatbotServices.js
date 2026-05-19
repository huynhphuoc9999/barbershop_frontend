const API_URL = "https://barbershop-backend-yn3c.onrender.com/api";

/**
 * Stream chat message from backend using Server-Sent Events (SSE)
 * Backend uses Groq AI (Llama 3.3 70B) for generating responses
 * 
 * @param {string} message - User message
 * @param {function} onChunk - Callback for each text chunk received
 * @param {function} onComplete - Callback when streaming completes
 * @param {function} onError - Callback for errors
 * @returns {function} - Function to abort the stream
 */
export const streamChatMessage = async (message, onChunk, onComplete, onError) => {
  try {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sessionId: null, // Can be used for conversation history in future
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let isCompleted = false; // Prevent multiple onComplete calls

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            if (!isCompleted) {
              isCompleted = true;
              onComplete?.();
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim(); // Remove 'data:' prefix
              
              if (data === '[DONE]') {
                if (!isCompleted) {
                  isCompleted = true;
                  onComplete?.();
                }
                return;
              }
              
              if (data && data !== '') {
                console.log('[chatbotServices] Emitting chunk:', data);
                onChunk?.(data);
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream reading error:', error);
        onError?.(error);
      }
    };

    readStream();

    // Return abort function
    return () => {
      reader.cancel();
    };

  } catch (error) {
    console.error('Chat stream error:', error);
    onError?.(error);
  }
};

/**
 * Test if chatbot service is running
 * @returns {Promise<boolean>}
 */
export const checkChatbotHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/chat/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
