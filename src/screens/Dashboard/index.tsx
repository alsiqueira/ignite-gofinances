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
interface IHighlightProps{
  amount: string;
}
interface IHighlightData {
  entries: IHighlightProps;
  expensives: IHighlightProps;
  total: IHighlightProps;
}


export function Dashboard() {
  const dataKey = '@gofinances:transactions'
  const [transactions, setTransactions] = useState<IDataListProps[]>([])
  const [highlightData, setHighlightData] = useState<IHighlightData>({} as IHighlightData )

  async function loadTransactions(){
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0;
    let expensiveTotal = 0

    const transactionsFormatted: IDataListProps[] = transactions.map((item: IDataListProps) => {
      if(item.transactionType === 'positive'){
        entriesTotal += Number(item.amount)
      }else {
        expensiveTotal += Number(item.amount)
      } 
    
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
    setTransactions(transactionsFormatted)

    const total = entriesTotal - expensiveTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
            })
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
      },
      total:{
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

      }
    })

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
          amount={highlightData.entries.amount}
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saidas"
          amount={highlightData.expensives.amount}
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount={highlightData.total.amount}
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Linstagem</Title>

        <TransactionList 
         data={transactions}
         keyExtractor={item => item.id}
         renderItem={({item}) => <TransactionCard  data={item} />}
        />

      </Transactions>
    </Container>
  );
}
