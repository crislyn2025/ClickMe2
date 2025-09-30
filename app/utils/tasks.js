import AsyncStorage from '@react-native-async-storage/async-storage'


const STORAGE_KEY = 'taskmate_tasks'


export async function fetchTasks() {
const raw = await AsyncStorage.getItem(STORAGE_KEY)
return raw ? JSON.parse(raw) : []
}


export async function createTask(task) {
const tasks = await fetchTasks()
const newTask = { id: Date.now().toString(), ...task }
tasks.unshift(newTask)
await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
return newTask
}


export async function updateTask(id, updates) {
const tasks = await fetchTasks()
const idx = tasks.findIndex(g => g.id === id)
if (idx === -1) throw new Error('Task not found')
tasks[idx] = { ...tasks[idx], ...updates }
await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
return tasks[idx]
}


export async function deleteTask(id) {
let tasks = await fetchTasks()
tasks = tasks.filter(g => g.id !== id)
await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
return true
}