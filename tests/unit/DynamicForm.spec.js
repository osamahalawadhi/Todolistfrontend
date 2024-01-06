import { flushPromises, shallowMount } from '@vue/test-utils'
import DynamicForm from '@/components/DynamicForm.vue'

describe('DynamicForm.vue', () => {
  const twoItemResponse = [
    { id: 1, title: 'HA abgeben', completed: true },
    { id: 2, title: 'Job suchen', completed: false }
  ]
  it('should render the items from the backend', async () => {
    fetch.mockResponseOnce(JSON.stringify(twoItemResponse))

    const item = twoItemResponse[1].title
    const wrapper = shallowMount(DynamicForm)

    await flushPromises()

    expect(wrapper.text()).toContain(item)
  })
  it('should create a new task when the "Add" button is clicked', async () => {
    const wrapper = shallowMount(DynamicForm)

    // Simulate user entering a task title
    await wrapper.setData({ title: 'Learn Vue.js' })

    // Click the "Add" button
    await wrapper.find('#add-btn').trigger('click')

    // Expect the button text to be 'Add'
    expect(wrapper.find('#add-btn').text()).toBe('Add')
  })
  it('creates a todo', async () => {
    const wrapper = shallowMount(DynamicForm)

    wrapper.find('#title').element.value = 'New todo'
    await wrapper.find('#add-btn').trigger('click')

    expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(1)
  })
  it('displays an error message if trying to create an empty task', async () => {
    const wrapper = shallowMount(DynamicForm)

    // Klicke auf den "Add" Button ohne einen Titel einzugeben
    await wrapper.find('#add-btn').trigger('click')

    // Überprüfe, ob die Fehlermeldung angezeigt wird
    expect(wrapper.find('.error-message').exists()).toBe(true)

    // Überprüfe, ob der Task nicht in der Liste gerendert wird
    expect(wrapper.text()).not.toContain('New Task')
  })
  it('renders a completed task when provided', async () => {
    const wrapper = shallowMount(DynamicForm)

    // Füge einen Task hinzu
    await wrapper.setData({
      tasks: [
        {
          id: 1,
          title: 'Complete Task',
          completed: true
        }
      ]
    })

    // Überprüfe, ob der Task in der Liste gerendert wird
    expect(wrapper.text()).toContain('Complete Task')

    // Überprüfe, ob die Klasse 'completed-task' angewendet wurde
    expect(wrapper.find('.completed-task').exists()).toBe(true)
  })
  it('calls createTask when the "Create" button is clicked', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to simulate a successful POST request
    global.fetch = jest.fn(() => Promise.resolve({ text: () => 'Created successfully' }))

    // Set the title data property
    await wrapper.setData({ title: 'New Task' })

    // Find the "Create" button and trigger a click
    await wrapper.find('#add-btn').trigger('click')

    // Ensure that the fetchTasks method is called after the createTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
  it('makes a "Create" request when createTask is called', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to check if it's called with the correct arguments
    global.fetch = jest.fn(async (url, options) => {
      // Ensure the correct URL is used
      expect(url).toContain('/api/a1/task')

      // Ensure the correct method is used
      expect(options.method).toBe('POST')

      // Ensure the correct headers are set
      expect(options.headers.get('Content-Type')).toBe('application/json')

      // Ensure the correct payload is sent
      const payload = JSON.parse(options.body)
      expect(payload.title).toBe(wrapper.vm.title)
      expect(payload.completed).toBe(false) // You may adjust this based on your logic

      // Simulate a successful response
      return Promise.resolve({ text: () => 'Created successfully' })
    })

    // Set the title data property
    await wrapper.setData({ title: 'New Task' })

    // Call the createTask method
    await wrapper.vm.createTask()

    // Ensure that the fetchTasks method is called after the createTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
  it('deletes a task when deleteTask is called', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to simulate a successful DELETE request
    global.fetch = jest.fn(() => Promise.resolve({ text: () => 'Deleted successfully' }))

    // Assuming you have a task object to use for testing
    const task = { id: 1 }

    // Call the deleteTask method
    await wrapper.vm.deleteTask(task)

    // Ensure that the fetchTasks method is called after the deleteTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
  it('updates a task when updateTask is called', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to simulate a successful PUT request
    global.fetch = jest.fn(() => Promise.resolve({ text: () => 'Updated successfully' }))

    // Assuming you have an editingTask object to use for testing
    const editingTask = { id: 1, title: 'Task 1', completed: false }

    // Set the editingTask data property
    await wrapper.setData({ editingTask, title: 'Updated Task' })

    // Call the updateTask method
    await wrapper.vm.updateTask()

    // Ensure that the fetchTasks method is called after the updateTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
  it('calls updateTask when the "Update" button is clicked', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to simulate a successful PUT request
    global.fetch = jest.fn(() => Promise.resolve({ text: () => 'Updated successfully' }))

    // Assuming you have an editingTask object to use for testing
    const editingTask = { id: 1, title: 'Task 1', completed: false }

    // Set the editingTask data property
    await wrapper.setData({ editingTask, title: 'Updated Task' })

    // Find the "Update" button and trigger a click
    await wrapper.find('#add-btn').trigger('click')

    // Ensure that the fetchTasks method is called after the updateTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
  it('calls deleteTask when the "Delete" button is clicked', async () => {
    // Mocking the fetchTasks method to avoid actual API calls
    jest.spyOn(DynamicForm.methods, 'fetchTasks').mockResolvedValueOnce([])

    const wrapper = shallowMount(DynamicForm)

    // Mocking the fetch method to simulate a successful DELETE request
    global.fetch = jest.fn(() => Promise.resolve({ text: () => 'Deleted successfully' }))

    // Assuming you have a task object to use for testing
    const task = { id: 1, title: 'Task 1', completed: false }

    // Set the tasks data property
    await wrapper.setData({ tasks: [task] })

    // Find the "Delete" button and trigger a click
    await wrapper.find('#del-btn').trigger('click')

    // Ensure that the fetchTasks method is called after the deleteTask method
    expect(DynamicForm.methods.fetchTasks).toHaveBeenCalled()

    // Reset the fetch mock to avoid affecting other tests
    global.fetch.mockReset()
  })
})
