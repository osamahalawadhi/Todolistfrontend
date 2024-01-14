<template>
  <div>
    <div :class ="'sidebar ' + rightPostion">
      <TaskEditor :id="selectedTask" />

    </div>
  <div class="app">
    <div id="search-wrapper">
      <input id="search-input" data-test="todo" v-model="filterCrit" placeholder="search">
    </div>
    <div id="wrapper">
      <input type="text" data-test="todo" class="form-control is-invalid" id="title" placeholder="Task to be Done.." v-model="title" />
      <button id="add-btn" @click="createTask()">Add</button>
    </div>
    <div id="tasks" class="scrool">
      <ul class="list-group" v-for="task in filteredTasks" :key="task.id">
        <li @click="toggleSidebar(task.id)" class="list-group-item d-flex align-items-center flex-wrap flex-basis-0">
          <!-- Checkbox und Invalid-Feedback -->
          <input
              class="form-check-input me-1"
              type="checkbox"
              data-test="todo-checkbox"
              id="title"
              v-model="task.completed"
              @change="updateTaskStatus(task)"
              required
          />
          <div class="invalid-feedback">
            Please provide a task.
          </div>

          <!-- Label für die Aufgabe -->
          <label v-if="editingTask !== task" class="form-check-label" :class="{ 'completed-task': task.completed }" for="tasks">
            {{ task.title.length > 40 ? task.title.substring(0, 40) + '...' : task.title }}
          </label>

          <!-- Eingabefeld während der Bearbeitung -->
          <input
              v-else
              type="text"
              class="form-control"
              v-model="title"
          />

          <!-- Bearbeitungs- und Löschen-Buttons -->
          <div class="buttons">
            <button v-if="editingTask !== task" @click="editTask(task)">Edit</button>
            <button @click="deleteTask(task)">Delete</button>
            <button v-if="editingTask === task" @click="cancelEdit">Cancel</button>
            <button v-if="editingTask === task" @click="updateTask">Save</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>
<script >

import TaskEditor from '@/components/TaskEditor.vue'
export default {
  name: 'DynamicForm',
  components: { TaskEditor },
  data () {
    return {
      title: '',
      completed: false,
      tasks: [],
      filterCrit: '',
      editingTask: null,
      dueDate: null,
      priority: '',
      notes: '',
      selectedTask: 0,
      rightPostion: 'close'

    }
  },
  computed: {
    filteredTasks: function () {
      const crit = this.filterCrit.toLowerCase()
      return this.tasks.filter(task => crit.length < 1 || task.title.toLowerCase().includes(crit))
    }
  },
  methods: {
    toggleSidebar (id) {
      this.selectedTask = id
      this.rightPostion = this.rightPostion === 'open' ? 'closed' : 'open'
    },
    async createTask () {
      try {
        const trimmedTitle = this.title.trim().substring(0, 40)

        if (this.title.trim().length > 60) {
          alert('Error: Task title should not exceed 60 characters.')
          return
        }

        const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task'
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        const payload = JSON.stringify({
          title: trimmedTitle,
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
        // Nach dem Hinzufügen sofort die Tasks aktualisieren
        this.fetchTasks()
        this.title = ''
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
    async updateTask () {
      try {
        const trimmedTitle = this.title.trim().substring(0, 40)

        if (this.title.trim().length > 60) {
          alert('Error: Task title should not exceed 60 characters.')
          return
        }

        const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${this.editingTask.id}`
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const payload = JSON.stringify({
          title: trimmedTitle,
          completed: this.completed,
          dueDate: this.dueDate,
          priority: this.priority,
          notes: this.notes
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
        await this.fetchTasks()

        // Zurücksetzen des Bearbeitungszustands
        this.editingTask = null
        this.title = ''
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    editTask (task) {
      this.editingTask = task
      this.title = task.title
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
        await this.fetchTasks()
      } catch (error) {
        console.error('Error updating task status:', error)
      }
    },
    cancelEdit () {
      // Setzen Sie den zu bearbeitenden Task auf null, um die Bearbeitung zu beenden
      this.editingTask = null

      this.title = ''
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

  async mounted () {
    await this.fetchTasks()
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app{
  max-height: 100vh;
  overflow: hidden;
}
.sidebar {
  background-color: #eee;
  padding: 10px 20px;
  position: fixed;
  right: -500px;
  top: 0;
  height: 100%;
  width: 400px;
  z-index: 100;
  transition: all 0.8s ease-in-out;
}
.open {
  right: 0;
}
.app {
  max-height: 100vh;
  background: linear-gradient(white, white);
  font-family: "Poppins", sans-serif;
  width: min(95vw, 31.25em);
  margin: auto;
  position: relative;
  top: 1.857em;
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
.list-group {
  flex-wrap: wrap;
  flex-basis: 0;
  margin-bottom: 10px !important
}
.list-group-item {
  display: flex;
  align-items: center;
}
.buttons {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: -23px 0 0.1rem 3rem;
}
.form-check-label{
  margin-left: 2rem;
  margin-top: 0.3rem;
  position: relative;
  white-space: pre-wrap;
}
.completed-task{
  text-decoration: line-through;
}
#search-input {
  border-bottom: 2px solid #d1d3d4;
  outline: none;
  margin-left: -230%;
}
.scrool{
  height: calc(100vh - 180px);
  overflow-y: scroll;
  padding: 10px 10px;
}
/* Customize scrollbar appearance */
.scrool::-webkit-scrollbar {
  width: 12px; /* Set the width of the scrollbar */
}

.scrool::-webkit-scrollbar-thumb {
  background-color: #888; /* Set the color of the scrollbar thumb */
}

.scrool::-webkit-scrollbar-track {
  background-color: #eee; /* Set the color of the scrollbar track */
}
</style>
