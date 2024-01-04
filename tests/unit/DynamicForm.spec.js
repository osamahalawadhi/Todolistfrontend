import { flushPromises, shallowMount } from '@vue/test-utils'
import DynamicForm from '@/components/DynamicForm.vue'

describe('DynamicForm.vue', () => {
  const emptyResponse = []
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
})
