import { Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { makeupApi } from "../api/http";
import { Link } from "react-router-dom";
import '../styles/main.css'

export default function Main(){
    const [list, setList] = useState([]);           // 상수 list의 상태를 관리하는 useState를 초기값으로 선언하며 상태변화관리를 setList로 지정, 배열 타입이기에 ([]) 로 초기화  
    const [loading, setLoading] = useState(true);   // 상수 loading의 상태를 관리하는 useState를 초기값으로 선언, 상태변화관리를 setLoading으로 지정, boolean 타입이기에 (true) 로 초기화  
    const [error, setError] = useState(null);       // 상수 error의 상태를 관리하는 useState를 초기값으로 선언, 상태변화관리를 setError로 지정

    // 외부 정보 호출 (API 호출)
    const getData = async () => {                   // 상수 getData를 선언하고 비동기 작업을 수행함을 함수로 선언
        try {
            setLoading(true);                       // setLoading을 true로 설정하여 로딩 상태 표시
            const response = await makeupApi.get('/v1/products.json?brand=maybelline'); // 상수 response(응답)를 선언, 외부 API 호출 및 응답 대기
            // console.log(response);
            setList(response.data.slice(0,12));     // 상위 12개의 데이터를 배열로 저장
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };                  
    useEffect(()=>{ // 컴포넌트가 처음 마운트 될 때 실행, useEffect를 사용하지 않으면 컴포넌트가 렌더링 될 때마다 getData 함수가 호출(없으면 무한루프가 발생할 수 있음)
       getData();   // [value] value가 변경될 때마다 실행, 이 코드는 "페이지가 처음 로드될 때 데이터를 가져와서 보여주세요" 라는 의미
    },[]);          // 빈 배열 [] 은 "의존성 배열" 이라고 한다.


    // 로딩 또는 에러처리
    if(loading) return <div style={{textAlign:"center", padding:"20px"}}>로딩 중....</div>   // 로딩 상태일 때 "로딩 중..." 표시
    if(error) return <div style={{textAlign:"center", padding:"20px"}}>Error:{error}</div>  // 에러 상태일 때 "Error" 메시지 표시
    return(
        <div style={{width:"80%", margin:"0 auto", padding:"20px"}}>
            <h2 style={{textAlign:"center"}}>베스트 상품</h2>
            <Divider />
                <Grid container spacing={2} justifyContent="center">
                {list.map((k) => (
                    // 반응형 웹 : xs=모바일에서 전체차지, sm(small 화면 6간 = 태블릿에서 1줄에 2개, 
                    // md:데스크에서 1줄에 4개)
                    <Grid item xs={12} sm={6} md={3} key={k.id} style={{textAlign:"center"}}>
                        <Link to={`/productdetail/${k.id}`} style={{textDecoration:"none", color:"inherit"}}>
                        <img className="img_item" src={k.image_link} alt={k.name}  />
                        <strong style={{color:"blue"}}>{k.name}</strong>
                        <div className="txt_info">{k.category} &nbsp; {k.product_type}</div>
                        <strong className="num_price">${k.price}</strong>
                        </Link>
                    </Grid> 
                ))}
            </Grid>
        </div>
    )
}