import React, { useEffect, useState } from 'react'
import useCategory from '../../hooks/useCategory'
import useProduct from '../../hooks/useProduct';
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { Modal } from 'antd';
import Link from '../../layouts/Link';
import { RxReload } from "react-icons/rx";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import { useAuthenContext } from '../../contexts/AuthenContext';

const Products = () => {
    const { categories, fetchCategories } = useCategory();
    const { limit, products, fetchProducts, totalPages, pageNumber, fetchProductsByCategory, colorProduct, getColorKeyFromValue } = useProduct();
    const [page, setPage] = useState(0);
    const [hover, setHover] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [productDetailFilter, setProductDetailFilter] = useState(null);
    const [imageMain, setImageMain] = useState(null);
    const [colorRender, setColorRender] = useState([]);
    const [colorAddToCart, setColorAddToCart] = useState(null);
    const { addProductToCart } = useCart();
    const [colorPick, setColorPick] = useState(null);
    const { authUser } = useAuthenContext();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(page, limit);
    }, [page]);

    useEffect(() => {
        const colorSet = new Set();
        productDetails?.productDetail.forEach(productDetail => colorSet.add(colorProduct[productDetail.productColor]));
        setColorRender(Array.from(colorSet));
        setQuantity(1);
        setProductDetailFilter(null);
        setImageMain(null);
        setTotalPrice(productDetails?.productPrice);
    }, [modalOpen]);

    const handleFetchProductsByCategory = (categoryId) => {
        setPage(0);
        fetchProductsByCategory(categoryId, page, limit);
    }
    const filterProductByColor = (color) => {
        const productFilter = productDetails.productDetail.filter(productDetail => colorProduct[productDetail.productColor] === color);
        setImageMain(productFilter[0].productImage);
        setProductDetailFilter({ ...productDetails, productDetail: productFilter });
    }
    const filterProductByColorAndSetColor = (color) => {
        filterProductByColor(color);
        const colorFilter = getColorKeyFromValue(color);
        setColorAddToCart(colorFilter);
        setColorPick(color);
    }

    const ButtonColor = ({ color }) => {
        return (
            <button className={`w-6 h-6 rounded-full border mx-2 hover:border-2 ${colorPick === color && ' border-2'}`}
                style={{ backgroundColor: color, borderColor: color === colorProduct.Đen ? colorProduct.Ghi : 'black' }}
                onClick={() => filterProductByColorAndSetColor(color)}
            ></button >
        )
    }
    const addToCart = async (e) => {
        e.preventDefault();
        if (!authUser) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }
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
        const response = await addProductToCart(productDetails.id, productDetail.id, quantity, totalPrice, colorAddToCart);
        if (response.status === 200) {
            toast.success('Thêm vào giỏ hàng thành công');
            setModalOpen(false);
        }
    }
    useEffect(() => {
        if (quantity !== '') {
            setTotalPrice(productDetails?.productPrice * quantity);
        }
    }, [quantity]);
    return (
        <>
            <div className='grid grid-cols-4'>
                <div className=''>
                    <div className='flex flex-row w-1/2 justify-between'>
                        <Link href="/">Trang chủ</Link>
                        <span className='text-gray-400'> | </span>
                        <Link href="/products" main>Sản phẩm</Link>
                    </div>
                    <div className='border-b-2 w-1/3 pb-2 h-20 flex items-end'>
                        <p className='font-bold text-2xl font-mono'>Bộ lọc</p>
                    </div>
                    <div className='border-b-2 w-1/2 py-4'>
                        <p className='font-semibold text-xl font-mono pb-2'>Phân loại</p>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.id} className='py-1 text-gray-500 font-mono hover:font-medium hover:text-black hover:text-xl'>
                                    <button onClick={() => handleFetchProductsByCategory(category.id)}>{category.categoryName}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='col-span-3'>
                    <div className='grid grid-cols-3 gap-4'>
                        {products.map((product) => {
                            const productDetailMain = product.productDetail.find(productDetailMain => productDetailMain.productImageMain === true);
                            return (
                                <a key={product.id} className={`flex flex-col justify-center items-center border-2 border-gray-200 
                                ${hover === product.id && 'border-slate-400'}`}
                                    onMouseEnter={() => setHover(product.id)} onMouseLeave={() => setHover('')}
                                    href={`/products/${product.id}`}>
                                    <img src={productDetailMain.productImage} alt={product.name} className='h-4/5 w-full object-contain'
                                        style={{ backgroundColor: '#f0f2ef' }} />
                                    <p className='pt-2 font-semibold'>{product.productName}</p>
                                    <p className='text-gray-500 font-semibold'>{product.productPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    {
                                        hover === product.id &&
                                        <div className='flex flex-col items-center py-2'>
                                            <button className='p-1 border border-black bg-gray-600 text-white font-semibold px-2 py-1'
                                                onClick={(e) => {
                                                    e.preventDefault(); setModalOpen(!modalOpen); setProductDetails(product);
                                                }}>Thêm vào giỏ hàng</button>
                                        </div>
                                    }
                                </a>
                            );
                        })}
                    </div>
                    <div className='flex justify-center py-4'>
                        {pageNumber !== 0 &&
                            <button onClick={() => setPage(page - 1)} className=' p-1 mr-2 border border-black'><MdOutlineArrowBackIos /></button>
                        }
                        {totalPages !== 1 &&
                            Array.from({ length: totalPages }, (_, index) => (
                                <button key={index} onClick={() => setPage(index)}
                                    className={`text-xl p-1 font-mono mr-2 ${pageNumber === index && 'font-bold border-b-2 border-black'}`}>{index + 1}</button>
                            ))
                        }

                        {(pageNumber !== totalPages - 1 && products.length !== 0) &&
                            <button onClick={() => setPage(page + 1)} className='p-1 border border-black'><MdOutlineArrowForwardIos /></button>
                        }
                    </div>
                </div>
            </div>
            <Modal
                // title="Modal Product Detail"
                // centered
                style={{
                    top: 10
                }}
                width='60%'
                open={modalOpen}
                footer={null}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
            >
                <div className='px-4 py-6'>
                    <div className='grid grid-cols-9'>
                        <div className='col-span-5 pr-4'>
                            <img
                                src={imageMain
                                    // || productDetailFilter?.productDetail[0].productImage
                                    || productDetails?.productDetail.find(productDetailMain => productDetailMain.productImageMain === true).productImage}
                                alt={productDetails?.productName} className='object-contain h-full' style={{ backgroundColor: '#f0f2ef' }} />
                        </div>
                        <div className='pr-4 h-4/5'>
                            {(productDetailFilter?.productDetail || productDetails?.productDetail)?.map((productDetail) => (
                                <button key={productDetail.id} onClick={() => setImageMain(productDetail.productImage)}>
                                    <img src={productDetail.productImage} alt={productDetail.productImage}
                                        className='w-full object-contain mb-2 border border-gray-400 hover:border-black' />
                                </button>
                            ))}
                        </div>
                        <div className='col-span-3 h-2/4 flex flex-col justify-between'>
                            <p className='font-bold text-2xl font-roboto'>{productDetails?.productName}</p>
                            <p className='text-gray-500 font-semibold'>Số lượng</p>
                            <div className='flex flex-row w-1/2 h-6'>
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
                            <p className='text-gray-500 font-bold'>{typeof totalPrice === 'number' && totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            <p className='text-gray-500 font-semibold'>Màu sắc</p>
                            <div className='flex flex-row'>
                                {colorRender?.map((color, index) => (
                                    <ButtonColor key={index} color={color} />
                                ))}
                                <button
                                    onClick={() => {
                                        setProductDetailFilter(null);
                                        setImageMain(null);
                                        setColorPick(null);
                                        setColorAddToCart(null);
                                    }}
                                    className='mx-2 hover:border-2'
                                >
                                    <RxReload size={20} />
                                </button>
                            </div>
                            <button className='p-1 border  bg-black text-white font-semibold px-2 py-1 w-full'
                                onClick={addToCart}
                            >Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </Modal >
        </>
    );
}
export default Products;