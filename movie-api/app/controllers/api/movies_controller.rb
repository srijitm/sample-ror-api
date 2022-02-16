class Api::MoviesController < ApplicationController
    # GET /movies
    def show
        @movies = Movie.all
        render json: @movies
    end

    # POST /movies
    def create
        @movie = Movie.new(movie_params)

        if @movie.save
            render json: @movie
        else
            render error: {error: 'Failed to add movie record'}, status: 400
        end
    end

    private

    def movie_params
        params.require(:movie).permit(:name, :year, :genre)
    end
end
