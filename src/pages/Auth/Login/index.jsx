import { Col, Form, Row, Typography, Input, Button } from "antd"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/Auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/config/firebase"
const { Title, Paragraph } = Typography

const initialState = { email: "", password: "" }

const Login = () => {

  const { dispatch } = useAuth()
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setState(state => ({ ...state, [e.target.name]: e.target.value }))

  const handleLogin = () => {
    let { email, password } = state
    if (!window.isValidEmail(email)) {
      return window.toastify("Please enter a valid email address", "error")
    }
    if (password.length < 6) {
      return window.toastify("Password must be at least 6 characters", "error")
    }

    setIsProcessing(true)

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ isAuth: true, user })
        navigate("/")
        window.toastify("Login successful!", "success")
        console.log("Logged in User:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential"){
          window.toastify("Invalid Email or Password", "error")
        }else{
          window.toastify("Login failed. Please try again.", "error")          
        }
        console.error(error)
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }

  return (
    <main className="auth">
      <div className="container">
        <div className="card p-3">

          <Title level={1} className="text-center mb-4">
            Login
          </Title>
          <Paragraph className="text-center">Don't have an account? <Link to="/auth/register">Create Account</Link></Paragraph>
          <Form layout='vertical'>
            <Row>
              <Col span={24}>
                <Form.Item label="Email" required>
                  <Input size='large' type="email" placeholder="Enter Your Email" name='email' onChange={handleChange} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Password" required>
                  <Input.Password size="large" placeholder="Enter Your Password" name='password' onChange={handleChange} />
                </Form.Item>
                <Paragraph> <Link to="/auth/forgot-password">Forgot Password?</Link></Paragraph>
              </Col>
              <Col span={24} >
                <Button type="primary" size='large' block htmlType='submit' loading={isProcessing} onClick={handleLogin}>
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default Login