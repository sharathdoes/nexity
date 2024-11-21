# Nexity App

Nexity is a platform designed to connect students with like-minded individuals and mentors using advanced machine learning algorithms. The app leverages user data from platforms like GitHub, LinkedIn, and LeetCode to match users based on their skills, interests, and profiles. It uses powerful Natural Language Processing (NLP) models, including BERT transformers and vector embeddings, to match users with the most relevant mentors or peers.

## Features

- **User Matching**: Match students with mentors or like-minded peers using machine learning algorithms.
- **GitHub, LinkedIn, and LeetCode Integration**: Fetch user profiles from popular platforms to gather skills, repositories, achievements, and more.
- **Vector Embeddings**: Uses `Word2Vec` or custom vector embeddings to represent user profiles.
- **BERT Transformer**: Leverages the power of BERT transformers to analyze user data and perform accurate similarity matching.
- **Similarity Search**: Finds users with the highest similarity to each other, based on their profiles and activity.

## Technologies Used

### Frontend (MERN Stack)
- **MongoDB**: NoSQL database for storing user data and profiles.
- **Express.js**: Web framework for building RESTful APIs.
- **React.js**: JavaScript library for building the user interface.
- **Node.js**: JavaScript runtime environment for backend services.

### Machine Learning & NLP
- **Streamlit**: For building the user interface and enabling interactive experiences.
- **Machine Learning**: Utilizes `Word2Vec`, `BERT`, and other algorithms for creating user profiles and matching them.
- **APIs**: Fetches user data from GitHub, LinkedIn, and LeetCode to build comprehensive profiles.
- **FAISS**: For efficient similarity search and storing embeddings.
- **Pandas and NumPy**: For handling and processing user data.
- **Hugging Face Transformers**: For utilizing BERT models and embeddings.
- **Flask**: For backend API integration.

## Matching Algorithm

The matching algorithm works as follows:
1. **Profile Extraction**: User profiles are extracted from GitHub, LinkedIn, and LeetCode via APIs.
2. **Text Preprocessing**: Text data from these profiles (skills, repositories, articles, etc.) is preprocessed and vectorized using `Word2Vec` or other embeddings.
3. **Similarity Calculation**: BERT transformers and similarity search (using FAISS) are used to calculate the similarity between different users.
4. **Matching**: Based on the similarity score, the app recommends users with the highest match.
