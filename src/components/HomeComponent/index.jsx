import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function App() {
    const swiperRef = useRef(null);

    const imagesSlide = [
        'https://www.vascara.com/uploads/banner/2024/June/28/17511719567688.jpg',
        'https://www.vascara.com/uploads/banner/2024/June/2/17561717290046.jpg',
        'https://www.vascara.com/uploads/banner/2024/July/23/17821721721083.png'
    ];

    const productsSale = [
        {
            id: 1,
            name: 'Keri Backpack',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/ps/20240716_Y4n8WpiV3J.jpeg'
        },
        {
            id: 2,
            name: 'Moonne Bag',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/ps/20240716_bQ5XjzXKzf.jpeg'
        },
        {
            id: 3,
            name: 'Camina Wallet',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/ps/20240716_I9EwvdRqEP.jpeg'
        },
        {
            id: 4,
            name: 'Charis Bag',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/bn/20231208_dOUGt9Xy.gif'
        },
        {
            id: 5,
            name: 'White Bag',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/bn/20231207_p40WcoaY.gif'
        },
        {
            id: 6,
            name: 'Black Bag',
            price: 1000000,
            image: 'https://pos.nvncdn.com/b22375-44395/bn/20231207_d4TP74V0.gif'
        }
    ]
    const ButtonRow = ({ icon, right }) => {
        return (
            <div className={`absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${right && 'right-0'}`}>
                <button className="flex items-center justify-center w-full h-full"
                    onClick={() => right ? swiperRef.current.swiper.slideNext() : swiperRef.current.swiper.slidePrev()}
                >
                    {icon}
                </button>
            </div >
        )
    }
    return (
        <>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                className="w-full h-auto"
            >
                {imagesSlide.map((image, index) => (
                    <SwiperSlide key={index} className='flex items-center justify-center'>
                        <img src={image} alt={`Slide ${index + 1}`} className='object-contain' />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="w-full my-10">
                <div className="bg-sky-950 shadow-md text-center py-5 mx-10">
                    <p className="text-lg font-semibold text-white">Miễn phí vận chuyển</p>
                    <p className="text-md text-white mt-2">cho đơn từ 699.000đ tối đa 20.000đ</p>
                    <p className="text-lg font-bold text-white mt-2">Mua ngay</p>
                </div>
            </div>
            <div className='px-10 py-5'>
                <p className='font-semibold text-xl font-roboto'>Sản phẩm khuyến mãi</p>
                <div className='relative group w-full'>
                    <Swiper
                        ref={swiperRef}
                        slidesPerView={4}
                        spaceBetween={30}
                        pagination={{
                            type: 'custom',
                        }}
                        navigation={false}
                        modules={[Pagination, Navigation]}
                        className="w-4/5"
                    >
                        {productsSale.map((product) => (
                            <SwiperSlide key={product.id} className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg">
                                <img src={product.image} alt={product.name} className="object-contain" />
                                <p className="mt-2 text-center font-semibold">{product.name}</p>
                                <p className="text-red-500 font-semibold">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <ButtonRow icon={<IoIosArrowBack className="size-10" color='gray' />} />
                    <ButtonRow icon={<IoIosArrowForward className="size-10" color='gray' />} right />
                </div>
            </div>
        </>
    );
}
