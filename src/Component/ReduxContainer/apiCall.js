import axios from "axios";
import { loginStart, loginSuccess, loginFailure, logout } from "./userReducer";

// Define the base URL for local development
const BASE_URL = "http://localhost:3000/api/user";  // Update this to your local backend URL

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${BASE_URL}/login`, user);
    dispatch(loginSuccess(res.data));
    console.log(res.data)
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const VerifyEmail = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${BASE_URL}/verify/email`, user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const signup = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${BASE_URL}/create/user`, user);
    dispatch(loginSuccess(res.data));
    console.log(res.data,"hi res");
  } catch (error) {
    dispatch(loginFailure());
    console.log(error)
  }
};
