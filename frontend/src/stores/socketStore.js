import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import { io } from "socket.io-client";
const backend_url = import.meta.env.VITE_BACKEND_URL;


export const useSocketStore = create((set) => ({
    socket: null,
    loading:true,
    connectSocket: () => {
        const token = useAuthStore.getState().token;
        console.log(token)
        const socket = io(backend_url, {
            auth: {
                token: token, // JWT
            },
        })
        set({socket:socket,loading:false})
    },
      disconnectSocket: () => {
    const socket = useAuthStore.getState().socket;
    socket?.disconnect();
  },
}))