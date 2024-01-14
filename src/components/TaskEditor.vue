<template>
  <div>
    <div class="task-header">
      <input type="checkbox" @click="updateTaskStatus()" v-model="task.completed" />
      <input v-if="!task.completed" type="text" class="task-title" v-model="task.title">
      <input v-else type="text" class="task-title-completed" v-model="task.title">
      <hr />
    </div>
    <hr />
    <div class="calender">
      <h6>add due Date</h6>
      <input type="date" id="start" name="trip-start" v-model="task.dueDate" min="2018-01-01" max="2025-12-31" />
    </div>
    <hr />
    <div class="selector">
      <h6>Set priority</h6>
      <select class="form-select select-priority"  v-model="task.priority" aria-label="Default select example">
        <option value="LOW" selected>Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>
    <hr />
    <textarea
      id="w3review"
      name="w3review"
      rows="4"
      cols="50"
      v-model="task.notes"
      placeholder="schreib deine notizen"
    >
schreib deine notizen</textarea
    >
    <hr />
    <div class="task-footer">
      <button @click="updateTask()">Update Task</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      task: {}
    }
  },
  methods: {
    async fetchTasks () {
      try {
        const endpoint =
          process.env.VUE_APP_BACKEND_BASE_URL + '/api/a1/task/' + this.id
        const response = await fetch(endpoint)
        const result = await response.json()
        this.task = result
        console.log(this.task)
        this.changeDateFormat()
      } catch (error) {
        console.log('error', error)
      }
    },
    async updateTask () {
      try {
        const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${this.task.id}`
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const payload = JSON.stringify({
          title: this.task.title,
          completed: this.task.completed,
          dueDate: this.task.dueDate,
          priority: this.task.priority,
          notes: this.task.notes
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
        await this.$emit('updateFetch')
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    async updateTaskStatus () {
      try {
        const endpoint = `${process.env.VUE_APP_BACKEND_BASE_URL}/api/a1/task/${this.task.id}`
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')

        const payload = JSON.stringify({
          title: this.task.title,
          completed: !this.task.completed
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
        this.$emit('updateFetch')
      } catch (error) {
        console.error('Error updating task status:', error)
      }
    },
    changeDateFormat () {
      if (!this.task.dueDate) return '2018-12-31'
      const date = new Date(this.task.dueDate)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // Add leading zero if needed
      const day = date.getDate().toString().padStart(2, '0') // Add leading zero if needed

      this.task.dueDate = `${year}-${month}-${day}`
    }
  },
  watch: {
    id: {
      async handler () {
        await this.fetchTasks()
      }
    }
  }
}
</script>

<style scoped>
#w3review {
  resize: none;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: none;
  outline: none;
  background-color: #eee;
}
.task-title {
  font-size: 20px;
  background-color: transparent;
  border: none;
  outline: none;
  margin-bottom: 10px;
  width: 100%;
}
.task-title-completed{
  font-size: 20px;
  background-color: transparent;
  border: none;
  outline: none;
  margin-bottom: 10px;
  width: 100%;
  text-decoration: line-through;
}
.task-header{
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: start;
}
.task-footer{
  display: flex;
  align-items: start;
  justify-content: flex-end;
}
.task-footer button{
  padding: 5px 10px;
  background-color: #0fa2b8;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  box-shadow: 2px 2px 5px #ccc;
}
.calender{
  display: flex;
  align-items: center;
  gap: 10px;
}
.selector{
  display: flex;
  align-items: center;
  gap: 15px;
}
.select-priority {
  width:50%;
}
</style>
