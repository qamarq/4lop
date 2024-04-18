import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = ({
    username = 'newuser',
    url = 'ACME',
}: WelcomeEmailProps) => {
    const previewText = `Welcome to 4lop, ${username}!`;

    return (
        <Html lang="pl">
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Section className="mt-8">
                            <Img
                                src={
                                    `${process.env.NEXTAUTH_URL}/_next/static/media/4lop.00de251c.svg`
                                }
                                width="80"
                                height="80"
                                alt="Logo Example"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
                            Welcome to <strong>4lop</strong>, {username}!
                        </Heading>
                        <Text className="text-sm">Hello {username},</Text>
                        <Text className="text-sm">
                            We&apos;re excited to have you onboard at{' '}
                            <strong>4lop</strong>. We hope you enjoy your
                            journey with us. To verify your account, please
                            click button below.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#fb9433] rounded text-white text-md flex items-center justify-center font-semibold no-underline text-center w-[200px] h-[50px]"
                                href={url}>
                                Verify account
                            </Button>
                        </Section>
                        <Text className="text-sm">
                            Cheers,
                            <br />
                            The 4lop Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

interface WelcomeEmailProps {
    username?: string;
    url?: string;
}
