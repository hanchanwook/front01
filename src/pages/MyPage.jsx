import React, { useEffect, useState } from "react"; // react 라이브러리에서 useEffect(컴포넌트의 생명주기 관리), useState(컴포넌트의 상태를 관리) 훅(HOOK) 불러오기
import { myPage } from "../api/auth";               // myPage API 호출 함수

export default function MyPage(){
    const [member, setMember] = useState();     // 상수 const 선언 후 빈 값 할당, member 변수 선언 후 setMember 함수 호출, useState 훅으로 상태 관리
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {                           // useEffect 사용, 컴포넌트가 마운트 될 때 실행
        const fetchData = async () =>{          // fetchData 함수 선언, async 사용, 비동기 처리
            try {

            //    const m_idx = localStorage.getItem("token"); // localStorage에서 "token" 이름으로 저장된 값을 읽어서, m_idx 상수에 저장해라라
            //    const response = await myPage(m_idx);        // myPage API 호출, 토큰 전달
                
                const response = await myPage();
                console.log(response);                      // 응답 데이터 콘솔에 출력

                if(response.data.success){                  // 응답 데이터의 success 속성이 true인 경우
                    setMember(response.data.data);          // 응답 데이터의 data 속성을 member 상수에 저장해라라
                } else{
                    setError("회원정보를 불러올 수 없습니다.");
                }
                
            } catch (err) {
                console.error("데이터를 가져오는 중 오류 발생:", err);
                setError("회원 정보를 불러올 수 없습니다.");        
            } finally{
                setLoading(false);
            }
        };

        fetchData();
    }, []);           // 컴포넌트가 마운트 될 때 실행되는 코드
        
    if(loading) return <div>로딩 중....</div>;
    if(error) return<div style={{colors:"red"}}>{error}</div>
    return(
        <div>
            <h2>마이페이지 {member.m_name}님 환영합니다.</h2>
                <div>
                    <p>아이디 : {member.m_id}</p>
                    <p>이름 : {member.m_name}</p>
                    <p>이메일 : {member.m_email}</p>
                    <p>전화번호 : {member.m_phone}</p>
                </div>
        </div>
    )
}