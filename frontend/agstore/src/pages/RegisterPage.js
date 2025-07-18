import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import styles from './styles/Auth.module.css'; // Reusing the login style

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);
    
    const { search } = useLocation();
    const redirect = new URLSearchParams(search).get('redirect') || '/';
    
    useEffect(() => {
        if (userInfo) navigate(redirect);
    }, [navigate, redirect, userInfo]);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };
    
    return (
        <div className={styles.authContainer}>
            <Card className={styles.authCard}>
                <Card.Body>
                    <h1 className="text-center mb-4">Sign Up</h1>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="my-3" controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="my-3" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="my-3" controlId='confirmPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </Form.Group>
                        
                        <Button disabled={isLoading} type='submit' variant='dark' className="w-100">Register</Button>
                        {isLoading && <Loader />}
                    </Form>
                    <Row className='py-3'>
                        <Col className="text-center">
                            Already have an account?{' '}<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};
export default RegisterPage;