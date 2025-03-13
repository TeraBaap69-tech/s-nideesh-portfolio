import React, { useState } from "react";
import axios from "axios";
import { 
  Container, Box, TextField, Button, Card, CardContent, Typography, Grid 
} from "@mui/material";

const App = () => {
  const [userId, setUserId] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchRecommendations = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://127.0.0.1:5000/recommend?user_id=${userId}`);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        AI Movie Recommender
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={4}>
        <TextField
          label="Enter User ID"
          variant="outlined"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Button variant="contained" color="primary" onClick={fetchRecommendations}>
          Get Recommendations
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.movieId}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {movie.genre}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
