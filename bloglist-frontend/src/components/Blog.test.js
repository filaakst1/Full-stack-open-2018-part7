import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'


describe('<Blog />', () => {
  const user = {
    name:'test-user'
  }
  const blog = {
    title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
    author: 'filaakst',
    likes: 10,
    url: 'test-url',
    user: user
  }
  let togglableComponent

  beforeEach(() => {
    const dummyButtonAction = () => {}
    const deleteVisible = true
    togglableComponent = shallow(<Blog blog={blog} likeButtonAction={dummyButtonAction} deleteButtonAction={dummyButtonAction} deleteButtonVisible={deleteVisible} />)

  })

  it('renders its children', () => {
    console.log(togglableComponent.debug())
    const titleDiv = togglableComponent.find('.blog-title')
    console.log(titleDiv.debug())
    expect(titleDiv.text()).toContain(`${blog.title} ${blog.author}`)
    // Find some child component
    const contentDiv = togglableComponent.find('.blog-adder')
    console.log(contentDiv.debug())
    expect(contentDiv.text()).toContain(`added by ${blog.user.name}`)

  })

  it('at start the children are not displayed', () => {
    const contentDiv = togglableComponent.find('.blog-content')
    expect(contentDiv.getElement().props.style).toEqual({ display: 'none' })
  })
  it('after clicking the button, children are displayed', () => {
    const titleDiv = togglableComponent.find('.blog-title')

    titleDiv.simulate('click')
    const contentDiv = togglableComponent.find('.blog-content')
    expect(contentDiv.getElement().props.style).toEqual({ display: '' })
  })

})