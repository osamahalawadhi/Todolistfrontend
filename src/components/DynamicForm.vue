<template>
  <div>
    <h3>{{ title }}</h3>
    <div>
      <input v-model="titleField" placeholder="add your task" type="text" >
      <input v-model="completedField" placeholder="add your task" type="text" @keyup.enter="add()">
      <button type="button" @click="add()">Add</button>
    </div>
    <div>
      <table>
        <thead>
        <tr>
          <th>title</th>
          <th>completed</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="items.length === 0">
          <td colspan="2">No task yet</td>
        </tr>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.completed }}</td>
        </tr>
        <tr>
          <td>{{ titleField }}</td>
          <td>{{ completedField }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="container">
    <div class="todo-app"></div>
      <h2>TodoList</h2>
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
    const titleField = ref('')
    const completedField = ref(false)

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
        title: titleField.value,
        completed: completedField.value
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
          return response.text() // Änderung: Text statt JSON
        })
        .then((data) => {
          if (data.trim() !== '') {
            // Prüfen, ob die Antwort nicht leer ist, bevor sie geparsed wird
            const jsonData = JSON.parse(data)
            console.log('Success:', jsonData)
            items.value.push(jsonData)
            titleField.value = ''
            // Optional: Clear the input fields after successful addition
          }
        })
        .catch((error) => console.error('Error adding task:', error))
    }

    // Lifecycle hooks
    onMounted(() => {
      loadTasks()
    })

    return {
      items,
      titleField,
      completedField,
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
