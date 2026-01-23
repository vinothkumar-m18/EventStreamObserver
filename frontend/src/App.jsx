import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Sources from './pages/Sources.jsx';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from './context/AuthContext.jsx';
const PrivateRoute = ({children})=>{
    const {token} = useAuth();
    if(!token){
        console.log('no token. redirecting to login');
    }
    return token ? children : <Navigate to = '/login'/>
}
function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path = '/login' element = {<Login/>}/>
                <Route path = '/register' element = {<Register/>}/>
                <Route path = '/sources' element = {<PrivateRoute><Sources/></PrivateRoute>}/>
                <Route path = '/' element = {<PrivateRoute><Dashboard/></PrivateRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;