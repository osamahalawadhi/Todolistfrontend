<template>
  <div class="App-page">

    <h1 class="App-title">Todo App</h1>
    <main>
      <DynamicForm title="Welcome to your Vue.js App"/>
    </main>
  </div>
</template>

<script>
import DynamicForm from '../components/DynamicForm.vue'

export default {
  components: {
    DynamicForm
  }
}
</script>

<style scoped>
.App-title{
  font-size: 52px;
  font-weight: 800;
  color: white;
  text-shadow: 3px 3px 10px black;
}
</style>
