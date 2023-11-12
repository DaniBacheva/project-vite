import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';

import { authServiceFactory } from './services/authService'
import { placeServiceFactory } from './services/placeService'
import { AuthContext } from './contexts/AuthContext';


import NewPlace from "./components/NewPlace/NewPlace"
import Dashboard from "./components/Dashboard/Dashboard"
import Details from "./components/Details/Details"
import EditPage from "./components/EditPage/EditPage"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Logout from './components/Logout/Logout';

function App() {
  const navigate = useNavigate();
  const [places, setPlace] = useState([]);
  const [auth, setAuth] = useState({});
  const placeService = placeServiceFactory(auth.accessToken)
  const authService = authServiceFactory(auth.accessToken)

  useEffect(() => {
    placeService.getAll()
      .then(result => {
        setPlace(result);
      })
  }, []);

  const onAddPlaceSubmit = async (data) => {
    console.log(auth.accessToken)
    const newPlace = await placeService.create(data);
    console.log(newPlace)
    setPlace(state => [...state, newPlace])
    navigate('/dashboard')
  }

  const onPlaceEditSubmit = async (data) => {
    const result = await placeService.edit(data._id, data);
    console.log(data)
    //todo change state

    //setPlace(state => state.map(p => p._id === data._id ? result : p))

    navigate(`/dashboard/${data._id}`);
  }

  const onLoginSubmit = async (data) => {
    try {
      const result = await authService.login(data);
      setAuth(result);

      navigate('/');
    } catch (error) {
      console.log("Try again")
    }
  };

  const onRegisterSubmit = async (values) => {
    const { rePassword, ...registerData } = values;
    if (rePassword !== registerData.password) {
      return
    }

    try {
      const result = await authService.register(registerData);
      setAuth(result);

      navigate('/');
    } catch (error) {
      console.log("Try again")
    }
  };

  const onLogout = async () => {
    await authService.logout();
    setAuth({});
  }

  const context = {
    onLoginSubmit,
    onRegisterSubmit,
    onLogout,
    userId: auth._id,
    token: auth.accessToken,
    userEmail: auth.email,
    isAuthenticated: !!auth.accessToken
  }

  return (
    <AuthContext.Provider value={context}>

      <div id="wrapper">
        <Header />

        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard places={places} />} />
            <Route path='/new-place' element={<NewPlace onAddPlaceSubmit={onAddPlaceSubmit} />} />
            <Route path='/dashboard/:placeId' element={<Details />} />
            <Route path='/dashboard/:placeId/edit' element={<EditPage onPlaceEditSubmit={onPlaceEditSubmit} />} />

          </Routes>

        </main>

      </div>
      <Footer />
    </AuthContext.Provider>
  )
}

export default App
