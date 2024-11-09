from flask import Flask, jsonify, request
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L12-v2')

# Load the user data from next.json
with open('next.json', 'r') as file:
    users = json.load(file)

# Combine LinkedIn, GitHub, and LeetCode data into one text field for each user
def combine_profile_info(user):
    linkedin_bio = user.get("linkedinInfo", [{}])[0].get("headline", "")
    github_tech_stack = " ".join(
        repo.get("language", "") for repo in user.get("githubInfo", [{}])[0].get("repositories", [])
    )
    leetcode_stats = user.get("leetcodeInfo", [{}])[0].get("userContestDetails", {}).get("rating", "")
    return f"{linkedin_bio} {github_tech_stack} {leetcode_stats}"

# Generate embeddings for each user in next.json
user_embeddings = np.array([model.encode(combine_profile_info(user)) for user in users])

@app.route('/accomplices', methods=['POST'])
def accomplices():
    # Get junior user's profile data from request JSON
    junior_profile_data = request.json

    # Check if input data has the required fields
    if not junior_profile_data or not all(
        key in junior_profile_data for key in ['username', 'linkedin_bio', 'github_tech_stack', 'leetcode_stats']
    ):
        return jsonify({"error": "Invalid input data"}), 400

    # Generate embedding for the junior user's profile
    junior_profile_text = f"{junior_profile_data['linkedin_bio']} {junior_profile_data['github_tech_stack']} {junior_profile_data['leetcode_stats']}"
    junior_embedding = model.encode(junior_profile_text)

    # Calculate similarity scores
    similarity_scores = cosine_similarity([junior_embedding], user_embeddings)[0]

    # Get top 5 matches
    top_matches_indices = np.argsort(similarity_scores)[-5:][::-1]
    top_matches = [
        {
            "username": users[i]["username"],
            "similarity_score": similarity_scores[i]
        }
        for i in top_matches_indices
    ]

    # Return accomplices for the junior user
    result = {
        "junior_username": junior_profile_data["username"],
        "recommended_accomplices": top_matches
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
