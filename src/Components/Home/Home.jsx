import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Home() {

    const [products, setProducts] = useState([])


    async function getProducts() {
        let { data } = await axios.get(`https://fakeapi.net/products`);
        setProducts(data.data)
    }

    useEffect(() => {
        () => { getProducts(); }
    }, [])

    return (
        <>
            <div className="row">
                {products.length>0? products.map((product) => <div>
                    <img src={product.image} className='w-full'/>
                    <h2> key={product.title}</h2>
                </div>
                ):<span className="loader mx-auto my-auto"></span>}
            </div>
        </>
    )
}
