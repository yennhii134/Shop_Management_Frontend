import React, { useState } from 'react'

const ProductDetail = () => {
    const Link = ({ href, children }) => {
        return (
            <a href={href} className="text-gray-500">{children}</a>
        )
    }
    return (
        
        <div className=''>
            <div className='flex flex-row  w-2/12 justify-evenly'>
                <Link href="/">Trang chủ</Link>
                <span className='text-gray-400'> | </span>
                <Link href='/products'>Sản phẩm</Link>
            </div>
        </div>
    );
}
export default ProductDetail;