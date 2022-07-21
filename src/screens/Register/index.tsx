
import { VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';

import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';

export function Register() {

    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false)
    const [patrimony, setPatrimony] = useState('')
    const [description, setDescription] = useState('')

    function handleNewOrderRegister() {
        if (!patrimony || !description) {
            return Alert.alert('Registar', 'Preencha todos os campos!')

        }

        setIsLoading(true)

        firestore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Solicitação", "Solicitação registrada com sucesso!")
                navigation.goBack()
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false)
                return Alert.alert('Solicitação', "Solicitação não pode ser registrada!")
            })


    }





    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title='Solicitação' />
            <Input
                mt={4}
                placeholder="Número do patrimônio"
                onChangeText={setPatrimony}
            />
            <Input
                placeholder='Descrição do problema'
                mt={5}
                flex={1}
                multiline
                textAlignVertical='top'
                onChangeText={setDescription}
            />
            <Button
                title='Cadastrar'
                mt={5}
                isLoading={isLoading}
                onPress={handleNewOrderRegister} />

        </VStack>
    );
}