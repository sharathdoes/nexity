import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import "./profileleftbar.css";
import image from "../Images/Profile.png";
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Code2, GitFork, Trophy } from 'lucide-react';

const CircularProgress = ({ value, target, color }) => {
  const percentage = Math.min((value / target) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="45" stroke="#1a1a1a" strokeWidth="10" fill="transparent" className="opacity-20" />
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-white mb-1">{Math.round(percentage)}%</span>
        <div className="text-sm text-gray-400">
          <span className="text-blue-400">{value}</span> / {target}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, target, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-xl p-6"
    >
      <h3 className="text-lg font-medium text-gray-200 mb-6 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-blue-400" />
        {label}
      </h3>
      <div className="flex justify-center mx-auto">
        <CircularProgress value={count} target={target} color={color} />
      </div>
    </motion.div>
  );
};

export default function ProfileLeftbar() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const userDetails = useSelector((state) => state.user);
  const user = userDetails.user;
  const [userData, setUserData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    const getUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/post/user/details/${id}`);
        setUserData(res.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [id]);

  useEffect(() => {
    // Fetch metrics from the API
    const getMetrics = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/metrics/user-metrics/${id}`);
        const data = res.data.data;

        setMetrics([
          { icon: Code2, label: 'LeetCode Rating', value: data.leetcode_rating || 0, target: 4000, color: '#3b82f6' },
          { icon: GitFork, label: 'Repositories', value: data.repository_count || 0, target: 200, color: '#3b82f6' },
          { icon: Trophy, label: 'Contests', value: data.contests_attended || 0, target: 500, color: '#3b82f6' }
        ]);
      } catch (error) {
        console.log("Error fetching metrics:", error);
      }
    };

    getMetrics();
  }, [id]);

  if (loading) {
    return (
      <div className="ProfileLeftbar">
        <div className="NotificationsContainer bg-black p-6 text-center">
          <p className="text-white">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ProfileLeftbar">
      <div className="NotificationsContainer bg-black">
        <img src={image} className="ProfilepageCover" alt="Profile Cover" />
        <div className="flex items-center -mt-8 px-6">
          {userData?.profile ? (
            <>
              <img src={userData.profile} className="w-16 h-16 rounded-full border-4 border-black" alt="Profile" />
              <div className="ml-4">
                <p className="text-xl font-semibold text-white">{userData.username || "Sharath"}</p>
                <p className="text-sm text-gray-400">Software Developer</p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid gap-6 p-6">
          {metrics ? (
            metrics.map((metric) => (
              <MetricCard key={metric.label} icon={metric.icon} label={metric.label} value={metric.value} target={metric.target} color={metric.color} />
            ))
          ) : (
            <p>Loading metrics...</p>
          )}
        </motion.div>
        <div className="px-6 pb-6">
          <Link to={`/user/${userData._id}/followers`} className="text-sm text-blue-400 hover:underline">
            View Followers
          </Link>
        </div>
      </div>
    </div>
  );
}
