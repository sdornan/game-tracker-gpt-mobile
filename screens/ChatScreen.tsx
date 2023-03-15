import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat'
import uuid from 'react-native-uuid'
import { useAuth } from '../components/AuthContext'
import { Game, useCollection } from '../components/CollectionContext'
import { searchForGame, sendChatMessage } from '../lib/api'
import { capitalize, getGameImageUrl } from '../lib/utils'

type Action = 'add_and_rate' | 'add' | 'remove' | 'rate'

type ActionMap = {
  [k in Action]: string
}

const pastTenseActions: ActionMap = {
  add_and_rate: 'added and rated',
  add: 'added',
  remove: 'removed',
  rate: 'rated',
}

const human: User = {
  _id: 1,
  name: 'Developer',
}

const bot: User = {
  _id: 2,
  name: 'React Native',
  avatar: require('./../assets/bot-avatar.png'),
}

const ChatScreen = () => {
  const { user, logOut } = useAuth()
  const { games, mutation } = useCollection()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game>(null)

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello, ${user.given_name}!`,
        createdAt: new Date(),
        user: bot,
      },
    ])
  }, [])

  const onQuickReply = (replies = []) => {
    const replyMessages = replies.map((reply) => ({
      _id: uuid.v4() as string,
      text: reply.title,
      user: human,
      createdAt: new Date(),
    }))

    setMessages((previousMessages) => GiftedChat.append(previousMessages, replyMessages))

    if (replies[0].value === 'yes') {
      mutation.mutate(currentGame)
      onCollectionAction('add_and_rate', currentGame)
    }
  }

  const onSend = async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))

    setIsTyping(true)

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

    const matchedGame: Game = { ...searchResponse[0], rating: chatResponse.rating }

    setCurrentGame(matchedGame)

    switch (chatResponse.action) {
      case 'add':
      case 'add_and_rate':
        mutation.mutate(matchedGame)
        break
      case 'remove':
        break
      case 'rate':
        const game = games.find((g) => g.id === matchedGame.id)
        if (game) {
          // Game already in collection
          mutation.mutate(matchedGame)
        } else {
          // Game not in collection
          onRateWithNewGame(matchedGame)
          return
        }
    }

    onCollectionAction(chatResponse.action, matchedGame)
  }

  const onRateWithNewGame = (newGame: Game) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: uuid.v4() as string,
          text: `${newGame.name} is not in your collection. Would you like to add it first?`,
          user: bot,
          createdAt: new Date(),
          quickReplies: {
            type: 'radio',
            keepIt: false,
            values: [
              {
                title: 'Yes',
                value: 'yes',
              },
              {
                title: 'No',
                value: 'no',
              },
            ],
          },
        },
      ])
    )

    setIsTyping(false)
  }

  const onCollectionAction = (action: Action, game: Game) => {
    setIsTyping(false)

    let text = `${capitalize(pastTenseActions[action])} ${game.name}`

    if (game.rating) {
      text += ` with a rating of ${game.rating}`
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: uuid.v4() as string,
          image: getGameImageUrl(game?.cover?.image_id) || null,
          text,
          user: bot,
          createdAt: new Date(),
        },
      ])
    )

    setCurrentGame(null)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        onQuickReply={onQuickReply}
        user={human}
        isTyping={isTyping}
      />
    </View>
  )
}

export default ChatScreen
