from flask import Flask, request, jsonify
from flask_cors import CORS
from app.controllers.data_loader import load_processed_data, load_tfidf
from app.controllers.recommendation_engine import get_similar_movies
from app.controllers.recommendation_engine import combine_vectors
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Load data once at startup
movies_df = load_processed_data()
tfidf_matrix, tfidf_model = load_tfidf()
# Combine TF-IDF matrix with sentiment scores
combined_matrix = combine_vectors(tfidf_matrix, movies_df['sentiment_score'])

@app.route('/api/recommendations', methods=['GET'])
def recommendations():
    print("Request parameters:")
    movie_id = request.args.get('movie_id')
    top_n = int(request.args.get('top_n', 50))
    genres = request.args.get('genres')
    sentiment = request.args.get('sentiment')
    keywords = request.args.get('keyword')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    print(f"Unique sentiment scores: {movies_df['sentiment_score'].unique()}")
    print(movies_df[['rotten_tomatoes_link', 'sentiment_score']].head(20))  # Sample of sentiment scores

    try:
        # Initialize similar_movies
        if movie_id:
            # Fetch similar movies based on movie_id
            similar_movies = get_similar_movies(movie_id, combined_matrix, movies_df, top_n)
        else:
            # Default to all movies sorted by absolute sentiment_score
            similar_movies = movies_df.copy()

        # Debugging sentiment range
        print(f"Sentiment scores range: min={similar_movies['sentiment_score'].min()}, max={similar_movies['sentiment_score'].max()}")

        # Apply genre filter (if provided and valid)
        if genres:
            genre_list = [genre.strip().lower() for genre in genres.split(",")]
            similar_movies = similar_movies[
                similar_movies['genres']
                .str.lower()  # Convert column values to lowercase
                .str.contains('|'.join(genre_list), na=False)  # Match genres
                |
                similar_movies['keywords']
                .str.lower()  # Cross-check in keywords
                .str.contains('|'.join(genre_list), na=False)  # Match genres in keywords
            ]
            print(f"Filtered by genres: {genres}, remaining count: {len(similar_movies)}")

        # Apply sentiment filter (if provided)
        if sentiment:
            if sentiment == 'positive':
                similar_movies = similar_movies[similar_movies['sentiment_score'] > 0.05]
            elif sentiment == 'neutral':
                similar_movies = similar_movies[
                    (similar_movies['sentiment_score'] >= -0.05) & (similar_movies['sentiment_score'] <= 0.05)
                ]
            elif sentiment == 'negative':
                similar_movies = similar_movies[similar_movies['sentiment_score'] < -0.05]

            print(f"Filtered by sentiment: {sentiment}, remaining count: {len(similar_movies)}")

        # Apply keyword filter (if provided)
        if keywords:
            keywords_list = [keyword.strip().lower() for keyword in keywords.split(",")]
            similar_movies = similar_movies[
                similar_movies['keywords']
                .str.lower()  # Convert column values to lowercase
                .str.contains('|'.join(keywords_list), na=False)  # Match keywords
            ]
            print(f"Filtered by keywords: {keywords}, remaining count: {len(similar_movies)}")
            
        # Apply sorting only after filters 
        if not movie_id:
            similar_movies = similar_movies.sort_values(by='sentiment_score', ascending=False).head(top_n)

        # Pagination
        total_results = len(similar_movies)
        total_pages = (total_results + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        paginated_movies = similar_movies.iloc[start:end]

        response = {
            "page": page,
            "per_page": per_page,
            "total_results": total_results,
            "total_pages": total_pages,
            "movies": paginated_movies.to_dict(orient='records'),
        }
                
        return jsonify(response)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
