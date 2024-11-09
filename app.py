from flask import Flask, jsonify, request
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L12-v2')
CORS(app)
# Load the user data from next.json with utf-8 encoding
with open('next.json', 'r', encoding='utf-8') as file:
    users = json.load(file)

def combine_profile_info(user):
    """
    Combines relevant information from LinkedIn, GitHub, and LeetCode profiles
    using the correct key structure from the example
    """
    # LinkedIn info
    linkedin_data = user.get("linkedinInfo", [{}])[0]
    linkedin_info = f"{linkedin_data.get('headline', '')} {linkedin_data.get('summary', '')} "
    
    # GitHub info - get languages from repositories
    github_repos = user.get("githubInfo", [{}])[0].get("repositories", [])
    github_languages = " ".join(repo.get("language", "") for repo in github_repos if repo.get("language"))
    
    # LeetCode info
    leetcode_data = user.get("leetcodeInfo", [{}])[0].get("userContestDetails", {})
    leetcode_info = f"Rating: {leetcode_data.get('rating', '')} Rank: {leetcode_data.get('globalRanking', '')}"
    
    # Combine all information
    return f"{linkedin_info} {github_languages} {leetcode_info}".strip()

# Generate embeddings for all users
user_embeddings = np.array([model.encode(combine_profile_info(user)) for user in users])

@app.route('/accomplices', methods=['POST'])
def find_accomplices():
    try:
        # Get input user data
        input_user = request.json
        
        if not input_user:
            return jsonify({"error": "No input data provided"}), 400
            
        # Generate embedding for input user
        input_profile_text = combine_profile_info(input_user)
        input_embedding = model.encode(input_profile_text)
        
        # Calculate similarity scores
        similarity_scores = cosine_similarity([input_embedding], user_embeddings)[0]
        
        # Get top 3 matches (excluding the user themselves if present)
        # Create list of (index, score) tuples for sorting
        scored_indices = list(enumerate(similarity_scores))
        
        # Sort by similarity score in descending order
        sorted_indices = sorted(scored_indices, key=lambda x: x[1], reverse=True)
        
        # Filter out the input user if present (by username comparison)
        input_username = input_user.get("username")
        filtered_matches = [
            (idx, score) for idx, score in sorted_indices
            if users[idx].get("username") != input_username
        ][:3]  # Get top 3
        
        # Format the response
        recommended_accomplices = [
            {
                "username": users[idx]["username"],
                "similarity_score": float(score),  # Convert numpy float to Python float
                "profile_info": {
                    "leetcode_rating": users[idx].get("leetcodeInfo", [{}])[0].get("userContestDetails", {}).get("rating"),
                    "github_repos": len(users[idx].get("githubInfo", [{}])[0].get("repositories", [])),
                    "linkedin_headline": users[idx].get("linkedinInfo", [{}])[0].get("headline")
                }
            }
            for idx, score in filtered_matches
        ]
        
        result = {
            "input_username": input_username,
            "recommended_accomplices": recommended_accomplices
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)