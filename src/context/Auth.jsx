import { auth, firestore } from "@/config/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"

const Auth = createContext()
const initialState = { isAuth: false, user: {} }

const AuthContext = ({ children }) => {

    const [state, setState] = useState(initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const readProfile = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                 const docSnap = await getDoc(doc(firestore, "users", user.uid));
                
                    if (docSnap.exists()) {
                      const user = docSnap.data()
                      console.log("User Profile:", user);
                      setState({ isAuth: true, user })
                    } else {
                      console.error("User not found")
                    }
                    setIsAppLoading(false)
            } else {
                setIsAppLoading(false)
            }
            
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
