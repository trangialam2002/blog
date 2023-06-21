import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { publicRouter } from './PublicRouter/PublicRouter';
import { createContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/firebase-config';
import Header from './Component/Header/Header';
import Dashboard from './Pages/Dashboard/Dashboard';

export const loginContext=createContext()
function App() {
  const [user,setUser]=useState({})
  useEffect(()=>{
    onAuthStateChanged(auth,snap=>{
      setUser(snap?snap:'')
    })
  },[])
  return (
    <loginContext.Provider value={user}>
      <BrowserRouter>
          <Routes>
            {
              publicRouter.map((item,index)=>{
                  if(!item.path.includes('dashboard')){
                    if(item.header===false){
                      return (
                        <Route 
                          key={index}
                          path={item.path}
                          element={<item.component/>} 
                        /> 
                      )
                    }
                    else{
                      return (
                        <Route 
                          key={index}
                          path={item.path}
                          element={
                            <>
                              <Header />
                              <item.component />
                            </>
                          } 
                        /> 
                      )
                    }
                  }
                  else return (
                        <Route 
                          key={index}
                          path={item.path}
                          element={
                            <Dashboard>
                              <item.component/>
                            </Dashboard>
                          } 
                        /> 
                      )
              })
            }
          </Routes>
      </BrowserRouter>
    </loginContext.Provider>
  );
}

export default App;
