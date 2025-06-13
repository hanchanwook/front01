import '../styles/bookdetail.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGuestBookDetail, deleteGuestBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function BookDetail(){
    const navigate = useNavigate();
    const {id: gb_idx} = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const response = await getGuestBookDetail(gb_idx);
                if(response.data.success){
                    setBook(response.data.data);
                } else{
                    setError(response.data.message);
                }
            } catch (error) {
                console.error("방명록 상세내역을 불러오는 중 오류 발생:", error);
                setError("방명록 상세내역을 불러올 수 없습니다.");
            }
        }
        fetchBookDetail();
    }, [gb_idx]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 방명록을 삭제하시겠습니까?')) {
            try {
                const response = await deleteGuestBook(gb_idx);
                if (response.data.success) {
                    alert('방명록이 삭제되었습니다.');
                    navigate('/guestbook');
                } else {
                    alert(response.data.message || '삭제 중 오류가 발생했습니다.');
                }
            } catch (error) {
                console.error("방명록 삭제 중 오류 발생:", error);
                alert('방명록 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleUpdate = () => {

        navigate(`/guestbookupdate/${gb_idx}`, {
            state: {
                bookData: book // 수정 페이지에서 사용할 데이터
            }
        });
    };

    if (error) return <div>에러 발생: {error}</div>;
    if (!book) return <div>Loading...</div>;

    return(
        <div className="book-detail-container">
            <div className="book-detail-header">
                <h2>방명록 상세내역</h2>
            </div>
            <div className="book-detail-content">
                <div className="detail-item">
                    <span className="detail-label">번호</span>
                    <span className="detail-value">{gb_idx}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">작성자</span>
                    <span className="detail-value">{book.gb_name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">제목</span>
                    <span className="detail-value">{book.gb_subject}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">이메일</span>
                    <span className="detail-value">{book.gb_email}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">작성일</span>
                    <span className="detail-value">{book.gb_regdate}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">첨부파일</span>
                    {book.gb_f_name && (
                        <img src={`http://localhost:8080/guestbook/${book.gb_f_name}`} alt="첨부이미지" />
                    )}
                    <span className="detail-value">{book.gb_f_name}</span>
                </div>
                <div className="detail-content">
                    {book.gb_content}
                </div>
                <div className="buttons">
                    <button className="back-button" onClick={() => navigate("/guestbook")}>목록으로 돌아가기</button>
                    <button className="delete-button" onClick={handleDelete}>방명록 삭제</button>
                    <button className="update-button" onClick={handleUpdate}>방명록 수정</button>
                </div>
            </div>
        </div>
    )
}

