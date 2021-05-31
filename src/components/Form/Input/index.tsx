import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

type IProps = TextInputProps
export function Input({...rest}: IProps){
  return <Container {...rest}/>;
}

