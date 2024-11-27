import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from tqdm import tqdm
from keybert import KeyBERT
import nltk
import re

# Download NLTK resources
nltk.download('punkt_tab')
nltk.download('stopwords')

# Paths
raw_reviews_path = 'data/raw/rotten_tomatoes_critic_reviews.csv'
raw_movies_path = 'data/raw/rotten_tomatoes_movies.csv'
processed_data_path = 'data/processed/movies_with_keywords.csv'
tfidf_matrix_path = 'data/processed/tfidf_matrix.pkl'
tfidf_model_path = 'data/processed/tfidf_model.pkl'

# Initialize models
sentiment_analyzer = SentimentIntensityAnalyzer()
kw_model = KeyBERT()

# Text cleaning function
def preprocess_text(text):
    if pd.isnull(text):
        return ''
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove special characters
    tokens = nltk.word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

# Analyze sentiment
def analyze_sentiment(text):
    if pd.isnull(text) or not text.strip():
        return 0.0  # Neutral sentiment
    sentiment_scores = sentiment_analyzer.polarity_scores(text)
    return sentiment_scores['compound']  # Compound score as overall sentiment

# Extract keywords using KeyBERT
def extract_keywords(text, model, top_n=5):
    if pd.isnull(text) or not text.strip():
        return []
    keywords = model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_n)
    return ', '.join([kw[0] for kw in keywords])  # Join keywords as a single string

# Main preprocessing function
def preprocess_data():
    # Load datasets
    print("Loading datasets...")
    movies_df = pd.read_csv(raw_movies_path)
    reviews_df = pd.read_csv(raw_reviews_path)
    
    # Merge datasets on 'rotten_tomatoes_link'
    print("Merging datasets...")
    merged_df = pd.merge(reviews_df, movies_df, on='rotten_tomatoes_link', how='left')
    
    # Clean reviews and movie descriptions with a progress bar
    print("Cleaning reviews and movie descriptions...")
    tqdm.pandas(desc="Cleaning reviews")
    merged_df['cleaned_review'] = merged_df['review_content'].progress_apply(preprocess_text)
    merged_df['cleaned_movie_info'] = merged_df['movie_info'].progress_apply(preprocess_text)
    
    # Group by unique movies and combine text
    unique_movies = merged_df['rotten_tomatoes_link'].unique()
    print(f"Number of unique movies: {len(unique_movies)}")
    
    # Initialize progress bar
    pbar = tqdm(total=len(unique_movies), desc="Processing movies")
    
    # Combine reviews, extract keywords, and analyze sentiment
    movie_texts = []
    for movie_id in unique_movies:
        movie_reviews = merged_df[merged_df['rotten_tomatoes_link'] == movie_id]
        combined_review = ' '.join(movie_reviews['cleaned_review'])
        combined_text = combined_review + ' ' + movie_reviews['cleaned_movie_info'].iloc[0]
        
        # Sentiment analysis
        sentiment_score = analyze_sentiment(combined_text)
        
        # Keyword extraction
        keywords = extract_keywords(combined_text, kw_model)
        
        # Add to list
        movie_row = {
            'rotten_tomatoes_link': movie_id,
            'combined_text': combined_text,
            'sentiment_score': sentiment_score,
            'keywords': keywords,
            'genres': movie_reviews['genres'].iloc[0]  # Include genres
        }
        movie_texts.append(movie_row)
        pbar.update(1)
    
    pbar.close()
    
    # Convert to DataFrame
    movie_texts_df = pd.DataFrame(movie_texts)
    
    # TF-IDF vectorization with a progress bar
    print("Performing TF-IDF vectorization...")
    tfidf = TfidfVectorizer(max_df=0.8, max_features=10000)
    tfidf_matrix = tfidf.fit_transform(tqdm(movie_texts_df['combined_text'], desc="Vectorizing text"))
    
    # Save processed data and TF-IDF model
    print("Saving processed data...")
    movie_texts_df.to_csv(processed_data_path, index=False)
    with open(tfidf_matrix_path, 'wb') as f:
        pickle.dump(tfidf_matrix, f)
    with open(tfidf_model_path, 'wb') as f:
        pickle.dump(tfidf, f)
        
    print("Data preprocessing complete. Preprocessed files saved in 'data/processed'.")

if __name__ == '__main__':
    preprocess_data()
