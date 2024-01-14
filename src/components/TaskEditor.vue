<template>
  <div>
    <h2>Title</h2>
    <p>{{ task.dueDate }}</p>
    <hr>
    <textarea id="w3review" name="w3review" rows="4" cols="50" v-model="task.notes">schreib deine notizen</textarea>
    <hr>
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
        this.tasks = result
        console.log(this.task)
      } catch (error) {
        console.log('error', error)
      }
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
#w3review{
  resize: none;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: none;
  outline: none;
  background-color: #eee;
}

</style>
