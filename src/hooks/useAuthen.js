import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuthenContext } from "../contexts/AuthenContext";

const useAuthen = () => {
    const { setAuthUser, setAccessToken, setRefreshToken } = useAuthenContext();
    const valuesErrorRegister = {
        USERNAME_LENGTH: 'Tên đăng nhập phải lớn hơn 6 kí tự',
        USERNAME_SPACE: 'Tên đăng nhập không được chứa khoảng trắng',
        USERNAME_EXIST: 'Tên đăng nhập đã tồn tại',
        PASSWORD_LENGTH: 'Mật khẩu phải ít nhất 8 kí tự và có ít nhất 1 chữ cái, 1 chữ số và 1 kí tự đặc biệt',
        FULLNAME_SPECIAL: 'Họ và tên không được chứa kí tự đặc biệt',
        AGE: 'Phải trên 15 tuổi',
        FULLNAME_LENGTH: 'Họ và tên không được quá 100 kí tự'
    }
    const [errorRegister, setErrorRegister] = useState([]);
    const typeCheckRegister = { userName: 'userName', password: 'password', fullName: 'fullName', dob: 'dob' };

    const login = async (userName, password) => {
        try {
            const respone = await axiosInstance.post('/auth/login', { userName, password });
            const data = respone.data;

            if (data.status === 200) {
                setAuthUser(data.data.userRespone);
                setAccessToken(data.data.accessToken);
                setRefreshToken(data.data.refreshToken);
            }
            return data;
        } catch (error) {
            console.log("Error at useAuthen -> login: ", error);
        }
    }
    const checkUserName = async (userName) => {
        try {
            const respone = await axiosInstance.post('/auth/check-username', { userName });
            return respone.data;
        } catch (error) {
            console.log("Error at useAuthen -> checkUserName: ", error);
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
    const checkValueRegister = async (userName, password, fullName, dob, typeCheck) => {
        let newErrors = [...errorRegister];

        if (userName !== '' && typeCheck === typeCheckRegister.userName) {
            newErrors = newErrors.filter(
                error => error !== valuesErrorRegister.USERNAME_LENGTH
                    && error !== valuesErrorRegister.USERNAME_SPACE
                    && error !== valuesErrorRegister.USERNAME_EXIST);
            if (userName.length < 6) {
                newErrors.push(valuesErrorRegister.USERNAME_LENGTH);
            }
            if (userName.includes(' ')) {
                newErrors.push(valuesErrorRegister.USERNAME_SPACE);
            }
            const checkUserNameRegister = await checkUserName(userName);
            if (checkUserNameRegister.data) {
                newErrors.push(valuesErrorRegister.USERNAME_EXIST);
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
    const register = async (userName, password, fullName, gender, dob) => {
        try {
            const respone = await axiosInstance.post('/auth/register', { userName, password, fullName, gender, dob });
            return respone.data;
        } catch (error) {
            console.log("Error at useAuthen -> register: ", error);
        }
    }
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
    return {
        login,
        checkUserName,
        checkValueRegister,
        errorRegister,
        valuesErrorRegister,
        register,
        typeCheckRegister,
        logout
    };
}

export default useAuthen;