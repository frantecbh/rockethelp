import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base';
import sizes from 'native-base/lib/typescript/theme/base/sizes';
import { CaretLeft } from 'phosphor-react-native';

type Props = StyledProps & {
    title: string
}

export function Header({ title, ...rest }: Props) {

    const navigation = useNavigation()
    const { colors } = useTheme()



    return (
        <HStack w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pb={6}
            pt={12}
        >
            <IconButton
                icon={<CaretLeft color={colors.gray[200]} size={24} />}
                onPress={() => { navigation.goBack() }}
            />

            <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} marginLeft={-6}>
                {title}
            </Heading>

        </HStack>
    );
}