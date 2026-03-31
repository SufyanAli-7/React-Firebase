import { auth } from "@/config/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

const Auth = createContext()
const initialState = { isAuth: false, user: {} }

const AuthContext = ({ children }) => {

    const [state, setState] = useState(initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const readProfile = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setState({ isAuth: true, user })
            }
            setIsAppLoading(false)
        })

    }
    useEffect(() => {
        readProfile()
    }, [])

    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            setState(initialState)
            window.toastify("Logged out successfully!", "success")
        })
        .catch((error) => {
            window.toastify("Logout failed. Please try again.", "error")
            console.error("Logout Error:", error)
        })
    }

    return (
        <Auth.Provider value={{ ...state, isAppLoading, handleLogout, dispatch: setState }}>
            {children}
        </Auth.Provider>
    )
}

export default AuthContext

export const useAuth = () => useContext(Auth)
