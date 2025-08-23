// Simple in-memory store for messages (will be replaced with actual OrbitDB implementation)
// This is a temporary solution until we set up the proper OrbitDB environment

type Message = {
  text: string;
  sender: string;
  timestamp: number;
};

class OrbitDBService {
  private messages: Message[] = [];
  private subscribers: ((message: Message) => void)[] = [];

  // Get all messages
  async getMessages(): Promise<Message[]> {
    // Try to load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat-messages');
      if (saved) {
        this.messages = JSON.parse(saved);
      }
    }
    return [...this.messages];
  }

  // Add a new message
  async addMessage(message: Omit<Message, 'timestamp'>): Promise<void> {
    const newMessage: Message = {
      ...message,
      timestamp: Date.now()
    };
    
    this.messages.push(newMessage);
    
    // Save to localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat-messages', JSON.stringify(this.messages));
    }
    
    // Notify subscribers
    this.notifySubscribers(newMessage);
  }

  // Subscribe to new messages
  onNewMessage(callback: (message: Message) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  // Notify all subscribers of a new message
  private notifySubscribers(message: Message) {
    this.subscribers.forEach(callback => callback(message));
  }
}

export const orbitDBService = new OrbitDBService();
