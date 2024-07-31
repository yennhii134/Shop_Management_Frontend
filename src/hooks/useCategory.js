import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useCategory = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async (page, limit) => {
        try {
            const response = await axiosInstance.get('categories');
            // console.log('response in useCategory', response.data);
            const data = response.data;
            setCategories(data);
            return data;
        } catch (error) {
            console.error('Error at useCategory -> getCategories: ', error);
        }
    };

    return { categories, fetchCategories };
};

export default useCategory;