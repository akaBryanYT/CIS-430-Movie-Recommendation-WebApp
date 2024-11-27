import pandas as pd
import pickle

# Load processed data
def load_processed_data():
    data_path = 'data/processed/movies_with_keywords.csv'
    return pd.read_csv(data_path)

# Load TF-IDF matrix and model
def load_tfidf():
    tfidf_matrix_path = 'data/processed/tfidf_matrix.pkl'
    tfidf_model_path = 'data/processed/tfidf_model.pkl'
    with open(tfidf_matrix_path, 'rb') as f:
        tfidf_matrix = pickle.load(f)
    with open(tfidf_model_path, 'rb') as f:
        tfidf_model = pickle.load(f)
    return tfidf_matrix, tfidf_model
