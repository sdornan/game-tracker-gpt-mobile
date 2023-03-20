import renderer from 'react-test-renderer'

import ChatScreen from './ChatScreen'

describe('ChatScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ChatScreen />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
