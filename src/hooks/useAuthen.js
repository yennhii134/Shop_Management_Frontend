import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuthenContext } from "../contexts/AuthenContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const useAuthen = () => {
    const { setAuthUser, setAccessToken, setRefreshToken } = useAuthenContext();

    const login = async (userRequest) => {
        try {
            const respone = await axiosInstance.post('/auth/login', userRequest);
            const data = respone.data;

            if (data.code === 200) {
                console.log('Login Success:', data);
                setAuthUser(data.data.userRespone);
                setAccessToken(data.data.accessToken);
                setRefreshToken(data.data.refreshToken);
                window.location.href = '/';
            }
            return data;
        } catch (error) {
            console.log("Error at useAuthen -> login: ", error);
        }
    }
    const checkEmail = async (email) => {
        try {
            const respone = await axiosInstance.post('/auth/check-email', { email });
            return respone.data;
        } catch (error) {
            console.log("Error at useAuthen -> checkEmail: ", error);
        }
    }

    const register = async (userCreateRequest) => {
        try {
            const respone = await axiosInstance.post('/auth/register', userCreateRequest);
            return respone.data;
        } catch (error) {
            console.log("Error at useAuthen -> register: ", error);
        }
    }

    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const { access_token } = codeResponse;

            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                console.log('User Info:', userInfo.data);
                const { email, sub, name } = userInfo.data;

                try {
                    const registerResponse = await register({
                        email: email,
                        password: sub,
                        fullName: name,
                    });

                    if (registerResponse.code === 201 || registerResponse.code === 1005) {
                        await login({ email: email, password: sub });
                    }

                } catch (registerError) {
                    console.error('Error during registration:', registerError);
                }
            } catch (authError) {
                console.error('Error sending token to backend:', authError);
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const handleLoginWithFacebook = async (provider, data) => {
        const { accessToken, userID } = data;
        try {
            const response = await axios.get(`https://graph.facebook.com/v10.0/${userID}`, {
                params: {
                    fields: 'id,name,picture',
                    access_token: accessToken
                }
            });
            console.log('User data:', response.data);

            if (response.data.error) {
                console.log('Error while login with Facebook:', response.data.error);
                return;
            }

            const { id, name, picture } = response.data;

            try {
                const registerResponse = await register({
                    facebookId: id,
                    password: id,
                    fullName: name
                });
                if (registerResponse.code === 201 || registerResponse.code === 1005) {
                    await login({ facebookId: id, password: id });
                }
            } catch (registerError) {
                console.error('Error during registration:', registerError);
            }
        } catch (error) {
            console.error('Error sending token:', error);
        }
    };

    const logout = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('refreshToken'));
            if (token) {
                const respone = await axiosInstance.post('/auth/logout', { token });
                if (respone.status === 200) {
                    localStorage.clear();
                    window.location.reload();
                }
                return data;
            }
        } catch (error) {
            console.log("Error at useAuthen -> logout: ", error);

        }
    }

    return {
        login,
        checkEmail,
        handleLoginWithGoogle,
        handleLoginWithFacebook,
        register,
        logout,
    };
}

export default useAuthen;