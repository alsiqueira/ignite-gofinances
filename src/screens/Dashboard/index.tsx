import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native'
import { HighlightCard } from '../../components/HighlightCard';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from 'styled-components'

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
  LoadContainer,
} from './styles';

export interface IDataListProps extends ITransactionCardProps{
  id: string;
}
interface IHighlightProps{
  amount: string;
  lastTransaction: string;
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
  const [isLoading, setIsLoading] = useState(true)

  const theme = useTheme()

  function getLastTransactionDate(
    collection:IDataListProps[], 
    type: 'positive' | 'negative' 
    ){

    const lastTransaction = new Date(
    Math.max.apply(Math,collection
    .filter(transaction => transaction.transactionType === type)
    .map(transaction => new Date(transaction.date).getTime() )))
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{
      month: 'long'
    })} `
  }

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

    const  lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const  lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionEntries}`

    

    const total = entriesTotal - expensiveTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
            }),
          lastTransaction:  `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: `Última saída dia ${lastTransactionExpensives}`
      },
      total:{
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval

      }
    });
    setIsLoading(false)
    console.log(transactionsFormatted);

  }

  useEffect(() =>{
     loadTransactions()
  },[])

  useFocusEffect(useCallback(() =>{
    loadTransactions()
  },[]))
  return (
    <Container>
      
      {
        isLoading ? <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size='large'
            />
          
          </LoadContainer> :
        <>
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
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saidas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
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
      </>
    }
    </Container>
  );
}
