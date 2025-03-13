from flask import Flask, request, jsonify
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# Load movie dataset (Example: CSV format)
movies_df = pd.read_csv("movies.csv")
ratings_df = pd.read_csv("ratings.csv")

# Collaborative Filtering Model using Surprise Library
reader = Reader(rating_scale=(0, 5))
data = Dataset.load_from_df(ratings_df[['userId', 'movieId', 'rating']], reader)
trainset, testset = train_test_split(data, test_size=0.2)

model = SVD()
model.fit(trainset)

# Recommendation Function
def get_movie_recommendations(user_id, n=5):
    user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].tolist()
    all_movies = movies_df['movieId'].unique()
    
    # Predict scores for movies user hasn't rated
    predictions = [(movie, model.predict(user_id, movie).est) for movie in all_movies if movie not in user_movies]
    predictions.sort(key=lambda x: x[1], reverse=True)

    recommended_movies = [movies_df[movies_df['movieId'] == movie].iloc[0].to_dict() for movie, _ in predictions[:n]]
    return recommended_movies

# API Endpoint
@app.route("/recommend", methods=["GET"])
def recommend_movies():
    user_id = int(request.args.get("user_id"))
    recommendations = get_movie_recommendations(user_id)
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
