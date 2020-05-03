import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native'

import { ChevronButton } from '../../components/'

import {
  AppContainer,
  FollowContainer,
  FollowImage,
  FollowInfo,
  TextBold,
} from './styles'

function FollowingBox({ user, navigation }) {

  async function handleSelect(){
    let followingUser = await fetch(`${user.url}`)
    followingUser = await followingUser.json()
    navigation.push('Profile', followingUser)
  }

  return (
    <FollowContainer>
      <FollowInfo>
        <FollowImage source={{ uri: user.avatar_url }}/>
        <TextBold>{ user.login }</TextBold>
      </FollowInfo>
      <ChevronButton onPress={() => handleSelect()}/>
    </FollowContainer>
  )
}

export default function Following(props) {
  const { route: { params: user } , navigation } = props

  const [following, setFollowing] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function _getData(){
      setIsLoading(true)
      await getData()
      setIsLoading(false)
    }
    _getData()
  }, [])
  
  async function getData() {
    setRefreshing(true)
    let _following = await fetch(`https://api.github.com/users/${user.login}/following?page=${page}`)
    _following = await _following.json()
    setFollowing(following.concat(_following))
    setPage(page + 1)
    setRefreshing(false)
  }

  return (
    <AppContainer>
      { isLoading ? <ActivityIndicator size="large" color="black"/> 
        : <FlatList showsVerticalScrollIndicator={false}
            data={following}
            renderItem={ following => <FollowingBox user={following.item} navigation={navigation}/>}
            keyExtractor={ following => String(following.id) }  
            refreshing={refreshing}
            onEndReached={getData}
            onEndReachedThreshold={1}
          />
      }
    </AppContainer>
  );
}
