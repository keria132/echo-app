export const createSocket = (): WebSocket => new WebSocket(import.meta.env.VITE_WS_URL);
