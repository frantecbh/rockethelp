import { useState } from 'react'
import { VStack, Heading, Icon, useTheme, Text, Button as BotaoCadastrar } from "native-base";
import { Envelope, Key } from 'phosphor-react-native';



import { Alert } from 'react-native'


import Logo from '../../assets/logo_primary.svg'
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import auth from '@react-native-firebase/auth';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const { colors } = useTheme()

    function handleSignIn() {

        if (!email || !password) {
            return Alert.alert("Informe email e senha!")
        }

        setIsLoading(true)


        auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                // console.log(response)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Entrar', 'E-mail invalido!')
                }

                if (error.code === 'auth/wrong-password') {
                    return Alert.alert('Entrar', 'Email ou senha invalido!')
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Entrar', 'Email ou senha invalido!')
                }

                return Alert.alert('Entrar', 'Nao foi possível acessar!')




            })



    }


    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6} >
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                mb={8}
                placeholder="Senha"
                secureTextEntry
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                onChangeText={setPassword}
            />
            <Button
                mb={5}
                title="Entrar"
                w="full"
                isLoading={isLoading}
                onPress={handleSignIn} />
            <BotaoCadastrar
                bg="contrastThreshold"
                w="full"
                fontSize="sm"
                rounded="sm"
                h={14}
                _pressed={{
                    bg: "gray.200"
                }}
            >
                <Heading color="white" fontSize="sm">cadastre-se</Heading>
            </BotaoCadastrar>

        </VStack>

    )
}