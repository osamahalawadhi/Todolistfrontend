<template>
  <div class="app">
    <div class="container">
      <div id="wrapper">
        <input v-model="title" placeholder="Task to be Done.." type="text" />
        <button id="add-btn" @click="editingTask ? updateTask() : createTask()">
          {{ editingTask ? 'Update' : 'Add' }}
        </button>
      </div>
      <div id="tasks">
        <ul class="list-group" v-for="task in tasks" :key="task.id">
          <li class="list-group-item d-flex align-items-center flex-wrap flex-basis-0">
            <input
                class="form-check-input me-1"
                type="checkbox"
                v-model="task.completed"
                @change="updateTaskStatus(task)"
            />
            <label class="form-check-label" :class="{ 'completed-task': task.completed }" for="tasks">
              {{ task.title }}
            </label>
            <div class="buttons d-flex justify-content: center flex-basis: auto; margin-left: 0; margin-right: 0;">
              <button @click="editTask(task)">Edit</button>
              <button @click="deleteTask(task)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicForm',
  data () {
    return {
      title: '',
      completed: false,
      errorVisible: false,
      tasks: [],
      editingTask: null
    }
  },
  methods: {
    async createTask () {
      try {
        const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        const payload = JSON.stringify({
          title: this.title,
          completed: this.completed // Hier wird das completed-Attribut auf this.completed gesetzt
        })

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: payload,
          redirect: 'follow'
        }

        const response = await fetch(endpoint, requestOptions)
        const result = await response.text()
        console.log(result)

        // Nach dem Hinzufügen sofort die Tasks aktualisieren
        this.fetchTasks()
      } catch (error) {
        console.error('Error creating task:', error)
      }
    },
    async deleteTask (task) {
      const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${task.id}`
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      }

      const response = await fetch(endpoint, requestOptions)
      const result = await response.text()
      console.log(result)
      this.fetchTasks()
    },
    async editTask (task) {
      this.editingTask = task
      this.title = task.title
      this.completed = task.completed
    },
    async updateTask () {
      try {
        const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${this.editingTask.id}`
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        const payload = JSON.stringify({
          title: this.title,
          completed: this.completed
        })

        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: payload,
          redirect: 'follow'
        }

        const response = await fetch(endpoint, requestOptions)
        const result = await response.text()
        console.log(result)

        // Nach dem Aktualisieren sofort die Tasks aktualisieren
        this.fetchTasks()

        // Zurücksetzen des Bearbeitungszustands
        this.editingTask = null
        this.title = ''
        this.completed = false
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    async updateTaskStatus (task) {
      try {
        const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${task.id}`
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        const payload = JSON.stringify({
          title: task.title,
          completed: task.completed
        })

        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: payload,
          redirect: 'follow'
        }

        const response = await fetch(endpoint, requestOptions)
        const result = await response.text()
        console.log(result)

        // Nach dem Aktualisieren sofort die Tasks aktualisieren
        this.fetchTasks()
      } catch (error) {
        console.error('Error updating task status:', error)
      }
    },
    async fetchTasks () {
      try {
        const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
        const response = await fetch(endpoint)
        const result = await response.json()
        this.tasks = result
      } catch (error) {
        console.log('error', error)
      }
    }
  },

  mounted () {
    this.fetchTasks()
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(white, white);
  font-family: "Poppins", sans-serif;
  width: min(95vw, 31.25em);
  margin: auto;
  position: relative;
  top: 1.857em;
}

.container {
  padding: 2em 2.5em;
  background-color: #f1f8fb;
  box-shadow: 0 1em 2em rgba(0, 0, 0, 0.3);
  border-radius: 0.8em;
}

#wrapper {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 1em;
}

#wrapper input {
  width: 100%;
  background-color: transparent;
  color: #111111;
  font-size: 0.9em;
  border: none;
  border-bottom: 2px solid #d1d3d4;
  padding: 1em 0.5em;
  outline: none;
}

#wrapper input:focus {
  border-color: #5a05ff;
}

#wrapper button {
  border-radius: 0.5em;
  font-weight: 500;
  font-size: 1em;
  background-color: #5a95ff;
  border: none;
  color: #ffffff;
  cursor: pointer;
  outline: none;
}

#tasks {
  margin-top: 1em;
}

#pending-tasks {
  color: #111111;
}
.list-group {
  flex-wrap: wrap;
  flex-basis: 0;
}
.list-group-item {
  display: flex;
  align-items: center;
}
.buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: -23px;
  margin-bottom:0.1rem;
  margin-left: 3rem;
  margin-right: 0;
}

.list-group-item {
  margin-bottom: 1rem;
}

.form-check-label{
  margin-left: 2rem;
  margin-top: 1rem;
  position: relative;
}
.completed-task{
  text-decoration: line-through;
}

</style>
