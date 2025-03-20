// import Navbar from "../Navbar/Navbar";

// function RecursosHumanos() {
//   return (
//     <div>
//       <Navbar />
//       <h1>Recursos Humanos</h1>
//     </div>
//   );
// }

// export default RecursosHumanos;


import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from '../Navbar/Navbar';

export default function RecursosHumanos() {
  return (
    <div>
      <Navbar/>
    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
      <CircularProgress color="secondary" />
      <CircularProgress color="success" />
      <CircularProgress color="inherit" />
    </Stack>

    </div>
  );
}

