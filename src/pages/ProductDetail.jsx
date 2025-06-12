import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { makeupApi } from "../api/http";
import '../styles/productdetail.css';

export default function ProductDetail(){
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ product, setProduct] = useState(null);
    
        // 외부 정보 호출 (API 호출)
        useEffect(()=>{
           const getProduct = async () => {
            try {
                setLoading(true);
                const response = await makeupApi.get('/v1/products.json?brand=maybelline');
                // id 같은 하나의 상품만 추출
                const item = response.data.find((k)=> k.id === Number(id));
                if(!item) throw new Error("해당 상품을 찾을 수 없습니다.");
                setProduct(item);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally{
                setLoading(false);
            }
           };
           getProduct();
        },[id]);
        // 로딩 또는 에러 메시지
        if(loading) return <div style={{textAlign:'center'}}>로딩 중....</div>
        if(error) return <div style={{textAlign:'center', color:'red'}}>Error:{error}</div>

    return(
        <div className="detail-wrapper">
            <h2>{product.name}</h2>
            <img className="detail-" src="" alt="" />
            <p className="detail-info"><strong>브랜드 : </strong> {product.brand} </p>
            <p className="detail-info"><strong>카테고리 : </strong> {product.category} </p>
            <p className="detail-info"><strong>타입 : </strong> {product.product_type} </p>
            <p className="detail-price">${product.price}</p>
            <p className="detail-description">{product.description || '설명 없음'}</p>
        </div>
    )
}


// filter는 배열에서 조건에 맞는 요소를 찾아서 새로운 배열로 반환하는 메서드입니다. (여러 개가 될 수 있다.)
// find는 배열에서 조건에 맞는 첫 번째 요소를 찾아서 반환하는 메서드입니다. (맨 처음 1개)