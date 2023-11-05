import './MovieListPage.css';
import '../../colors.css';

import {useState} from 'react';

import GenreSelect from '../GenreSelect/GenreSelect';
import SortControl from '../SortControl/SortControl';
import MovieTile from '../MovieTile/MovieTile';
import EditMovieDialog from '../EditMovieDialog/EditMovieDialog';


import {Movie} from '../../models/movie';

import {GENRES} from '../../consts';
import {Outlet, useLoaderData, useSearchParams} from "react-router-dom";

const MovieListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeGenre = searchParams.get('genre') as string;

    const {movieList} = useLoaderData() as { movieList: Array<Movie> };

    const [sortCriterion, setSortCriterion] = useState<'releaseDate' | 'title'>('releaseDate');
    const [selectedMovie,] = useState<Movie>({} as Movie);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);


    const showGenreMovies = (selectedGenre: string): void => {
        setSearchParams({genre: selectedGenre})
    };
    const openDetailInfo = (openMovieId: number): void => {
        console.log(openMovieId)
    };

    const sortMoviesBy = (sortedBy: 'releaseDate' | 'title'): void => {
        setSortCriterion(sortedBy);
    };

    return (
        <>
            <Outlet/>
            <main className='moviesListPage'>
                <div className='sortFilterLine'>
                    <GenreSelect
                        selectedGenre={activeGenre}
                        listGenres={GENRES}
                        onSelect={(genre: string) => showGenreMovies(genre)}
                    />
                    <SortControl
                        currentSelection={sortCriterion}
                        onSortChange={(selectedSortValue: 'releaseDate' | 'title') =>
                            sortMoviesBy(selectedSortValue)
                        }
                    />
                </div>
                <div className='moviesList'>
                    {movieList.map((movie: Movie) => (
                        <MovieTile
                            key={movie.id}
                            onClickMovie={(name) => openDetailInfo(name)}
                            genres={movie.genres}
                            movieName={movie.movieName}
                            id={movie.id}
                            imageUrl={movie.imageUrl}
                            releaseYear={movie.releaseYear}
                        />
                    ))}
                </div>

                {showEditDialog && (
                    <EditMovieDialog
                        onClose={() => setShowEditDialog(false)}
                        onReset={() => setShowEditDialog(false)}
                        movie={selectedMovie}
                        title='Edit movie'
                        onSubmit={(result) => console.log('submit: ', result)}
                    ></EditMovieDialog>
                )}
            </main>
        </>
    );
};

export default MovieListPage;
