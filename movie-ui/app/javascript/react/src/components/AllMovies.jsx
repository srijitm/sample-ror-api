import React from 'react';

class AllMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }
  componentDidMount(){
    var API_URL = process.env.REACT_APP_API_URL
    fetch(`${API_URL}/api/movies`)
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ movies: data }) });
  }
  render(){
    return(
      <div>
        <h2>To do: List of movies</h2>
      </div>
     )
   }
   render(){
     var movies = this.state.movies.map((movie) => {
      return(
       <div key={movie.id}>
        <h1>{movie.title}</h1>
        <p>Released: {movie.year}</p>
        <p>Genre: {movie.genre}</p>
       </div>
      )
     })
     return(
      <div>
       {movies}
      </div>
     )
    }
}

export default AllMovies;
