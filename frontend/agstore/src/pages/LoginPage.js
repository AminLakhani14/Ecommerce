import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { FaGoogle } from 'react-icons/fa';
import styles from './styles/Auth.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const { search } = useLocation();
    const redirect = new URLSearchParams(search).get('redirect') || '/';

    useEffect(() => {
        if (userInfo) navigate(redirect);
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) { alert(err?.data?.message || err.error); }
    };

    const googleAuthHandler = () => {
        window.location.href = `/api/users/auth/google`;
    };

    return (
        <div className={styles.authContainer}>
            <Card className={styles.authCard}>
                <Card.Body>
                    <h1 className="text-center mb-4">Sign In</h1>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-3" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button disabled={isLoading} type='submit' variant='dark' className="w-100">Sign In</Button>
                        {isLoading && <Loader />}
                    </Form>

                    <div className={styles.divider}><span>OR</span></div>
                    
                    <Button variant="outline-danger" className="w-100 mb-2" onClick={googleAuthHandler}>
                        <FaGoogle /> Continue with Google
                    </Button>
                    
                    <Row className='py-3'>
                        <Col className="text-center">
                            New Customer?{' '}<Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};
export default LoginPage;