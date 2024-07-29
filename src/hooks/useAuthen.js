import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuthenContext } from "../contexts/AuthenContext";
import { useGoogleLogin } from "@react-oauth/google";

const useAuthen = () => {
    const { setAuthUser, setAccessToken, setRefreshToken } = useAuthenContext();
    const valuesErrorRegister = {
        EMAIL_INVALID: 'Email không hợp lệ',
        EMAIL_EXIST: 'Tên đăng nhập đã tồn tại',
        PASSWORD_LENGTH: 'Mật khẩu phải ít nhất 8 kí tự và có ít nhất 1 chữ cái, 1 chữ số và 1 kí tự đặc biệt',
        FULLNAME_SPECIAL: 'Họ và tên không được chứa kí tự đặc biệt',
        AGE: 'Phải trên 15 tuổi',
        FULLNAME_LENGTH: 'Họ và tên không được quá 100 kí tự'
    }
    const [errorRegister, setErrorRegister] = useState([]);
    const typeCheckRegister = { email: 'email', password: 'password', fullName: 'fullName', dob: 'dob' };

    const login = async (email, password) => {
        try {
            const respone = await axiosInstance.post('/auth/login', { email, password });
            const data = respone.data;

            if (data.status === 200) {
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

    const register = async (email, password, fullName, gender, dob) => {
        try {
            const respone = await axiosInstance.post('/auth/register', { email, password, fullName, gender, dob });
            return respone.data;
        } catch (error) {
            console.log("Error at useAuthen -> register: ", error);
        }
    }

    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const { access_token } = codeResponse;
            try {
                const response = await axiosInstance.post('/auth/google-login', { token: access_token });
                // console.log('Backend Response:', response.data);

                const { email, id, name } = response.data;

                const registerResponse = await register(email, id, name, null, null)
                // console.log('Register Response:', registerResponse);
                
                if(registerResponse.status === 400) {
                    console.log('Email đã tồn tại, đang thực hiện đăng nhập...');
                    await login(email, id);
                    return;
                }
                if (registerResponse.status === 201) {
                    await login(data.email, data.id);
                }

            } catch (error) {
                console.error('Error sending token to backend:', error);
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const logout = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('refreshToken'));
            if (token) {
                const respone = await axiosInstance.post('/auth/logout', { token });
                const data = respone.data;
                if (data.status === 200) {
                    localStorage.clear();
                    window.location.reload();
                }
                return data;
            }
        } catch (error) {
            console.log("Error at useAuthen -> logout: ", error);

        }
    }
    const isAtLeastFifteenYearsOld = (DOBRegister) => {
        const currentDate = new Date();
        const dob = new Date(DOBRegister);
        let age = currentDate.getFullYear() - dob.getFullYear();
        const m = currentDate.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;
        }

        return age >= 15;
    }

    const checkValueRegister = async (email, password, fullName, dob, typeCheck) => {
        let newErrors = [...errorRegister];

        if (email !== '' && typeCheck === typeCheckRegister.email) {
            newErrors = newErrors.filter(
                error => error !== valuesErrorRegister.EMAIL_INVALID
                    && error !== valuesErrorRegister.EMAIL_EXIST);
            if (email.length > 20 || !email.trim().toLowerCase().endsWith("@gmail.com")) {
                newErrors.push(valuesErrorRegister.EMAIL_INVALID);
            }
            const checkUserNameRegister = await checkEmail(email);
            if (checkUserNameRegister.data) {
                newErrors.push(valuesErrorRegister.EMAIL_EXIST);
            }
        }
        if (password !== '' && typeCheck === typeCheckRegister.password) {
            newErrors = newErrors.filter(error => error !== valuesErrorRegister.PASSWORD_LENGTH);
            if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
                newErrors.push(valuesErrorRegister.PASSWORD_LENGTH);
            }
        }
        if (fullName !== '' && typeCheck === typeCheckRegister.fullName) {
            newErrors = newErrors.filter(error => error !== valuesErrorRegister.FULLNAME_SPECIAL);
            if (!fullName.match(/^[\p{L}\p{N}\s]+$/u)) {
                newErrors.push(valuesErrorRegister.FULLNAME_SPECIAL);
            }
            if (fullName.length > 100) {
                newErrors.push(valuesErrorRegister.FULLNAME_LENGTH);
            }
        }
        if (dob && typeCheck === typeCheckRegister.dob) {
            newErrors = newErrors.filter(error => error !== valuesErrorRegister.AGE);
            if (!isAtLeastFifteenYearsOld(dob)) {
                newErrors.push(valuesErrorRegister.AGE);
            }
        }
        if (newErrors.length === 0) {
            setErrorRegister([]);
        }
        setErrorRegister(newErrors);
    }
    return {
        login,
        checkEmail,
        checkValueRegister,
        errorRegister,
        valuesErrorRegister,
        handleLoginWithGoogle,
        register,
        typeCheckRegister,
        logout
    };
}

export default useAuthen;