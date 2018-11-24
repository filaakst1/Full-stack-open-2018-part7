import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'


describe.only('<SimpleBlog />', () => {
  it('renders simple blog', () => {
    const blog = {
      title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      author: 'filaakst',
      likes: 10
    }
    const onClick = () => {}

    const simpleBlogComponent = shallow(<SimpleBlog blog={blog} onClick={onClick} />)
    console.log(simpleBlogComponent.debug())

    const titleDiv = simpleBlogComponent.find('.title')
    console.log(titleDiv.debug())
    expect(titleDiv.text()).toContain(`${blog.title} ${blog.author}`)

    const likeDiv = simpleBlogComponent.find('.likes')
    console.log(likeDiv.debug())

    expect(likeDiv.text()).toContain(`blog has ${blog.likes} likes`)

  })

  it('blog like button click', () => {
    const blog = {
      title: 'Komponenttitestaus tapahtuu jestillä ja enzymellä',
      author: 'filaakst',
      likes: 10
    }
    const onClickMock = jest.fn()
    const simpleBlogComponent = shallow(<SimpleBlog blog={blog} onClick={onClickMock} />)
    const button = simpleBlogComponent.find('button')
    const amountOfClicks = 2
    let i
    for (i = 0; i < amountOfClicks; i++) {
      button.simulate('click')
    }
    expect(onClickMock.mock.calls.length).toBe(amountOfClicks)
  })

})