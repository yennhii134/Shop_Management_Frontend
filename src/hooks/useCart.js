import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

const useCart = () => {
    const [carts, setCarts] = useState([]);
    const fetchCarts = async () => {
        console.log('fetchCarts');
        try {
            const response = await axiosInstance.get('/carts');
            const data = response.data;
            // console.log('data', data);
            setCarts(data);
            return data;
        } catch (error) {
            console.error('Error at useCart -> fetchCarts: ', error);
        }
    }
    const addProductToCart = async (productId, productDetail, quantity, totalPrice, productColor) => {
        const productAddToCart = {
            productId,
            productDetail,
            quantity,
            totalPrice,
            productColor,
        };
        try {
            const response = await axiosInstance.post('/carts', productAddToCart);
            const data = response.data;
            // console.log('data add to cart', data);
            return data;
        } catch (error) {
            console.error('Error at useCart -> addItem: ', error);
            toast.error('Thêm sản phẩm vào giỏ hàng thất bại');
        }
    };
    const updateQuantity = async (cart, quantity, totalPrice) => {
        const productAddToCart = {
            id: cart.id,
            productId: cart.productId,
            productDetail: cart.productDetail,
            quantity,
            totalPrice,
            productColor: cart.productColor,
        };
        try {
            const response = await axiosInstance.put('/carts', productAddToCart);
            // console.log('response', response);
            if (response.status === 200) {
                fetchCarts();
            }
        } catch (error) {
            console.error('Error at useCart -> updateQuantity: ', error);
        }
    }
    const deleteCartItem = async (id, isNotification) => {
        try {
            const response = await axiosInstance.delete(`/carts/${id}`);
            // console.log('response', response);
            if (response.status === 200) {
                fetchCarts();
                if (isNotification) {
                    toast.success('Xóa sản phẩm khỏi giỏ hàng thành công');
                }
            }
        } catch (error) {
            console.error('Error at useCart -> deleteCart: ', error);
            toast.error('Xóa sản phẩm khỏi giỏ hàng thất bại');
        }
    };
    const payment = async (orderTotal, orderAddress, orderPhone, orderPayment, orderItemRequests) => {
        const orderAndOrderItemRequest = {
            orderRequest: {
                orderTotal,
                orderAddress,
                orderPhone,
                orderPayment,
            },
            orderItemRequests
        };
        try {
            const response = await axiosInstance.post('/orders', orderAndOrderItemRequest);
            if (response.status === 200) {
                toast.success('Đặt hàng thành công');
                orderItemRequests.map(async (orderItemRequest) => {
                    await deleteCartItem(orderItemRequest.cartId, false);
                });
                fetchCarts();
            }
            return response;
        } catch (error) {
            console.error('Error at useCart -> payment: ', error);
            toast.error('Đặt hàng thất bại');
        }
    }

    return { carts, fetchCarts, addProductToCart, updateQuantity, deleteCartItem, payment };
}
export default useCart;