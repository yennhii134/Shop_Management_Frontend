import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useProduct = () => {
    const limit = 9;
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(0)
    const colorProduct = { 'Vàng': '#ffe56d', 'Đen': 'black', 'Trắng': 'white', 'Denim': '#AACCE1', 'Đỏ': '#954534', 'Hồng': '#E5C0D8', 'Silver': '#D7D5D6', 'Milky': '#EAE5DC', 'Milktea': '#E8DDD2', 'TrắngPhaĐen': 'white', 'Ghi': '#8D8881', 'Be': 'white', 'Nâu': '#BDA791' }

    const getColorKeyFromValue = (value) => {
        const keys = Object.keys(colorProduct);
        const values = Object.values(colorProduct);
        const index = values.indexOf(value);
        return index !== -1 ? keys[index] : null;
    };

    const fetchProducts = async (page, limit) => {
        try {
            const response = await axiosInstance.get('/products', {
                params: {
                    page,
                    limit
                }
            });
            // console.log('response in fetchProducts:', response);
            if (response.status === 200) {
                const data = response.data;
                setProducts(data.content);
                setTotalPages(data.totalPages)
                setPageNumber(data.pageable.pageNumber)
                return data;
            }
        } catch (error) {
            console.error('Error at useProduct -> fetchProducts: ', error);
        }
    };
    const fetchProductsByCategory = async (categoryId, page, limit) => {
        try {
            const response = await axiosInstance.get(`/products/category/${categoryId}`, {
                params: {
                    page,
                    limit
                }
            });
            // console.log('response', response.data);
            if (response.status === 200) {
                const data = response.data;
                setProducts(data.content);
                setTotalPages(data.totalPages)
                setPageNumber(data.pageable.pageNumber)
                return data;
            }
        } catch (error) {
            console.error('Error at useProduct -> fetchProductsByCategory: ', error);
        }
    }
    return {
        limit,
        products,
        fetchProducts,
        totalPages,
        pageNumber,
        fetchProductsByCategory,
        colorProduct,
        getColorKeyFromValue
    };
}
export default useProduct;