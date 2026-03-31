import { Col, Form, Row, Typography, Input, Button } from "antd"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/Auth"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/config/firebase"
const { Title, Paragraph } = Typography

const initialState = { email: "" }

const ForgetPassword = () => {

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setState(state => ({ ...state, [e.target.name]: e.target.value }))

  const handleForgetPassword = () => {
    let { email } = state
    
    setIsProcessing(true)

    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.toastify("Password reset email sent! Please check your inbox.", "success")
        navigate("/auth/login")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.toastify("Failed to send password reset email. Please try again.", "error")
        console.error("Error Code:", errorCode, "Error Message:", errorMessage, error);
        // ..
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
            Forget Password
          </Title>
          <Paragraph className="text-center">Remember your password? <Link to="/auth/login">Login</Link></Paragraph>
          <Form layout='vertical'>
            <Row>
              <Col span={24}>
                <Form.Item label="Email" required>
                  <Input size='large' type="email" placeholder="Enter Your Email" name='email' onChange={handleChange} />
                </Form.Item>
              </Col>
              <Col span={24} >
                <Button type="primary" size='large' block htmlType='submit' loading={isProcessing} onClick={handleForgetPassword}>
                  Forget Password
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default ForgetPassword