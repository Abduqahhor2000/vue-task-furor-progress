import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.vue'
import axios from "axios"

axios.defaults.baseURL = "http://94.158.54.194:9092/"

createApp(App).mount('#app')
