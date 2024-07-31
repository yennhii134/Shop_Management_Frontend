import { useState } from "react";
import useCart from "./useCart";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const useOrder = () => {
    const [order, setOrder] = useState(null);
    const { deleteCartItem, fetchCarts } = useCart();

    const createOrder = async (orderTotal, orderAddress, orderPhone, orderPayment, orderItemRequests) => {
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
            console.log('response', response);
            if (response.status === 200) {
                toast.success('Đặt hàng thành công');
                orderItemRequests.map(async (orderItemRequest) => {
                    await deleteCartItem(orderItemRequest.cartId, false);
                });
                return response.data;
            }
            return response;
        } catch (error) {
            console.error('Error at useCart -> payment: ', error);
            toast.error('Đặt hàng thất bại');
        }
    }

    return { order, createOrder };
}
export default useOrder;