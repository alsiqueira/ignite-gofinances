import React, { useState,  } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect'
import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';

interface IFormData{
  name: string;
  amount: string;
}

const schema= Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
})

export function Register() {
  const [category, setCategory] =useState({
    key: 'category',
    name: 'Categoria',
  })
  const [ transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { 
    control,
    handleSubmit,
    formState: { errors}
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleRegister(form : IFormData){
    if(!transactionType){
      return Alert.alert('Selececione o tipo da transação')
    }
    
    if(category.key === 'category'){
      return Alert.alert('Selececione a categoria')
    }



    const data ={
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }
    console.log(data)
  }
  function handleTransactionTypeButtonSelect(type: 'up' | 'down'){
    setTransactionType(type)
  }
  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false)
  }
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true)
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Container>
            <Header>
              <Title>Cadastro</Title>
            </Header>
          <Form>
            <Fields>
              <InputForm
                  name="name"
                  control={control}
                  placeholder="Nome"
                  autoCapitalize="sentences"
                  autoCorrect={true}
                  error={errors.name && errors.name.message}

                />
                <InputForm
                  name="amount"
                  control={control}
                  placeholder="Preço"
                  keyboardType='numeric'
                  error={errors.amount && errors.amount.message}
                />
                <TransactionTypes>
                  <TransactionTypeButton 
                    type='up' 
                    title='Entrada'  
                    onPress={() => handleTransactionTypeButtonSelect('up')}
                    isActive={transactionType == 'up'}
                  />
                  <TransactionTypeButton 
                    
                    type='down' 
                    title='Saida' 
                    onPress={() => handleTransactionTypeButtonSelect('down')} 
                    isActive={transactionType == 'down'}
                  />
                </TransactionTypes>

                <CategorySelectButton title= {category.name} onPress={handleOpenSelectCategoryModal}/>
                </Fields>
                <Button 
                  title='Enviar' 
                  onPress={handleSubmit(handleRegister)}
                />
          </Form>
        <Modal visible={categoryModalOpen} >
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
          </Container>
    </TouchableWithoutFeedback> 
  );
}

