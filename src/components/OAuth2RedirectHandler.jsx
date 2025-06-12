import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

export default function OAuth2RedirectHandler(){
    const navigate = useNavigate();
    const zu_login = useAuthStore((state)=>state.zu_login);

    useEffect(()=>{
        console.log("OAuth2RedirectHandler: Starting OAuth2 redirect handling");
        console.log("Current cookies:", document.cookie);
        
        //  1. 쿠키에서 authToken 확인
        const token = document.cookie
        .split("; ")
        .find((row)=> row.startsWith("authToken="))
        ?.split("=")[1];
        console.log("Found authToken:", token);

        if(token){
            console.log("Token found, storing in localStorage");
            localStorage.setItem("tokens", JSON.stringify({accessToken: token}));
            zu_login();

            const provider = document.cookie
            .split(";")
            .find((row)=> row.startsWith("snsProvider="))
            ?.split("=")[1];
            console.log("Found provider:", provider);
            
            if(provider){
                localStorage.setItem("snsProvider", provider);  //  "snsProvider" : kakao
            }
            navigate("/")
        } else{
            console.log("authToken 쿠키 없음 - 로그인 실패로 간주")
            navigate("/login");
        }

    },[navigate, zu_login]);
    return<p>소셜 로그인 처리 중 입니다...</p>
}