import {api} from "./http";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { getToken } from "../utils/token";

// 스프링 서버에 보낼 것을 모아 놓은 것
// 1. 로그인
export const login = (m_id, m_pw) => 
    api.post("/members/login",{m_id, m_pw}) // POST /members/login 엔드포인트로 {m_id, m_pw}를 가지고 로그인 요청을 보냄

// 2. 회원가입
export const register = (member) =>
    api.post("/members/register", member) // POST /members/register 엔드포인트로 member 객체를 가지고 회원가입 요청을 보냄

// 3. 마이페이지
//export const myPage = (m_idx) => 
//    api.post("/members/mypage", {m_idx}) // POST /members/mypage 엔드포인트로 {m_idx}를 가지고 마이페이지 요청을 보냄 

export const myPage =() =>
    api.get("/members/mypage")

// 4. 방명록 목록 조회
export const getGuestBookList = () =>
    api.get("/guestbook/guestbooklist")

// 5. 방명록 상세 내역
export const getGuestBookDetail = (id) => {
    return api.get("/guestbook/guestbookdetail", {
      params: { gb_idx: id }
    });
  };

// 6. 방명록 작성
export const guestBookWrite = (formData) =>
    api.post("/guestbook/guestbookwrite", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });  

// 7. 방명록 삭제
export const deleteGuestBook = (gb_idx) =>
    api.post("/guestbook/guestbookdelete", null, {
        params: { gb_idx }
    });

// 8. 방명록 수정
export const guestBookUpdate = async (formData) => {
    try {
        console.log('[guestBookUpdate] 호출됨');
        console.log('formData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        const response = await axios.post(
            `${API_BASE_URL}/api/guestbook/guestbookupdate`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
        );
        return response;
    } catch (error) {
        console.error('방명록 수정 중 오류:', error);
        throw error;
    }
};

// 9. 방명록 첨부파일 이미지 조회
export const getGuestBookImage = async (gb_f_name) => {
    const response = await api.get(`/api/guestbook/guestbookimage/${gb_f_name}`, {
        responseType: 'blob'
    });
    return response;
}

// 10. 방명록 첨부파일 다운로드
export const downloadFile = async (gb_f_name) => {
    const response = await api.get(`/api/guestbook/guestbookdownload/${gb_f_name}`, {
        responseType: 'blob'
    });

    return response;
}

// 11. 게시판 목록 조회
export const getBoardList = async (page = 0, size = 10) => {
    console.log(`getBoardList 호출 (page: ${page}, size: ${size})`);
    const response = await api.get("/board/boardlist", {
        params: { page, size }
    });
    console.log("getBoardList 응답:", response.data);
    return response;
}

// 12. 게시판 상세 조회
export const getBoardDetail = async (id) => {
    console.log("getBoardDetail 호출");
    const response = await api.get("/board/boarddetail", {
        params: { b_idx: id }
    });
    console.log("getBoardDetail 응답:", response.data);
    return response;
}

// 13. 게시판 삭제
export const boardDelete = async (boardVO) => {
    console.log("boardDelete 호출", boardVO);
    const response = await api.post("/board/boarddelete", boardVO); // boardVO 객체를 body에 담아 전송
    console.log("boardDelete 응답:", response.data);
    return response;
}

// 14. 게시판 수정
export const boardUpdate = async (formData) => {
    console.log("boardUpdate 호출");
    const response = await api.post("/board/boardupdate", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    console.log("boardUpdate 응답:", response.data);
    return response;
}

// 15. 게시판 작성
export const boardInsert = async (formData) => {
    console.log("boardInsert 호출");
    const response = await api.post("/board/boardinsert", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    console.log("boardInsert 응답:", response.data);
    return response;
}

//  인터셉터
//  1. 모든 요청을 가로 챈다 - 요청이 발생하면 인터셉터에서 config 객체를 확인한다.
//  2. 특수 요청 제외 - login, register
api.interceptors.request.use(
    (config) => {
        const excludePaths = ["/members/login","/members/register"]; // 인터셉터에서 제외 됨
            if(!excludePaths.includes(config.url)){
                const tokens = localStorage.getItem("tokens");
                if(tokens){
                    const parsed = JSON.parse(tokens);      // 객체로 파싱
                    if(parsed.accessToken){
                        config.headers.Authorization = `Bearer ${parsed.accessToken}`   // 문자열로 출력됨
                    }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    // 정상적인 응담은 통과
    res => res , 
    async (error) => {
        const {config, response} = error;
        //  401 에러 => accessToken 만료되면
        if(response?.status === 401 && !config._retry){
            config._retry = true;   //  한 번만 재시도하도록 설정
            try {
                const tokens = JSON.parse(localStorage.getItem("tokens"));
                const result = await api.post("/members/refresh",{
                    refreshToken : tokens.refreshToken
                });
                const {accessToken, refreshToken} = result.data.data;
                localStorage.setItem("tokens", JSON.stringify({accessToken, refreshToken}));
                
                config.headers.Authorization = `Bearer ${accessToken}`;
                return api(config);

            } catch (error) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
)



