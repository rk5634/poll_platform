// src/services/websocket.ts

type MessageHandler = (data: any) => void;

// Uses environment variable or defaults to common FastAPI/Uvicorn WebSocket URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

export class WSClient {
  private ws: WebSocket | null = null;
  private handlers: MessageHandler[] = [];

  /**
   * Attempts to establish a WebSocket connection.
   * Includes basic auto-reconnect logic on close.
   */
  connect() {
    if (this.ws) return; // already connected
    
    // Check if WebSocket is available in the environment
    if (typeof WebSocket === 'undefined') {
        console.error("WebSocket is not available in this environment.");
        return;
    }

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    this.ws.onmessage = (event) => {
      try {
        // All messages are expected to be JSON strings
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket message received:", data);
        // Broadcast the parsed data to all registered handlers
        this.handlers.forEach((handler) => handler(data));
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    this.ws.onclose = () => {
      console.log("⚠️ WebSocket disconnected, retrying in 3s...");
      this.ws = null;
      // Implement simple exponential backoff/reconnect
      setTimeout(() => this.connect(), 3000); 
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.ws?.close();
    };
  }

  /**
   * Closes the WebSocket connection.
   */
  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.handlers = []; // Clear handlers on disconnect
    console.log("🛑 WebSocket disconnected by client");
  }

  /**
   * Registers a function to be called when a new message arrives.
   * @param handler The function to call with the message data.
   */
  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
  }

  /**
   * Removes a previously registered message handler.
   * @param handler The function to remove.
   */
  removeHandler(handler: MessageHandler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
  
  /**
   * Sends JSON data through the WebSocket connection.
   * @param data The object to send (will be stringified).
   */
  send(data: object) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
              this.ws.send(JSON.stringify(data));
          } catch (error) {
              console.error("Failed to send data:", error);
          }
      } else {
          console.warn("WebSocket not open. Data not sent.", data);
      }
  }
}

// Singleton client instance for the entire application
export const wsClient = new WSClient();
