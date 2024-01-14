<template>
  <div>
    <div :class ="'sidebar ' + rightPostion">
      <TaskEditor :id="selectedTask" @updateFetch="fetchTasks()"/>
    </div>
  <div class="app">
  <div class="app-header">
    <div id="search-wrapper">
      <input id="search-input" data-test="todo" v-model="filterCrit" placeholder="search">
    </div>
    <div id="wrapper">
      <input maxlength="60" type="text" data-test="todo" class="form-control is-invalid" placeholder="Task to be Done.." v-model="title" />
      <button id="add-btn" @click="createTask()">Add</button>
    </div>
    <div></div>
  </div>
  <div class="tasks-container">

    <div class="filter-list">
      <div class="flex-start">
        <input type="checkbox"  id="filter-1" v-model="filterCompleted">
        <label for="filter-1">Completed</label>
      </div>
      <div class="flex-start">
        <input type="checkbox"  id="filter-2" v-model="filterScheduled">
        <label for="filter-2">Scheduled</label>
      </div>
      <div class="flex-start">
        <input type="checkbox" id="filter-3" v-model="filterPriority">
        <label for="filter-3">Priority</label>
      </div>
    </div>
      <div id="tasks" class="scrool">
        <ul class="list-group" v-for="task in filteredTasks" :key="task.id">
          <li  class="list-group-item d-flex align-items-center flex-wrap flex-basis-0">
            <div class="edit-task">
              <!-- Checkbox und Invalid-Feedback -->
              <input
                  class="form-check-input me-1"
                  type="checkbox"
                  data-test="todo-checkbox"
                  v-model="task.completed"
                  @change="updateTaskStatus(task)"
                  required
              />
              <div class="invalid-feedback">
                Please provide a task.
              </div>
              <!-- Label für die Aufgabe -->
              <label @click="toggleSidebar(task.id)" v-if="editingTask !== task" class="form-check-label flex-1" :class="{ 'completed-task': task.completed }">
                {{ task.title.length > 40 ? task.title.substring(0, 40) + '...' : task.title }}
              </label>
              <!-- Eingabefeld während der Bearbeitung -->
              <input
                  v-else
                  type="text"
                  class="form-control"
                  v-model="title"
                  maxlength="60"
              />
              <!-- Bearbeitungs- und Löschen-Buttons -->
              <div class="buttons">
                <button class="btn-style-edit" v-if="editingTask !== task" @click="editTask(task)">Edit</button>
                <button class="btn-style-delete" @click="deleteTask(task)">Delete</button>
                <button class="btn-style-cancle" v-if="editingTask === task" @click="cancelEdit">Cancel</button>
                <button class="btn-style-save" v-if="editingTask === task" @click="updateTask">Save</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
  </div>
  </div>
  </div>
</template>

<script>
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
      rightPostion: 'close',
      filterCompleted: false,
      filterScheduled: false,
      filterPriority: false
    }
  },
  computed: {
    filteredTasks: function () {
      const crit = this.filterCrit.toLowerCase()
      let searchFilter = this.tasks.filter(task => crit.length < 1 || task.title.toLowerCase().includes(crit))
      if (this.filterCompleted) {
        searchFilter = searchFilter.filter(task => task.completed === true)
      }
      if (this.filterScheduled) {
        searchFilter = searchFilter.filter(task => task.dueDate !== null)
      }
      if (this.filterPriority) {
        searchFilter = searchFilter.filter(task => task.priority === 'HIGH')
      }

      return searchFilter
    }
  },
  methods: {
    toggleSidebar (id) {
      if (this.selectedTask === id) {
        this.rightPostion = this.rightPostion === 'open' ? 'closed' : 'open'
        return
      }
      this.selectedTask = id
      this.rightPostion = 'open'
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
body{
  background: rgb(14,0,254);
  background: linear-gradient(90deg, rgb(161, 157, 244) 0%, rgb(182, 182, 255) 0%, rgba(0,212,255,1) 100%);
}
.tasks-container{
  position: relative;
}
.flex-start{
  display: flex;
  gap: 10px;
}
.filter-list{
  position: absolute;
  left: 60px;
  z-index: 150;
}
#app{
  max-height: 100vh;
  overflow: hidden;
}
.buttons button{
  padding: 5px 8px;
  width: 70px;
  height: 40px;
  font-size: 18px;
  display: inline-block;
  border: none;
  border-radius: 5px;
  color: white;
  box-shadow: 2px 2px 5px #ccc;
}
.btn-style-edit{
  background-color: #0fa2b8;
  margin-right: 4px;
}
.btn-style-delete{
  background-color: #b80f0f;
}
.btn-style-cancle{
  background-color: #b2b2b2;
  margin: 0 4px;
}
.btn-style-save{
  background-color: #5a95ff;
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
  font-family: "Poppins", sans-serif;
  width: 100%;
  margin: auto;
  position: relative;
  top: 1.857em;
}
#wrapper {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 1em;
  width: 600px;
}

#wrapper input {
  width: 100%;
  background-color: #eee;
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
.app-header{
  display: flex;
  justify-content: start;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
}
#search-wrapper{
  margin-right: 180px;
}
#tasks {
  margin-top: 1em;
}
.list-group {
  margin-bottom: 10px !important;
  box-sizing: border-box;
}
.list-group-item {
  display: flex;
  align-items: center;
}
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
  outline: none;
  border: none;
  padding: 10px;
  background-color: #eee;
  color: black;
  font-size: 18px;
  border-radius: 5px;
  box-shadow:  4px 3px 5px #555;
}
.scrool{
  height: calc(100vh - 230px);
  overflow-y: scroll;
  padding: 10px 10px;
  width: 600px;
  margin: 0 auto;
  margin-bottom: 10px;
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
.edit-task{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
