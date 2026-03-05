import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import { io } from "socket.io-client";

export const useSocketStore = create((set) => ({
    socket: null,
    loading:true,
    connectSocket: () => {
        const token = useAuthStore.getState().token;
        console.log(token)
        const socket = io("http://localhost:3000", {
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