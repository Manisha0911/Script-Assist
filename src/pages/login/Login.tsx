import { Title, Paper, Stack, TextInput, PasswordInput, Button } from '@mantine/core';
import { Text as MantineText } from '@mantine/core';
import { useForm } from "react-hook-form";
import { LoginValidationSchema } from '../../validations/validations';
import { useAppStore } from '../../store/app.store';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import logo from "../../images/logo.png";

type LoginFormValues = z.infer<typeof LoginValidationSchema>;
const Login = () => {
    const login = useAppStore((state) => state.login);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginValidationSchema),
    });

    const DUMMY_USER = {
        email: "test@example.com",
        password: "Test@1234",
      };

      const onSubmit = (values: LoginFormValues) => {
        if (
          values.email === DUMMY_USER.email &&
          values.password === DUMMY_USER.password
        ) {
          login(values.email);
          navigate("/dashboard");
        } else {
          alert("Invalid email or password");
        }
      };

    return (
        <div className="login-container">
            <div className="login-card">
                <Title order={2} className="login-title">
                   <img src={logo} alt="Logo" />
                </Title>
                <MantineText size="sm" className="login-subtitle">
                    Please login to your account
                </MantineText>

                <Paper withBorder p="md" radius="md">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <TextInput label="Email" placeholder="you@example.com" required
                                {...register("email")}
                                error={errors.email?.message}
                                styles={inputStyles}
                            />
                            <PasswordInput label="Password" placeholder="Your password" required
                                {...register("password")}
                                error={errors.password?.message}
                                styles={inputStyles}
                            />
                        </Stack>
                        <Button fullWidth mt="xl" className="login-button" type="submit">
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );
}
export default Login

const inputStyles = {
    input: {
        borderRadius: '15px',
        backgroundColor: '#fff',
    },
    label: {
        color: '#212529',
    },
    
};
