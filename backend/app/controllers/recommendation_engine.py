import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def combine_vectors(tfidf_matrix, sentiment_scores, weight=0.2):
    """
    Combine TF-IDF matrix with sentiment scores, weighted by the specified factor.
    """
    sentiment_column = np.array(sentiment_scores).reshape(-1, 1)  # Ensure 2D array
    return np.hstack((tfidf_matrix.toarray(), sentiment_column * weight))

def get_similar_movies(movie_id, combined_matrix, movies_df, top_n=10):
    """
    Get the top N similar movies based on cosine similarity.
    """
    try:
        # Find the index of the movie
        print(f"Looking for movie_id: {movie_id}")
        movie_row = movies_df[movies_df['rotten_tomatoes_link'] == movie_id]

        # Check if the movie exists in the dataset
        if movie_row.empty:
            raise ValueError(f"Movie ID '{movie_id}' not found in the dataset.")

        movie_idx = movie_row.index[0]
        print(f"Found movie_id at index: {movie_idx}")

    except IndexError:
        raise ValueError("Movie ID not found in the dataset.")

    # Compute cosine similarity
    try:
        # Ensure the input is reshaped properly
        movie_vector = combined_matrix[movie_idx].reshape(1, -1)
        similarities = cosine_similarity(movie_vector, combined_matrix)
    except Exception as e:
        raise ValueError(f"Error in similarity computation: {str(e)}")

    # Get the top N most similar movies (excluding itself)
    try:
        similar_indices = similarities[0].argsort()[-top_n-1:-1][::-1]
        similar_movies = movies_df.iloc[similar_indices]
        print(f"Similar movies indices: {similar_indices}")
    except Exception as e:
        raise ValueError(f"Error extracting similar movies: {str(e)}")

    # Ensure the required columns are included in the return
    required_columns = ['rotten_tomatoes_link', 'keywords', 'sentiment_score', 'genres']
    for col in required_columns:
        if col not in similar_movies.columns:
            similar_movies[col] = None  # Add missing columns as empty

    return similar_movies[required_columns]
