import React, { useState } from 'react'
import axios from "axios"
import Loader from '../components/Loader'
import Error from '../components/Error'
import Sucess from '../components/Sucess'

function Registerscreen() {
  // States for Inputs
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [cpassword, setcpassword] = useState('')

  // States for Response
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState()
  const [success, setsuccess] = useState()
 async function register() {

    if (password == cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword
      }
      try{
          setloading(true)
          const result = await axios.post('/api/users/register', user).data;
          setloading(false)
          setsuccess(true)
          setname('')
          setemail('')
          setpassword('')
          setcpassword('')
  
      }catch(error){
          console.log(error)
          setloading(false)
          seterror(true)
      }
    }
    else {
      alert("Password not match")
    }
  }
  return (
    <div>

      {/* If States are true only then components will show */}
      {loading && (<Loader/>)}
     {error && (<Error/>)}

      <div className='row justify-content-center mt-5 shadow-none'>
        {success && (<Sucess message={"Registration Completed Go To Login page"}/>)}

        <div className='col-md-5 mt-5'>

          <div className='bs border'>
            <h2 className='text-center'>Register</h2>
            <input type='text' className='form-control' placeholder='Name' value={name} onChange={(e) => { setname(e.target.value) }} />
            <input type='text' className='form-control' placeholder='Email' value={email} onChange={(e) => { setemail(e.target.value) }} />
            <input type='text' className='form-control' placeholder='Password' value={password} onChange={(e) => { setpassword(e.target.value) }} />
            <input type='text' className='form-control' placeholder='Confirm Password' value={cpassword} onChange={(e) => { setcpassword(e.target.value) }} />
            <button className='btn btn-dark mt-3' onClick={register}>Register</button>
          </div>




        </div>

      </div>
    </div>
  )
}

export default Registerscreen