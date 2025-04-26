import MyNav from './MyNav';
import HomePage from './HomePage';
import Learn from './Learn';
import Quiz from './Quiz';
import Login from './Login';
import useFetch from './useFetch';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


function App() {
  const terms = ['hue', 'shade', 'tint', 'tone', 'chroma_saturation', 'value', 'contrast'];
  const { data: userInfo, isPending, error } = useFetch('/data/user');
  console.log(userInfo)
  return (
    <Router>
      <div className="App">
          {userInfo && 
            <Routes>
              <Route exact path="/login" element={
                  userInfo['user'] ? (
                    <Navigate replace to='/'/>
                  ) : (
                    <Login />
                  )
                }></Route>
              <Route exact path="/" element={
                userInfo['user'] ? (
                  <HomePage userInfo={userInfo} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }></Route>
              {terms.map((term) => {
                return  <Route key={term} path={`${term}/learn/:page`} element={
                  userInfo['user'] ? (
                    <Learn term={term} userInfo={userInfo} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }></Route>
              })}
              {terms.map((term) => {
                return  <Route key={term} path={`${term}/quiz/:page`} element={
                  userInfo['user'] ? (
                    <Quiz term={term} userInfo={userInfo} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }></Route>
              })}
              <Route path='final/:page' element={
                  userInfo['user'] ? (
                    <Quiz term='final' userInfo={userInfo} ></Quiz>
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
