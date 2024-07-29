import React, { useEffect, useState } from 'react';
import { BsShieldLock, BsPersonCircle, BsQuestionCircle } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Datepicker from "react-tailwindcss-datepicker";
import { Navigate } from 'react-router-dom';
import useAuthen from '../../hooks/useAuthen';
import Footer from '../../layouts/Footer';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';

const Authen = ({ }) => {
  const [errorLogin, setErrorLogin] = useState([]);
  const valuesErrorLogin = {
    EMAILLOGIN: 'Tài khoản không tồn tại',
    PASSWORDLOGIN: 'Sai mật khẩu',
  }
  // value of modalLogin
  const [emailLogin, setEmailLogin] = useState('');
  const [passWordLogin, setPassWordLogin] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true)
  const [authUser, setAuthUser] = useState(false);
  // value of modalRegister
  const [emailRegister, setEmailRegister] = useState('');
  const [passWordRegister, setPassWordRegister] = useState('');
  const [fullNameRegister, setFullNameRegister] = useState('');
  const [DOBRegister, setDOBRegister] = useState('');
  const [genderRegister, setGenderRegister] = useState('');

  // value of hook
  const { login, checkValueRegister, errorRegister, valuesErrorRegister, register, typeCheckRegister, handleLoginWithGoogle } = useAuthen();
  // value loading
  const [loading, setLoading] = useState(false);


  const clearValues = () => {
    setEmailLogin('');
    setPassWordLogin('');
    setEmailRegister('');
    setPassWordRegister('');
    setFullNameRegister('');
    setDOBRegister('');
    setGenderRegister('');
  }
  const funcationLogin = async (userName, password) => {
    setErrorLogin([]);
    const response = await login(userName, password);

    let newErrors = [];
    if (response.status === 404) {
      newErrors.push(valuesErrorLogin.EMAILLOGIN);
    }
    if (response.status === 400) {
      newErrors.push(valuesErrorLogin.PASSWORDLOGIN);
    }
    setErrorLogin(newErrors);
    if (response.status === 200) {
      toast.success('Đăng nhập thành công');
      setErrorLogin([]);
      setLoading(false);
      clearValues();
      setAuthUser(true);
    }
    setLoading(false);
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin([]);
    if (emailLogin === '' || passWordLogin === '') {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    funcationLogin(emailLogin, passWordLogin);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCheckValueRegister = (typeCheck) => {
    checkValueRegister(emailRegister, passWordRegister, fullNameRegister, DOBRegister.startDate, typeCheck);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (emailRegister === '' || passWordRegister === '' || fullNameRegister === ''
      || DOBRegister === '' || genderRegister === '') {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (errorRegister.length <= 0) {
      const response = await register(emailRegister, passWordRegister, fullNameRegister, genderRegister, DOBRegister.startDate);
      console.log('response', response);
      setLoading(true);
      if (response.status === 201) {
        toast.success('Đăng ký thành công');
        funcationLogin(emailRegister, passWordRegister);
      }
      setLoading(false);
    }
  }

  const handleGenderChange = (e) => {
    setGenderRegister(e.target.value);
  };
  const handleDateChange = (dob) => {
    setDOBRegister(dob);
    checkValueRegister(emailRegister, passWordRegister, fullNameRegister, dob.startDate, typeCheckRegister.dob);
  };
  const renderError = (errorArray, errorValue) => {
    return errorArray.map((error, index) => (
      error === errorValue &&
      <div key={index} className={isLogin ? 'pl-6' : 'pl-2'}>
        <p className='text-red-500 font-semibold'>{error}</p>
      </div >
    ))
  }
  if (authUser) {
    return <Navigate to='/' replace={true} />;
  }
  const handleGoogleLoginClick = (e) => {
    e.preventDefault();
    handleLoginWithGoogle();
  };
  
  return (
    <div className='h-svh'>
      {isLogin ?
        <div className='flex flex-col items-center justify-evenly h-2/3'>
          <p className='font-bold text-3xl text-center font-roboto'>ĐĂNG NHẬP</p>
          <form onSubmit={handleLogin} className="w-1/3">
            {emailLogin && <label className="font-medium text-base mb-3">Email</label>}
            <div className='flex flex-row justify-between items-center'>
              <BsPersonCircle />
              <input
                type="text"
                placeholder="Email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                className="w-full m-2 p-2 border rounded-lg hover:border-gray-500 hover:border-2"
              />
            </div>
            {errorLogin.length > 0 && renderError(errorLogin, valuesErrorLogin.EMAILLOGIN)}

            {passWordLogin && <label className='font-medium text-base mb-3'>Mật khẩu</label>}
            <div className='flex flex-row justify-between items-center'>
              <BsShieldLock />
              <div className="relative m-2 w-full">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={passWordLogin}
                  onChange={(e) => setPassWordLogin(e.target.value)}
                  className="p-2 border w-full rounded-lg hover:border-gray-500 hover:border-2"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1  px-2 py-1 rounded text-gray-500 hover:text-gray-900 font-medium"
                >
                  {isPasswordVisible ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
            {errorLogin.length > 0 && renderError(errorLogin, valuesErrorLogin.PASSWORDLOGIN)}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p className='pb-2 font-medium'> Hoặc đăng nhập với</p>
              <div className='flex flex-row items-center justify-between w-20'>
                <div className='m-2'>
                  {/* <GoogleLogin
                    onSuccess={handleLoginGG}
                    onFailure={handleLoginGG}
                  /> */}
                </div>
                <button onClick={handleGoogleLoginClick}><FcGoogle size={30} color='#0066cc' /></button>
                <FaFacebookSquare size={30} color='#0066cc' />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 p-2 bg-slate-950 text-white rounded-lg hover:bg-gray-600 w-full font-inter">
              {loading
                ? <BeatLoader color="white" size={7} margin={2} />
                : 'Đăng nhập'}
            </button>
          </form>
          <div className='w-1/2 flex flex-row items-center justify-center'>
            <BsQuestionCircle />
            <p className='px-2'>Bạn chưa có tài khoản? </p>
            <button
              type="submit"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold font-inter hover:text-gray-500">
              Đăng ký
            </button>
          </div>
        </div>
        :
        <div className='flex flex-col items-center h-3/4 justify-evenly'>
          <p className='font-bold text-3xl text-center font-roboto'>ĐĂNG KÝ</p>
          <form onSubmit={handleRegister} className="w-3/6">
            <div className='flex flex-row justify-evenly items-start mb-2'>
              <div className='flex items-start justify-start w-1/5'>
                <label className='font-semibold'>Tên đăng nhập</label>
              </div>
              <div className='w-4/6 flex flex-col'>
                <input
                  type="text"
                  placeholder="Không chứa khoảng trắng, ít nhất 6 kí tự"
                  value={emailRegister}
                  onBlur={() => handleCheckValueRegister(typeCheckRegister.email)}
                  onChange={(e) => setEmailRegister(e.target.value)}
                  className="p-2 border  rounded-lg hover:border-gray-500 hover:border-2"
                />
                {errorRegister.length > 0 && (renderError(errorRegister, valuesErrorRegister.EMAIL_INVALID))}
                {errorRegister.length > 0 && (renderError(errorRegister, valuesErrorRegister.EMAIL_EXIST))}
              </div>

            </div>
            <div className='flex flex-row justify-evenly items-center my-6'>
              <div className='flex items-start w-1/5'>
                <label className='font-semibold'>Mật khẩu</label>
              </div>
              <div className="relative w-4/6">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Ít nhát 8 kí tự, có ít nhát 1 chữ số và 1 kí tự đặc biệt"
                  value={passWordRegister}
                  onChange={(e) => setPassWordRegister(e.target.value)}
                  onBlur={() => handleCheckValueRegister(typeCheckRegister.password)}
                  className="p-2 border w-full rounded-lg hover:border-gray-500 hover:border-2"
                />
                {errorRegister.length > 0 && renderError(errorRegister, valuesErrorRegister.PASSWORD_LENGTH)}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1  px-2 py-1 rounded text-gray-500 hover:text-gray-900 font-medium"
                >
                  {isPasswordVisible ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>
            <div className='flex flex-row justify-evenly items-start mb-2'>
              <div className='flex items-start justify-start w-1/5'>
                <label className='font-semibold'>Họ và tên</label>
              </div>
              <div className='w-4/6 flex flex-col'>
                <input
                  type="text"
                  placeholder="Không chứa kí tự đặc biệt"
                  value={fullNameRegister}
                  onChange={(e) => setFullNameRegister(e.target.value)}
                  onBlur={() => handleCheckValueRegister(typeCheckRegister.fullName)}
                  className="p-2 border rounded-lg hover:border-gray-500 hover:border-2"
                />
                {errorRegister.length > 0 &&
                  renderError(errorRegister, valuesErrorRegister.FULLNAME_SPECIAL)
                  || renderError(errorRegister, valuesErrorRegister.FULLNAME_LENGTH)}
              </div>
            </div>
            <div className='flex flex-row justify-evenly items-center my-6'>
              <div className='flex items-start w-1/5'>
                <label className='font-semibold'>Giới tính</label>
              </div>
              <div className='w-4/6 flex flex-row'>
                <div className='w-14 flex justify-evenly items-center'>
                  <input type="radio" id='female' value="FEMALE" name='gender' checked={genderRegister === 'FEMALE'}
                    onChange={handleGenderChange}></input>
                  <label>Nữ</label>
                </div>
                <div className='w-14 flex justify-evenly items-center'>
                  <input type="radio" id='male' value="MALE" name='gender' checked={genderRegister === 'MALE'}
                    onChange={handleGenderChange}></input>
                  <label>Nam</label>
                </div>
              </div>
            </div>
            <div className='flex flex-row justify-evenly items-center my-6'>
              <div className='flex items-start w-1/5'>
                <label className='font-semibold'>Ngày sinh</label>
              </div>
              <div className='w-4/6 flex flex-row'>
                <div className='w-3/6 flex justify-start'>
                  <Datepicker
                    minDate={new Date('1950-01-01')}
                    primaryColor={"fuchsia"}
                    useRange={false}
                    asSingle={true}
                    value={DOBRegister}
                    onChange={handleDateChange}
                    displayFormat={"DD/MM/YYYY"}
                    inputClassName="w-full rounded-lg focus:ring-0 font-inter bg-white dark:placeholder:text-black"
                  />
                </div>
                {errorRegister.length > 0 && renderError(errorRegister, valuesErrorRegister.AGE)}
              </div>
            </div>
            <div className='flex justify-center w-full'>
              <button
                type="submit"
                className="p-2 bg-slate-950 text-white rounded-lg hover:bg-gray-600 w-1/2 font-inter">
                {loading
                  ? <BeatLoader color="white" size={7} margin={2} />
                  : 'Đăng ký'}
              </button>
            </div>
          </form>
          <div className='flex flex-row items-center'>
            <BsQuestionCircle />
            <p className='px-2'>Bạn đã có tài khoản? </p>
            <button
              type="submit"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold font-inter hover:text-gray-500">
              Đăng nhập
            </button>
          </div>
        </div>
      }
      <div className='mt-14'>
        <Footer />
      </div>
      {/* </Modal > */}
    </div>
  );

}

export default Authen;
