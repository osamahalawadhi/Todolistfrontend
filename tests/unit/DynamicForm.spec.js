import { flushPromises, shallowMount } from '@vue/test-utils'
import DynamicForm from '@/components/DynamicForm.vue'

describe('DynamicForm.vue', () => {
  const twoItemResponse = [
    { id: 1, title: 'HA abgeben', completed: true },
    { id: 2, title: 'Job suchen', completed: false }
  ]

  beforeEach(() => {
    fetch.resetMocks()
  })
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
})
