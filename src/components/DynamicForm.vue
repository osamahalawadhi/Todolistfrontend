<template>
  <div>
    <h3>{{ title }}</h3>
    <div>
      <input v-model="taskField" placeholder="Name" type="text" @keyup.enter="add()">
      <button type="button" @click="add()">Add</button>
    </div>
    <div>
      <table>
        <tbody>
        <tr v-if="items.length === 0">
          <td colspan="2">No task yet</td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.title }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    const items = ref([])
    const taskField = ref('')

    function loadTasks () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
      const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, ${response.statusText}`)
          }
          return response.json()
        })
        .then((result) => {
          console.log('Loaded tasks:', result)
          items.value = result
        })
        .catch((error) => console.error('Error loading tasks:', error))
    }

    function add () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        title: taskField.value
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, ${response.statusText}`)
          }
          return response.json()
        })
        .then((data) => {
          console.log('Success:', data)
          items.value.push(data)
          // Optional: Clear the input field after successful addition
          taskField.value = ''
        })
        .catch((error) => console.error('Error adding task:', error))
    }

    // Lifecycle hooks
    onMounted(() => {
      loadTasks()
    })

    return {
      items,
      taskField,
      add
    }
  }
}
</script>

<style scoped>
h3 {
  text-align: center;
}
table {
  margin-left: auto;
  margin-right: auto;
}
button {
  color: blue;
}
</style>
