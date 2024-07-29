import { RxReload } from "react-icons/rx";
import React, { useEffect, useState } from 'react'
import useProduct from "../../hooks/useProduct";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";

const ProductDetail =
    ({ productDetails,
        setModalOpen,
        filterProductByColor,
        setProductDetailFilter,
        setImageMain,
        quantity,
        setQuantity,
        isCart,
    }) => {
        const { colorProduct, getColorKeyFromValue } = useProduct();
        const [colorRender, setColorRender] = useState([]);
        const [colorAddToCart, setColorAddToCart] = useState(null);
        const { addProductToCart } = useCart();

        useEffect(() => {
            setColorAddToCart(null);
            const colorSet = new Set();
            productDetails.productDetail.map((detail) => colorSet.add(colorProduct[detail.productColor]));
            setColorRender(Array.from(colorSet));
        }, [productDetails]);


        const filterProductByColorAndSetColor = (color) => {
            filterProductByColor(color);
            const colorFilter = getColorKeyFromValue(color);
            setColorAddToCart(colorFilter);
        }

        const ButtonColor = ({ color }) => {
            return (
                <button className='w-6 h-6 rounded-full border mx-2 hover:border-2'
                    style={{ backgroundColor: color, borderColor: color === colorProduct.Đen ? colorProduct.Ghi : 'black' }}
                    onClick={() => filterProductByColorAndSetColor(color)}
                ></button >
            )
        }
        const addToCart = async (e) => {
            e.preventDefault();
            let colorOfProductOneColor = null;
            if (colorRender.length === 1) {
                colorOfProductOneColor = getColorKeyFromValue(colorRender[0]);
            }
            if (colorRender.length !== 1) {
                if (!colorAddToCart) {
                    toast.error('Vui lòng chọn màu sắc');
                    return;
                }
            }
            const productDetail = productDetails.productDetail.find(detail => detail.productColor === colorOfProductOneColor || colorAddToCart);
       
            const productAddToCart = {
                productId: productDetails.id,
                productDetail: productDetail.id,
                quantity: quantity,
                productColor: colorAddToCart,
                date: new Date().toISOString()
            };
      
            const response = await addProductToCart(productAddToCart);
            if (response.status === 200) {
                toast.success('Thêm vào giỏ hàng thành công');
                setModalOpen(false);
            }
        }
      


        return (
            <div className='col-span-3 h-2/4 flex flex-col justify-between'>
                <p className={`font-bold ${!isCart ? 'text-2xl' : 'pb-2 text-xl'} font-roboto`}>{productDetails?.productName}</p>
                <p className={`text-gray-500 font-semibold ${isCart && 'pb-2'}`}>Số lượng</p>
                <div className={`flex flex-row w-1/3 h-6 ${isCart && 'mb-2'}`}>
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className='border-2 border-gray-300 w-1/4 text-gray-400 font-semibold text-center'>-</button>
                    <input type='number' value={quantity}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue === '' || newValue === '0') {
                                setQuantity('');
                            } else {
                                setQuantity(Math.max(1, parseInt(newValue, 10)));
                            }
                        }}
                        className='text-center w-1/2 border-y-2 border-x-0 border-gray-300 text-gray-400 font-semibold font-mono ' />
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className='border-2 border-gray-300 w-1/4 text-gray-400 font-semibold'>+</button>
                </div>
                <p className={`text-gray-500 font-bold ${isCart && 'pb-2'}`}>{productDetails?.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                <p className={`text-gray-500 font-semibold ${isCart && 'pb-2'}`}>Màu sắc</p>
                <div className={`flex flex-row ${isCart && 'mb-2'}`}>
                    {colorRender?.map((color, index) => (
                        <ButtonColor key={index} color={color} />
                    ))}
                    {!isCart && (
                        <button
                            onClick={() => {
                                setProductDetailFilter(null);
                                setImageMain(null);
                            }}
                            className='mx-2 hover:border-2'
                        >
                            <RxReload size={20} />
                        </button>
                    )}
                </div>
                {!isCart && (
                    <button className='p-1 border  bg-black text-white font-semibold px-2 py-1 w-full'
                        onClick={addToCart}
                    >Thêm vào giỏ hàng</button>
                )}
            </div>
        );
    }
export default ProductDetail;