
import HomePage from './HomePage';
import Learn from './Learn';
import Quiz from './Quiz';
import Login from './Login';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'



function App() {
  const terms = ['hue', 'shade', 'tint', 'tone', 'chroma_saturation', 'value', 'contrast'];
  const [userInfo, setUserInfo] = useState({"user" : null});
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUserInfo = () => {
    fetch('/data/user', {
      credentials: 'include',
      method: 'GET',
    })
      .then(res => {
        if(!res.ok) {
          throw Error('Could not fetch data');
        }
        return res.json();
      })
      .then((data) => {
        setUserInfo(data['data'])
        setIsPending(false);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });
  }
  

  useEffect(() => {
    fetchUserInfo();
  }
  ,[]);


  console.log(userInfo)

  if (isPending) {
    return <div>Loading…</div>; 
  }

  return (
    <Router>
      <div className="App">
          {userInfo && 
            <Routes>
              <Route exact path="/login" element={
                  userInfo['user'] ? (
                    <Navigate replace to='/'/>
                  ) : (
                    <Login userInfo={userInfo} setUserInfo={setUserInfo}/>
                  )
                }></Route>
              <Route exact path="/" element={
                userInfo['user'] ? (
                  <HomePage userInfo={userInfo} setUserInfo={setUserInfo} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }></Route>
              {terms.map((term) => {
                return  <Route key={term} path={`${term}/learn/:page`} element={
                  userInfo['user'] ? (
                    <Learn term={term} userInfo={userInfo} setUserInfo={setUserInfo}/>
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }></Route>
              })}
              {terms.map((term) => {
                return  <Route key={term} path={`${term}/quiz/:page`} element={
                  userInfo['user'] ? (
                    <Quiz term={term} userInfo={userInfo} setUserInfo={setUserInfo} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }></Route>
              })}
              <Route path='final/:page' element={
                  userInfo['user'] ? (
                    <Quiz term='final' userInfo={userInfo} setUserInfo={setUserInfo} ></Quiz>
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }></Route>
            </Routes>
          }
        </div>
    </Router>
  );
}

export default App;
