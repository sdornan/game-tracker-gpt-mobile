import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat'
import uuid from 'react-native-uuid'
import { useAuth } from '../components/AuthContext'
import { Game, useCollection } from '../components/CollectionContext'
import { searchForGame, sendChatMessage } from '../lib/api'
import { getGameImageUrl } from '../lib/utils'

const SYSTEM_USER: User = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://placeimg.com/140/140/any',
}

const ChatScreen = () => {
  const { user, logOut } = useAuth()
  const { mutation } = useCollection()
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello, ${user.given_name}!`,
        createdAt: new Date(),
        user: SYSTEM_USER,
      },
    ])
  }, [])

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))

    const lastMessage = messages[0]

    let chatResponse
    try {
      chatResponse = await sendChatMessage(lastMessage.text)
    } catch (error) {
      if (error?.status === 401) {
        logOut()
        return
      }
    }

    if (!chatResponse.game) {
      // No game found in Chatbot response
      return
    }

    const searchResponse = await searchForGame(chatResponse.game)

    const matchedGame: Game = searchResponse[0]

    matchedGame.rating = chatResponse.rating

    const actions = Array.isArray(chatResponse.action) ? chatResponse.action : [chatResponse.action]

    for (const action of actions) {
      if (action === 'add') {
        mutation.mutate(matchedGame)
      }

      //   if (action === 'remove') {
      //     dispatch({ type: 'REMOVE_GAME', payload: game })
      //   }
      //   if (action === 'rate') {
      //     dispatch({ type: 'RATE_GAME', payload: game })
      //   }
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: uuid.v4(),
          image: getGameImageUrl(matchedGame.cover.image_id),
          text: `${actions.join(', ')} ${matchedGame.name}`,
          user: SYSTEM_USER,
        },
      ])
    )
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: 1 }} />
    </View>
  )
}

export default ChatScreen
