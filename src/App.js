// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Paper
} from '@mui/material';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  

  try {

// change : 1-------------------------------------------------
      const response = await axios.post('https://recommendation-system-1-0j7h.onrender.com/get-assessments', {
        job_description: query,
        top_n: 5
      });

    // const response = await axios.post(
    //   `${process.env.REACT_APP_API_URL}/get-assessments`,
    //   { job_description: query, top_n: 5 }
    // );


      console.log(response.data.assessments);
  
      setResults(response.data.assessments); // Make sure backend responds with `assessments` key
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          SHL Assessment Recommender
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter job description"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Get Recommendations'}
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Error: {error}
          </Typography>
        )}

        {results.length > 0 && (
          <List sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Assessments:
            </Typography>
            {results.map((test, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={<a href={test.url} target="_blank" rel="noopener noreferrer">{test.description}</a>}
                  secondary={
                    <>
                      <Chip label={`Job Level: ${test.job_levels}`} size="small" sx={{ mr: 1 }} />
                      <Chip 
                        label={`Language: ${test.languages}`} 
                        color={test.remote === 'Yes' ? 'success' : 'default'} 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                    
                      <br/>
                     
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default App;