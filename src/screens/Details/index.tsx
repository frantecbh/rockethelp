import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore'



import { Header } from '../../components/Header';
import { OrderProps } from '../../components/Order';
import { OrderFirestoreDTO } from '../../DTOs/OrderDTO';
import { dateFormat } from '../../../android/app/src/utils/FireStoreDate';
import Loading from '../../components/Loading';
import { CircleWavyCheck, Clipboard, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { CardDetails } from '../../components/CardDetails';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string
}

export function Details() {


    const { colors } = useTheme()

    const [isLoading, setIsloading] = useState(true)
    const [solution, setSolution] = useState('')
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

    const navitation = useNavigation()
    const route = useRoute()
    const { orderId } = route.params as RouteParams;

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert("Solicitação", "Informe a solução para encerrar este chamado!")
        }

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Solicitação", "Solicitação encerrada com sucesso!")
                navitation.goBack()
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Solicitação', "Nao foi possivel encerrar a solicitação!")
            })
    }

    useEffect(() => {

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const { patrimony, description, status, created_at, closed_at, solution } = doc.data()

                const closed = closed_at ? dateFormat(closed_at) : null

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(created_at),
                    closed

                })


                setIsloading(false)
            })

    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Solicitação" />
            </Box>


            <HStack bg="gray.500" p={4} justifyContent="center">
                {
                    order.status === 'closed' ? <CircleWavyCheck size={22} color={colors.green[300]} /> :
                        <Hourglass size={22} color={colors.secondary[700]} />
                }
                <Text fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento!'}
                </Text>


            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails title="Equipamento"
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}

                />
                <CardDetails title="descrição do problema"
                    description={`Patrimônio ${order.description}`}
                    icon={ClipboardText}
                    footer={`Rregistrado em ${order.when}`}

                />
                <CardDetails title="Solução"
                    description={order.solution}
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}

                >
                    {order.status === 'open' &&
                        <Input placeholder='Descreva a solução'
                            onChangeText={setSolution}
                            h={24}
                            textAlignVertical="top"
                            multiline
                        />
                    }
                </CardDetails>

            </ScrollView>
            {
                order.status === 'open' && <Button title='Encerrar Solicitação' m={5} onPress={handleOrderClose} />
            }
        </VStack>
    );
}