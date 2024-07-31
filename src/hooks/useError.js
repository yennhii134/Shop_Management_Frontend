import { useState } from "react";
import useAuthen from "./useAuthen";

const useError = () => {
    const { checkEmail } = useAuthen();
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
            if (email.length > 100 || !email.trim().toLowerCase().endsWith("@gmail.com")) {
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
        checkValueRegister,
        errorRegister,
        valuesErrorRegister,
        typeCheckRegister,
    };
}
export default useError;