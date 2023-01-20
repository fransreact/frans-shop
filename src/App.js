import { React, useState } from 'react'
import logo from './logo.svg';
import './App.css';
import { TextField } from '@mui/material';

function App() {
  const [state , setState] = useState(
    {
      nama: "",
      angka: 0
    }
  )

  const handleChange = (fieldName, value) => {
    let newState = {...state}
    newState[fieldName] = value
    setState(newState)
  }
  
  return (
    <div className='App'>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Selamat Datang {state.nama} nomor urut anda pada {state.angka}.</p>
        <TextField
          margin="normal"
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          onChange={(e) => handleChange("nama", e.target.value)}
        />
        <TextField
          margin="normal"
          id="angka"
          label="Angka"
          name="angka"
          type="number"
          onChange={(e) => handleChange("angka", e.target.value)}
        />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >

        </a>
      </header>
    </div>
  )
}

export default App;
