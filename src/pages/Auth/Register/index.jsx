import { auth, firestore } from "@/config/firebase"
import { Col, Form, Row, Typography, Input, Button } from "antd"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { isValidElement, useState } from "react"
import { Link } from "react-router-dom"
const { Title, Paragraph } = Typography

const initialState = { fullName: "", email: "", password: "", confirmPassword: "" }

const Register = () => {

  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(state => ({ ...state, [e.target.name]: e.target.value }))

  const handleRegister = () => {
    let { fullName, email, password, confirmPassword } = state
    fullName = fullName.trim()
    if (fullName.length < 3) {
      return window.toastify("Full Name must be at least 3 characters", "error")
    }
    if (!window.isValidEmail(email)) {
      return window.toastify("Please enter a valid email address", "error")
    }
    if (password.length < 6) {
      return window.toastify("Password must be at least 6 characters", "error")
    }
    if (password !== confirmPassword) {
      return window.toastify("Passwords do not match", "error")
    }

    const userData = { fullName, email, status: "active", role: "user" }

    setIsProcessing(true)

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        window.toastify("Registration successful! You can now login.", "success")
        console.log("Registered User:", user);
        userData.uid = user.uid
        createUserProfile(userData)
      })
      .catch((error) => {
        const errorCode = error.code;
        setIsProcessing(false)
        if (errorCode === 'auth/email-already-in-use') {
          window.toastify("This email is already in use.", "error")
        } else {
          window.toastify("Registration failed. Please try again.", "error")
        }
        console.error(error);
      })      
  }

  const createUserProfile = async (userData) => {
     const user = {...userData}
      user.createdAt = serverTimestamp()

    try {
      //  await addDoc(collection(firestore, "todos"), todo);
      await setDoc(doc(firestore, "users", user.uid), user);
      window.toastify("User profile created successfully", "success")

    } catch (e) {
      console.error("Error adding document: ", e);
      window.toastify("Failed to create user profile", "error")
    } finally {
      setIsAppLoading(false)
    }
  }



return (
  <main className="auth">
    <div className="container">
      <div className="card p-3">

        <Title level={1} className="text-center mb-4">
          Register
        </Title>
        <Paragraph className="text-center">Already have an account? <Link to="/auth/login">Login</Link></Paragraph>
        <Form layout='vertical'>
          <Row>
            <Col span={24}>
              <Form.Item label="Full Name" required>
                <Input size='large' type="text" placeholder="Enter Your Full Name" name='fullName' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Email" required>
                <Input size='large' type="email" placeholder="Enter Your Email" name='email' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Password" required>
                <Input.Password size="large" placeholder="Enter Your Password" name='password' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Confirm Password" required>
                <Input.Password size='large' placeholder="Confirm Your Password" name='confirmPassword' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={24} >
              <Button type="primary" size='large' block htmlType='submit' loading={isProcessing} onClick={handleRegister}>
                Register
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  </main>
)
}

export default Register