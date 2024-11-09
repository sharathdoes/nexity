// controllers/userController.js
const https = require('https');
const User = require('../Modals/User');
const bcrypt = require('bcrypt'); // For hashing the password

const fetchLinkedInInfo = (username) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'linkedin-api8.p.rapidapi.com',
      path: `/?username=${username}`,
      headers: {
        'x-rapidapi-key': "24a84c5d7fmsh8b5c80444d11f54p19a3fajsn4b7ee3f090b6",
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
      res.on('error', (err) => reject(err));
    });
    req.end();
  });
};

const fetchLeetCodeInfo = (username) => {
  return new Promise((resolve, reject) => {
    https.get(`https://leetcodeapi-v1.vercel.app/contest/${username}`, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
      res.on('error', (err) => reject(err));
    });
  });
};


// Function to fetch GitHub repository info
const fetchGitHubInfo = (username) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'github-repos.p.rapidapi.com',
      path: `/search?user=${username}`,  // Dynamic username in the path
      headers: {
        'x-rapidapi-key': '5e6758784fmshd4cc117c6a9349bp1b2c02jsnc288163ef483',  // Replace with your actual API key
        'x-rapidapi-host': 'github-repos.p.rapidapi.com',
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      // Collect data as it comes in
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // Once the response ends, process the data
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          // Parse the JSON response
          const data = JSON.parse(body);
          resolve(data);  // Resolve with the fetched GitHub data
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(error);  // Reject the promise if JSON parsing fails
        }
      });

      // Handle potential errors with the request
      res.on('error', (err) => {
        console.error('Request error:', err);
        reject(err);  // Reject if there was an error with the request
      });
    });

    req.end();  // Send the request
  });
};

module.exports = { fetchGitHubInfo };


const updateUserInfo = async (req, res) => {
    const { username, password, role, leetcodeUsername, githubUsername, linkedinUsername } = req.body;
  
    try {
      // Create a new user directly with the provided data
      const newUser = new User({
        username,
        password,
        role,
        leetcodeInfo: [],
        githubInfo: [],
        linkedinInfo: []
      });
  
      // Fetch additional info from external APIs
      const linkedInData = await fetchLinkedInInfo(linkedinUsername);
      const leetCodeData = await fetchLeetCodeInfo(leetcodeUsername);
      const githubData = await fetchGitHubInfo(githubUsername);
  
      // Add API data to the user's profile
      newUser.linkedinInfo.push(linkedInData);
      newUser.leetcodeInfo.push(leetCodeData);
      newUser.githubInfo.push(githubData);
  
      // Save the new user data to the database
      await newUser.save();
      res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create user info', error });
    }
  };
  

module.exports = { updateUserInfo };
