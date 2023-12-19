<template>
  <div class="app">
    <div class="container">
      <div id="wrapper">
        <input v-model="title" placeholder="Task to be Done.." type="text"/>
        <button id="add-btn" @click="addTask">Add</button>
      </div>
      <div>
        <ul class="list-group"  v-for="task in tasks" :key="task.id">
          <li class="list-group-item d-flex align-items-center flex-wrap flex-basis-0">
            <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="tasks" checked>
            <label class="form-check-label" for="tasks">{{ task.title }}</label>
            <div class="buttons ">
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
      taskCount: 0,
      tasks: [],
      editingTask: null
    }
  },
  methods: {
    async addTask () {
      try {
        if (!this.title.trim()) {
          this.errorVisible = true
          return
        }

        if (this.editingTask) {
          // Bearbeiten des bestehenden Tasks
          await this.updateTask(this.editingTask)
        } else {
          // Hinzufügen eines neuen Tasks
          await this.createTask()
        }

        this.title = ''
        this.errorVisible = false
        this.fetchTaskCount()
        this.fetchTasks()

        // Zurücksetzen des Bearbeitungsstatus
        this.editingTask = null
      } catch (error) {
        console.log('error', error)
      }
    },

    async createTask () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const payload = JSON.stringify({
        title: this.title,
        completed: this.completed
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
    },

    async updateTask (task) {
      const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${task.id}`
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        id: task.id,
        title: this.title, // Verwende den Titel aus dem Formular
        completed: task.completed
      })

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      const response = await fetch(endpoint, requestOptions)
      const result = await response.text()
      console.log(result)
    },

    editTask (task) {
      // Setze den zu bearbeitenden Task und fülle das Formular mit seinen Daten
      this.editingTask = task
      this.title = task.title
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
      this.fetchTaskCount()
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

</style>
