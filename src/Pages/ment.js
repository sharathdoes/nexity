import React, { useState } from 'react';
import './ment.css';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    learningGoals: {
      primaryTopics: [],
      specificSkills: [],
    },
    backgroundInfo: {
      technicalExperience: [],
      strengths: [],
    },
    expectationsFromSenior: {
      preferredSeniorProfile: {
        experienceLevel: '',
        contestsAttended: '',
        specificSkills: [],
      }
    }
  });

  const [responseData, setResponseData] = useState(null);

  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (section === "backgroundInfo") {
        setFormData(prevState => ({
          ...prevState,
          backgroundInfo: {
            ...prevState.backgroundInfo,
            [name]: checked
              ? [...prevState.backgroundInfo[name], value]
              : prevState.backgroundInfo[name].filter(item => item !== value)
          }
        }));
      } else if (section === "seniorSkills") {
        setFormData(prevState => ({
          ...prevState,
          expectationsFromSenior: {
            ...prevState.expectationsFromSenior,
            preferredSeniorProfile: {
              ...prevState.expectationsFromSenior.preferredSeniorProfile,
              specificSkills: checked
                ? [...prevState.expectationsFromSenior.preferredSeniorProfile.specificSkills, value]
                : prevState.expectationsFromSenior.preferredSeniorProfile.specificSkills.filter(item => item !== value)
            }
          }
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/findmentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
      setResponseData({ error: 'Something went wrong. Please try again later.' });
    }
  };

  const renderApiResponse = (data) => {
    if (!data) return null;

    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="api-response-item">
        <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Profile Information</h2>

          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Primary Topics (comma-separated)</label>
            <input
              type="text"
              value={formData.learningGoals.primaryTopics.join(', ')}
              onChange={(e) => {
                setFormData(prevState => ({
                  ...prevState,
                  learningGoals: {
                    ...prevState.learningGoals,
                    primaryTopics: e.target.value.split(',').map(topic => topic.trim())
                  }
                }));
              }}
            />
          </div>

          <div className="form-field">
            <label>Specific Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.learningGoals.specificSkills.join(', ')}
              onChange={(e) => {
                setFormData(prevState => ({
                  ...prevState,
                  learningGoals: {
                    ...prevState.learningGoals,
                    specificSkills: e.target.value.split(',').map(skill => skill.trim())
                  }
                }));
              }}
            />
          </div>

          <div className="form-field">
            <label>Technical Experience</label>
            <div className="checkbox-container">
              {['HTML', 'CSS', 'JavaScript', 'Python'].map((tech) => (
                <label key={tech}>
                  <input
                    type="checkbox"
                    name="technicalExperience"
                    value={tech}
                    checked={formData.backgroundInfo.technicalExperience.includes(tech)}
                    onChange={(e) => handleChange(e, "backgroundInfo")}
                  />
                  {tech}
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Strengths</label>
            <div className="checkbox-container">
              {['Web development basics', 'Data structures'].map((strength) => (
                <label key={strength}>
                  <input
                    type="checkbox"
                    name="strengths"
                    value={strength}
                    checked={formData.backgroundInfo.strengths.includes(strength)}
                    onChange={(e) => handleChange(e, "backgroundInfo")}
                  />
                  {strength}
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Experience Level</label>
            <input
              type="text"
              value={formData.expectationsFromSenior.preferredSeniorProfile.experienceLevel}
              onChange={(e) => {
                setFormData(prevState => ({
                  ...prevState,
                  expectationsFromSenior: {
                    ...prevState.expectationsFromSenior,
                    preferredSeniorProfile: {
                      ...prevState.expectationsFromSenior.preferredSeniorProfile,
                      experienceLevel: e.target.value
                    }
                  }
                }));
              }}
            />
          </div>

          <div className="form-field">
            <label>Contests Attended</label>
            <input
              type="number"
              value={formData.expectationsFromSenior.preferredSeniorProfile.contestsAttended}
              onChange={(e) => {
                setFormData(prevState => ({
                  ...prevState,
                  expectationsFromSenior: {
                    ...prevState.expectationsFromSenior,
                    preferredSeniorProfile: {
                      ...prevState.expectationsFromSenior.preferredSeniorProfile,
                      contestsAttended: e.target.value
                    }
                  }
                }));
              }}
            />
          </div>

          <button type="submit">Submit</button>
        </form>

        {responseData && (
  <div className="response-container">
    <h3>Recommended Mentor Usernames</h3>
    <ul>
      {responseData.recommended_mentors.map((mentor, index) => (
        <li key={index} className="api-response-item">
          {mentor.username}
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default ProfileForm;
