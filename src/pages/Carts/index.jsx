import React, { useEffect, useState, useRef } from 'react';
import Link from '../../layouts/Link';
import { HiTrash } from "react-icons/hi";
import useCart from '../../hooks/useCart';
import useProduct from '../../hooks/useProduct';
import { GiCheckMark } from "react-icons/gi";
import useOrder from '../../hooks/useOrder';

const Carts = () => {
    const { carts, fetchCarts, deleteCartItem, updateQuantity, payment } = useCart();
    const { colorProduct } = useProduct();
    const [quantity, setQuantity] = useState({});
    const [totalPrice, setTotalPrice] = useState({});
    const timeoutRef = useRef({});
    const [cartAddToPayment, setCartAddToPayment] = useState([]);
    const { createOrder } = useOrder();

    useEffect(() => {
        fetchCarts();
    }, []);

    useEffect(() => {
        // Initialize quantities from carts
        const initialQuantities = carts.reduce((acc, cart) => {
            acc[cart.id] = cart.quantity;
            return acc;
        }, {});
        setQuantity(initialQuantities);

        setTotalPrice(carts.reduce((acc, cart) => {
            acc[cart.id] = cart.quantity * cart.product.productPrice;
            return acc;
        }, {}));

    }, [carts]);

    const handleDeleteCartItem = async (id) => {
        if (cartAddToPayment.some(product => product.id === id)) {
            const newProductAddToPayment = cartAddToPayment.filter(product => product.id !== id);
            setCartAddToPayment(newProductAddToPayment);
        }

        await deleteCartItem(id, true);
    }

    const handleQuantityChange = (cart, newQuantity) => {
        setQuantity(prevQuantities => ({
            ...prevQuantities,
            [cart.id]: newQuantity
        }));

        // Clear previous timeout if exists
        if (timeoutRef.current[cart.id]) {
            clearTimeout(timeoutRef.current[cart.id]);
        }

        // Set a new timeout to update quantity after 5 seconds
        timeoutRef.current[cart.id] = setTimeout(async () => {
            await updateQuantity(cart, newQuantity, totalPrice[cart.id]);
            console.log(`Updated quantity for item ${cart.id} to ${newQuantity}`);
        }, 5000);
    }
    useEffect(() => {
        return () => {
            // Clear all timeouts when component unmounts
            Object.values(timeoutRef.current).forEach(timeout => {
                clearTimeout(timeout);
            });
        }
    }, []);
    useEffect(() => {
        // nếu quantity thay đổi, cập nhật total price
        const newTotalPrice = carts.reduce((acc, cart) => {
            acc[cart.id] = cart.product.productPrice * quantity[cart.id];
            return acc;
        }, {});
        setTotalPrice(newTotalPrice);

    }, [quantity])

    const ButtonColor = ({ color }) => {
        return (
            <button className='w-6 h-6 rounded-full border mx-2 hover:border-2'
                style={{ backgroundColor: colorProduct[color] }}
            ></button>
        )
    }
    const handleAddProductToPayment = (cart) => {
        if (cartAddToPayment.some(product => product.id === cart.id)) {
            const newProductAddToPayment = cartAddToPayment.filter(product => product.id !== cart.id);
            setCartAddToPayment(newProductAddToPayment);
            return;
        }
        setCartAddToPayment([...cartAddToPayment, cart]);
    }
    const OrderValue = ({ title, value, isSale }) => {
        return (
            <div className='flex flex-row justify-between py-1'>
                <div>
                    <p className={`font-medium text-lg ${isSale ? 'text-red-600' : 'text-gray-600'}`}>{title}</p>
                </div>
                <div>
                    <p className='text-gray-600 text-lg'>{value}</p>
                </div>
            </div >
        )
    }

    const handlePayment = async () => {
        const orderItemRequests = cartAddToPayment.map(cart => {
            const product = cart.product;
            return {
                cartId: cart.id,
                productName: product.productName,
                productPrice: product.productPrice,
                productQuantity: quantity[cart.id],
                productTotalPrice: totalPrice[cart.id],
                productColor: cart.productColor
            }
        });
        const totalPriceOrder = cartAddToPayment.reduce((acc, product) => acc + product.product.productPrice * quantity[product.id], 0);
        const response = await payment(totalPriceOrder, 'Hà Nội', '0123456789', 'COD', orderItemRequests);
        if (response.status === 200) {
            setCartAddToPayment([]);
        }
    }

    return (
        <div className=''>
            <div className='flex flex-row w-2/12 justify-evenly'>
                <Link href="/">Trang chủ</Link>
                <span className='text-gray-400'> | </span>
                <Link href='/carts' main>Giỏ hàng</Link>
            </div>
            <div className='w-2/12 p-6'>
                <h1 className='text-xl font-medium'>Giỏ hàng của bạn</h1>
            </div>
            <div className={`flex flex-row ${cartAddToPayment.length === 0 ? ' justify-start' : ' justify-evenly'}`}>
                <div className='w-2/3 px-6'>
                    {carts.map(cart => {
                        const product = cart.product;
                        return (
                            <div key={cart.id} className='grid grid-cols-6 mb-4'>
                                <div className='col-span-2 flex justify-center items-center'>
                                    <img src={product.productDetail[0].productImage} alt={product.productName} className='object-contain h-3/4 w-11/12' />
                                </div>
                                <div className='col-span-2 flex items-center'>
                                    <div className='w-2/3'>
                                        <div className='col-span-3 h-2/4 flex flex-col justify-between'>
                                            <p className='font-bold pb-2 text-xl font-roboto'>{product.productName}</p>
                                            <p className='text-gray-500 font-semibold pb-2'>Số lượng</p>
                                            <div className='flex flex-row w-1/2 h-6'>
                                                <button
                                                    onClick={() => handleQuantityChange(cart, Math.max(1, quantity[cart.id] - 1))}
                                                    className='border-2 border-gray-300 w-1/4 text-gray-400 font-semibold text-center'>-</button>
                                                <input type='number' value={quantity[cart.id]}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        if (newValue === '' || newValue === '0') {
                                                            handleQuantityChange(cart, 1);
                                                        } else {
                                                            handleQuantityChange(cart, Math.max(1, parseInt(newValue, 10)));
                                                        }
                                                    }}
                                                    className='text-center w-1/2 border-y-2 border-x-0 border-gray-300 text-gray-400 font-semibold font-mono' />
                                                <button
                                                    onClick={() => handleQuantityChange(cart, quantity[cart.id] + 1)}
                                                    className='border-2 border-gray-300 w-1/4 text-gray-400 font-semibold'>+</button>
                                            </div>
                                            <p className='text-gray-500 font-bold pb-2'>{
                                                totalPrice[cart.id] && totalPrice[cart.id].toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                                // product.productPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND' })
                                            }
                                            </p>
                                            <div className='flex flex-row items-center'>
                                                <div className='h-full mr-2'>
                                                    <p className='text-gray-500 font-semibold'>Màu sắc: </p>
                                                </div>
                                                <ButtonColor color={product.productDetail[0].productColor} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1 flex flex-col justify-between items-end h-3/4'>
                                    <div className='h-2/6 flex items-center'>
                                        <button className={`w-6 h-6 border-2 border-gray-500 rounded-full flex items-center justify-center
                                         ${cartAddToPayment.some(product => product.id === cart.id) && 'bg-cyan-900'}`}
                                            onClick={() => handleAddProductToPayment(cart)}>
                                            {cartAddToPayment.some(product => product.id === cart.id) && <GiCheckMark size={16} color='white' />}
                                        </button>
                                    </div>
                                    <div className='bg-black flex flex-row items-center rounded-xl py-2 px-4'>
                                        <HiTrash size={20} color='white' />
                                        <button className='w-2/12 text-white pl-2 font-bold'
                                            onClick={() => handleDeleteCartItem(cart.id)}>
                                            Xóa</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {cartAddToPayment.length > 0 && (
                    <div className='w-4/12'>
                        <h1 className='text-2xl font-medium mb-6 text-center'>Thông tin đơn hàng</h1>
                        <div className='w-full'>
                            <p className='text-green-600 mb-1'>
                                <span className='font-bold'>Miễn phí giao hàng</span> tiêu chuẩn cho đơn từ 699k (tối đa 30k)
                            </p>
                        </div>
                        <OrderValue title='Giá trị đơn hàng'
                            value={cartAddToPayment.reduce((acc, product) => acc + totalPrice[product.id], 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                        <OrderValue title='Số lượng' value={cartAddToPayment.length} />
                        <OrderValue title='Giảm giá' value='0đ' isSale />
                        <OrderValue title='Thành tiền'
                            value={cartAddToPayment.reduce((acc, product) => acc + totalPrice[product.id], 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />

                        <div className='my-4'>
                            <label className='block text-gray-700 text-sm font-bold pb-2' htmlFor='address'>
                                Địa chỉ:
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='address' type='text' placeholder='Số nhà, xã, quận huyện, tỉnh/TP' />
                        </div>

                        <div className='my-4'>
                            <label className='block text-gray-700 text-sm font-bold pb-2' htmlFor='phone'>
                                Số điện thoại:
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='phone' type='text' placeholder='0123456789' />
                        </div>

                        <div className='my-4'>
                            <label className='block text-gray-700 text-sm font-bold pb-2' htmlFor='email'>
                                Email:
                            </label>
                            <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                id='email' type='email' placeholder='you@example.com' />
                        </div>

                        <button className='w-full bg-black text-white font-semibold py-2 rounded-xl mt-4'
                            onClick={handlePayment}>Thanh toán</button>
                    </div>
                )}

            </div>
        </div>
    );
}
export default Carts;
