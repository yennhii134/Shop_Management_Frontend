import React, { useState } from 'react'
import { BsSearchHeart, BsBagHeart, BsPersonHeart, BsChatHeart } from "react-icons/bs";
import { LiaBarsSolid, LiaUserCircleSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useAuthenContext } from '../../contexts/AuthenContext';
import 'flowbite';
import { ClipLoader } from 'react-spinners';
import useAuthen from '../../hooks/useAuthen';
import toast from 'react-hot-toast';

const Header = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuthen();
    const dropDrownValues = { User: 'User', Menu: 'Menu', }
    const [dropdown, setDropdown] = useState('');
    const { authUser } = useAuthenContext();

    const Button = ({ icon, onClick, isNotification }) => {
        return (
            <button
                onClick={onClick}
                className={`${isNotification && 'relative'} hover:bg-gray-300 rounded-full px-1 border-2`}>
                {isNotification && (
                    <div className='bg-black rounded-full size-4 flex items-center justify-center absolute top-1 left-6 '>
                        <p className='text-white text-xs'>0</p>
                    </div>
                )}
                <div className='w-8 h-10 flex items-center justify-center'>
                    {icon}
                </div>
            </button>
        )
    }
    const DropDrow = ({ title, icon, onClick, loading, link }) => {

        return (
            <li className='w-full hover:bg-gray-100'>
                <a href={link} className='w-full'>
                    <button
                        type="submit"
                        className={`${dropdown === dropDrownValues.Menu ? 'w-4/5' : 'w-full'} px-4 py-2 flex flex-row w-4/5 justify-evenly`}
                        onClick={onClick}>
                        <div className='w-2/12'>
                            {(isLoading && loading) ? <ClipLoader size={18} color="#000000" speedMultiplier={1} /> : icon}
                        </div>
                        <div className='w-4/5 font-semibold hover:font-bold'>
                            {title}
                        </div>
                    </button>
                </a>
            </li >
        )
    }
    const handleLogout = async () => {
        setIsLoading(true);
        const data = await logout();
        if (data.status === 200) {
            toast.success('Đăng xuất thành công');
        }
        setIsLoading(false);
    }
    const checkAuthUser = () => {
        if (!authUser) {
            toast.error('Vui lòng đăng nhập để xem giỏ hàng');
        } else {
            window.location.href = '/carts';
        }
    }

    return (
        <nav className="py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="relative flex items-center space-x-2 w-1/4"
                    onMouseEnter={() => setDropdown(dropDrownValues.Menu)} onMouseLeave={() => setDropdown('')}>
                    <button>
                        <LiaBarsSolid size={30} />
                    </button>
                    {dropdown === dropDrownValues.Menu && (
                        <div
                            className="absolute left-0 top-6 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <DropDrow link='#' title='Bộ sưu tập' />
                                <DropDrow link='/products' title='Sản phẩm' />
                                <DropDrow link='#' title='Liên hệ' />
                            </ul>
                        </div>
                    )}
                </div>
                {/* Navigation links */}
                <a className="flex space-x-4 " href='/'>
                    {/* <img src="./bag-logo.png" alt="Logo" className="h-8 w-8" /> */}
                    <p className='font-logo text-3xl pr-40'>Bags Shop</p>
                </a>
                {/* Fields */}
                <div className='flex space-x-4'>
                    <Button icon={<BsSearchHeart size={22} />} />
                    <Button icon={<BsChatHeart size={22} />} isNotification />
                    {/* <a href='/carts'> <Button icon={<BsBagHeart size={22} />} isNotification /></a> */}
                    <Button icon={<BsBagHeart size={22} />} isNotification onClick={checkAuthUser} />
                    {authUser ? (
                        <div className='relative' onMouseEnter={() => setDropdown(dropDrownValues.User)} onMouseLeave={() => setDropdown('')}>
                            <button
                                className="focus:ring-4 focus:outline-none
                                    rounded-full px-5 py-2.5 w-25 h-10 flex items-center justify-center
                                     hover:bg-gray-300 hover:text-white hover:font-bold focus:ring-gray-100 border-2"
                                type="button">
                                <p className='font-semibold'>{authUser.fullName}</p>
                            </button>
                            {dropdown === dropDrownValues.User && (
                                <div
                                    className="absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <DropDrow link='#' title='Trang cá nhân' icon={<LiaUserCircleSolid size={18} />} />
                                        <DropDrow link='#' title='Cài đặt' icon={<IoSettingsOutline size={18} />} />
                                        <DropDrow link='#' title='Đăng xuất' icon={<TbLogout2 size={18} />} onClick={handleLogout} loading />
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href='/login'> <Button icon={<BsPersonHeart size={24} />} /></a>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header

