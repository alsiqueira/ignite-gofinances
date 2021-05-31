import React from 'react'
import { Container, Category, Icon, } from './styles'

interface IProps{
  title: string
  onPress: ()=> void;
}
export function CategorySelectButton({ title, onPress }: IProps){
  return(
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  )
}