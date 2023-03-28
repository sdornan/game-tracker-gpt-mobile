import { randomUUID } from 'expo-crypto'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat'
import { useAuth } from '../components/AuthContext'
import { useCollection } from '../components/CollectionContext'
import { ChatGPTResponse, CollectionAction, Game } from '../interfaces'
import { searchForGame, sendChatMessage } from '../lib/api'
import { capitalize, getGameImageUrl } from '../lib/utils'

const pastTenseCollectionActions: Record<CollectionAction, string> = {
  add: 'added',
  remove: 'removed',
  update: 'updated',
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
  const { games, addMutation, removeMutation, updateMutation } = useCollection()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game>(null)

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: user ? `Hello, ${user.given_name}!` : 'Hello!',
        createdAt: new Date(),
        user: bot,
      },
    ])
  }, [])

  const onQuickReply = (replies = []) => {
    const replyMessages = replies.map((reply) => ({
      _id: randomUUID(),
      text: reply.title,
      user: human,
      createdAt: new Date(),
    }))

    setMessages((previousMessages) => GiftedChat.append(previousMessages, replyMessages))

    if (replies[0].value === 'yes') {
      addMutation.mutate(currentGame)
      respondAfterCollectionAction('add', currentGame)
    }
  }

  const onSend = async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))

    setIsTyping(true)

    const lastMessage = messages[0]

    let chatResponse: ChatGPTResponse
    try {
      chatResponse = await sendChatMessage(lastMessage.text)
    } catch (error) {
      if (error?.status === 401) {
        logOut()
        return
      }
    }

    console.log(chatResponse)

    if (!chatResponse.game) {
      // No game found in Chatbot response
      return
    }

    switch (chatResponse.category) {
      case 'collection':
        handleCollectionAction(chatResponse)
      case 'query':
        handleQuery(chatResponse)
        break
    }
  }

  const handleCollectionAction = async (chatResponse: ChatGPTResponse) => {
    const searchResponse = await searchForGame(chatResponse.game)

    const matchedGame: Game = searchResponse?.[0]

    if (!matchedGame) {
      // No game found in search
      return
    }

    if (chatResponse.rating) {
      matchedGame.rating = chatResponse.rating
    }

    if (chatResponse.status) {
      matchedGame.status = chatResponse.status
    }

    setCurrentGame(matchedGame)

    switch (chatResponse.action) {
      case 'add':
        addMutation.mutate(matchedGame)
        break
      case 'remove':
        removeMutation.mutate(matchedGame)
        break
      case 'update':
        const game = games.find((g) => g.id === matchedGame.id)
        if (game) {
          // Game already in collection
          updateMutation.mutate(matchedGame)
        } else {
          // Game not in collection
          handleUpdateWithNewGame(matchedGame)
          return
        }
        break
    }

    respondAfterCollectionAction(chatResponse.action, matchedGame)
  }

  const handleQuery = async (chatResponse: ChatGPTResponse) => {
    console.log(chatResponse)

    // const searchResponse = await searchForGame(chatResponse.game, chatResponse.query)

    // console.log(searchResponse)
  }

  const handleUpdateWithNewGame = (newGame: Game) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: randomUUID(),
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

  const respondAfterCollectionAction = (action: CollectionAction, game: Game) => {
    setIsTyping(false)

    let text = `${capitalize(pastTenseCollectionActions[action])} ${game.name}`

    if (game.status) {
      text += ` with a status of ${capitalize(game.status)}`
    }

    if (game.rating) {
      text += `${game.status ? ' and' : ''} with a rating of ${game.rating}/10`
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: randomUUID(),
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
