import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider, useLoaderData} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MovieDetails from "./components/MovieDetails/MovieDetails";
import SearchForm from "./components/SearchForm/SearchForm";
import {getMovies} from "./services/api.service";
import {Movie, MovieAPI} from "./models/movie";

const MD = () => {
    const selectedMovie = (useLoaderData() as {movie: Movie}).movie
    console.log('movie details', selectedMovie);
    return <>
                        <span
                            className='exitButton'
                            // onClick={() => toggleDetailedContainer()}
                        />
        <MovieDetails {...selectedMovie} />
    </>;
}


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        loader: async ({request}) => {
            const url = new URL(request.url);
            const genre = url.searchParams.get("genre") as string; // todo other search params
            const movieList = await getMovies('', 'releaseDate', genre).then((data) => {
                return data.data.map((movieApi) => ({
                    id: movieApi.id,
                    movieName: movieApi.title,
                    releaseYear: +movieApi.release_date.split('-')[0],
                    genres: movieApi.genres,
                    voteAverage: movieApi.vote_average,
                    description: movieApi.overview,
                    duration: movieApi.runtime,
                    imageUrl: movieApi.poster_path,
                }));
            });
            return {movieList}
        },
        children: [
            {
                path: ':movieId',
                element: <MD/>,
                loader: async ({params: {movieId}}) => {
                    console.log(movieId);
                    const movies = await getMovies('', 'releaseDate', 'all')
                    const movieApi = movies.data.find(m => m.id === Number(movieId)) as MovieAPI
                    return {
                        movie: {
                            id: movieApi.id,
                            movieName: movieApi.title,
                            releaseYear: +movieApi.release_date.split('-')[0],
                            genres: movieApi.genres,
                            voteAverage: movieApi.vote_average,
                            description: movieApi.overview,
                            duration: movieApi.runtime,
                            imageUrl: movieApi.poster_path,
                        }
                    };
                }
            },
            {
                path: '',
                element: <div className='headerContainer'>
                    <div className='blurContainer'></div>
                    <h1 className='headerTitle'>FIND YOUR MOVIE</h1>
                    <SearchForm
                        initialValue='{searchQuery}'
                        searchMovie={() => {
                        }}
                    />
                </div>
            }
        ]
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
