import { use, useState } from "react";
import "../styles/login.css";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import useAuthStore from "../store/authStore";

export default function Login() {
    //  로그인 상태 호출하자 AuthContext.jsx에 있다.
    //  const {setIsLoggedIn} = useAuth();   
  
    // zustand
    const zu_login = useAuthStore((state)=>state.zu_login);
  
    const [m_id, setM_id] = useState("");          // 상수 m_id의 상태를 관리하는 useState를 초기값으로 선언하며 상태변화관리를 setM_id로 지정, String 타입이기에 ("") 로 초기화  
    const [m_pw, setM_pw] = useState("");          // 상수 m_pw의 상태를 관리하는 useState를 초기값으로 선언하며 상태변화관리를 setM_pw로 지정, String 타입이기에 ("") 로 초기화  
    const navigate = useNavigate();                // 상수 navigate를 선언, useNavigate는 페이지 이동을 위한 훅

    //  Axios 로 SpringBoot 서버에 POST로 요청
    const handleLogin = async()=>{
        try {                                         // auth에 있는 ID / PW를 가져온다
          const response = await login(m_id, m_pw);   // 상수 response 선언, login 함수 호출 및 응답 대기, m_id와 m_pw로 인자 전달 
        //  const m_idx = response.data.data.m_id;    // 상수 m_idx 선언, response.data.data에서 m_id 추출
        //  const m_name = response.data.data.m_name; // 상수 m_name 선언, response.data.data에서 m_name 추출
          console.log(response);                      // 응답 결과를 콘솔에 출력      
          const {accessToken, refreshToken} = response.data.data ; 

          //  localStorage 저장하기, 토큰만 저장
          localStorage.setItem("tokens", JSON.stringify({ accessToken, refreshToken }));

          // 로그인 성공 시, home 페이지로 이동
          // 단, 이동 전에 로그인 성공했다고 기억해야 된다. (localStorage에 저장)
          // localStorage.setItem("token", m_idx);        // localStorage에 m_idx 저장 및 token으로 명명
          // localStorage.setItem("name", m_name);       // localStorage에 m_name 저장 및 name으로 명명
          // App.js 에서 isLoggedIn 상태를 변경하기 위해
          // main으로 갈 때 값을 기억시켜야 한다.
          // setIsLoggedIn(true); // 로그인 완료 상태로 변경
          
          zu_login();
          navigate('/');       // 홈 페이지(http://localhost:3000/)으로 이동

        } catch (error) {
          console.log(error);
          alert("로그인 실패");
        }
    }
    return(
      <div className="login-wrapper">
          <h2>로그인</h2>
            <input type="text"
                  value={m_id}
                  onChange={(e)=>setM_id(e.target.value)}
                  placeholder="아이디를 입력하세요"
            />
            <input type="password"
                  value={m_pw}
                  onChange={(e)=>setM_pw(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
            />
            
            <button onClick={handleLogin} disabled={!m_id || !m_pw}>로그인</button>
        </div>
      
    )
}