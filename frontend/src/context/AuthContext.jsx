import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import api from "../services/api";
// a container to store authentication states and other related stuffs
const AuthContext = createContext();
// to fill the authContext container and manages states and functions
export const AuthProvider = ({children})=>{
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const validateToken = async ()=>{
            if(!token){
                setLoading(false);
                return;
            }
            try{
                await api.get('/auth/me');
                setLoading(false);
            }catch(error){
                console.log('token validation failed: ', error.response?.data || error.message);
                if(error.response?.status === 401){
                    localStorage.removeItem('token');
                    setToken(null);                    
                }
                setLoading(false);
            }
        };
        validateToken();
    }, [token]);
    const login = (jwt)=>{
        localStorage.setItem('token', jwt);
        setToken(jwt);
    }
    const logout = ()=>{
        localStorage.removeItem('token');
        setToken(null);
    }
    return (
        <AuthContext.Provider value = {{token, login, logout, loading}}>
            {!loading && children}
        </AuthContext.Provider>    
    );
};
export const useAuth = () => (useContext(AuthContext));