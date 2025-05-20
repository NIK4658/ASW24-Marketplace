
import {ref} from 'vue'
import io from 'socket.io-client'
import axios from "axios";

const socket = ref(null)

const connectSocket = async () => {
  const res = await axios.get('http://localhost:3000/users/session', {withCredentials: true})
  if ((!socket.value || !socket.value.connected) && res.status === 200) {
    socket.value = io('http://localhost:3000', {withCredentials: true})
  }
}

const initialConnection = async (popupRef) => {
  try {
    await connectSocket()
    setupSocketEvents(popupRef)
  } catch {
    console.log('Nessuna sessione attiva')
  }
}

function setupSocketEvents(popupRef) {
  if (!socket.value) return

  socket.value.on('connect', () => {
    console.log('Socket connesso')
  })

  socket.value.on('buyNotificationClient', () => {
    popupRef.value?.show('Hai venduto un oggetto!')
  })

  socket.value.on('newMessageNotificationClient', () => {
    popupRef.value?.show('Hai un nuovo messaggio!')
  })

  socket.value.on('reviewNotificationClient', () => {
    popupRef.value?.show('Hai ricevuto una recensione!')
  })
}

export { socket, connectSocket, setupSocketEvents, initialConnection }
