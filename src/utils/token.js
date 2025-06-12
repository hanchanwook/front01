// 토큰 관련 유틸리티 함수들

// localStorage에서 토큰 가져오기
export const getToken = () => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
        const { accessToken } = JSON.parse(tokens);
        return accessToken;
    }
    return null;
};

// 토큰 저장하기
export const setToken = (accessToken, refreshToken) => {
    localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));
};

// 토큰 삭제하기
export const removeToken = () => {
    localStorage.removeItem('tokens');
}; 