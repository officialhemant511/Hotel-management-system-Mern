import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen'
import Loginscreen from './screens/Loginscreen';
import Landingscreen from './screens/Landingscreen';
import Profilescreen from './screens/Profilescreen'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Homescreen />} />
          <Route path='/book/:roomid/:fromdate/:todate' element={<Bookingscreen/>} />
          <Route path='/register' element={<Registerscreen/>}/>
          <Route path='/login' element={<Loginscreen/>}/>
          <Route path='/' element={<Landingscreen/>}/>
          <Route path='/profile' element={<Profilescreen/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;