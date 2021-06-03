import React, { useEffect, useState, useCallback } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect } from '@react-navigation/native'

import { TransactionCard, ITransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles';

export interface IDataListProps extends ITransactionCardProps{
  id: string;
}



export function Dashboard() {
  const dataKey = '@gofinances:transactions'
  const [data, setData] = useState<IDataListProps[]>()

  async function loadTransactions(){
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    const transactionsFormatted: IDataListProps[] = transactions.map((item: IDataListProps) => {
    const amount =  Number(item.amount)
    .toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    const date = Intl.DateTimeFormat('pt-BR',{
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(item.date));

    return {
      id: item.id,
      name: item.name,
      amount,
      transactionType: item.transactionType,
      category: item.category,
      date,

    }

    })
    setData(transactionsFormatted)

  }

  useEffect(() =>{
     loadTransactions()
  },[])

  useFocusEffect(useCallback(() =>{
    loadTransactions()
  },[]))
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: 'https://avatars.githubusercontent.com/u/57800679?v=4',
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Alexandre</UserName>
            </User>
          </UserInfo>
         <LogoutButton onPress={()=>{}}>
          <Icon name="power" />
        </LogoutButton> 
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saidas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Linstagem</Title>

        <TransactionList 
         data={data}
         keyExtractor={item => item.id}
         renderItem={({item}) => <TransactionCard  data={item} />}
        />

      </Transactions>
    </Container>
  );
}
