import {
    Html,
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text
} from '@react-email/components';

interface verificationEmailProps {
    username: string,
    otp: string,
}

export default function VerificationEmail({username, otp}: verificationEmailProps) {
    return (
        <Html>
            <Head>
                <title>Verification Code</title>    
            </Head>
            <Preview>Here's your verification code: {otp.toString()}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello, {username}</Heading>
                </Row>
                <Row>
                    <Text>Thank you for registering. Please use the following verification code to complete your registration:</Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
            </Section>
        </Html>
    )
}

