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


def combine_senior_profile_info(user):
    """
    Combines senior user profile information from LinkedIn, GitHub, and LeetCode
    """
    try:
        # LinkedIn info
        linkedin_info = user.get('linkedinInfo', [{}])[0]
        linkedin_bio = linkedin_info.get('summary', '') + ' ' + linkedin_info.get('headline', '')
        
        # GitHub repositories
        github_info = user.get('githubInfo', [{}])[0].get('repositories', [])
        github_repos = " ".join([
            f"{repo.get('description', '')} {repo.get('language', '')}"
            for repo in github_info
        ])
        
        # LeetCode info
        leetcode_info = user.get('leetcodeInfo', [{}])[0].get('userContestDetails', {})
        leetcode_summary = f"LeetCode rating: {leetcode_info.get('rating', '')}, contests: {leetcode_info.get('attendedContestsCount', '')}"
        
        return f"{linkedin_bio} {github_repos} {leetcode_summary}".strip()
    except Exception as e:
        print(f"Error in combine_senior_profile_info: {str(e)}")
        return ""

def combine_junior_profile(guidance_request):
    """
    Combines junior user's guidance request information
    """
    try:
        learning_goals = " ".join(guidance_request.get("learningGoals", {}).get("primaryTopics", []))
        specific_skills = " ".join(guidance_request.get("learningGoals", {}).get("specificSkills", []))
        tech_experience = " ".join(guidance_request.get("backgroundInfo", {}).get("technicalExperience", []))
        strengths = " ".join(guidance_request.get("backgroundInfo", {}).get("strengths", []))
        preferred_skills = " ".join(
            guidance_request.get("expectationsFromSenior", {})
            .get("preferredSeniorProfile", {})
            .get("specificSkills", [])
        )
        
        return f"Learning goals: {learning_goals}, Specific skills: {specific_skills}, Tech experience: {tech_experience}, Strengths: {strengths}, Preferred mentor skills: {preferred_skills}"
    except Exception as e:
        print(f"Error in combine_junior_profile: {str(e)}")
        return ""

@app.route('/findmentors', methods=['POST'])
def find_mentors():
    try:
        # Get guidance request from POST data
        guidance_request = request.json
        
        if not guidance_request:
            return jsonify({"error": "No guidance request data provided"}), 400
            
        # Generate embeddings for all users
        user_embeddings = []
        valid_users = []
        
        for user in users:
            profile_text = combine_senior_profile_info(user)
            if profile_text.strip():  # Only include users with valid profile text
                embedding = model.encode(profile_text)
                user_embeddings.append(embedding)
                valid_users.append(user)
        
        # Generate embedding for junior's guidance request
        junior_profile_text = combine_junior_profile(guidance_request)
        junior_embedding = model.encode(junior_profile_text)
        
        # Calculate similarity scores
        similarity_scores = []
        for idx, user in enumerate(valid_users):
            score = cosine_similarity([junior_embedding], [user_embeddings[idx]])[0][0]
            similarity_scores.append({
                "username": user["username"],
                "similarity_score": float(score),
                "profile_info": {
                    "leetcode_rating": user.get("leetcodeInfo", [{}])[0].get("userContestDetails", {}).get("rating"),
                    "contests_attended": user.get("leetcodeInfo", [{}])[0].get("userContestDetails", {}).get("attendedContestsCount"),
                    "github_repos": [
                        {
                            "name": repo.get("name"),
                            "language": repo.get("language"),
                            "description": repo.get("description")
                        }
                        for repo in user.get("githubInfo", [{}])[0].get("repositories", [])
                    ],
                    "linkedin_headline": user.get("linkedinInfo", [{}])[0].get("headline")
                }
            })
        
        # Sort by similarity score and get top 3
        sorted_matches = sorted(similarity_scores, key=lambda x: x["similarity_score"], reverse=True)[:3]
        
        result = {
            "junior_username": guidance_request.get("username"),
            "recommended_mentors": sorted_matches,
            "matching_criteria": {
                "learning_goals": guidance_request.get("learningGoals", {}).get("primaryTopics", []),
                "preferred_skills": guidance_request.get("expectationsFromSenior", {})
                    .get("preferredSeniorProfile", {})
                    .get("specificSkills", [])
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
   

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