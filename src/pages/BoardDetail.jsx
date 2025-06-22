import "../styles/boarddetail.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardDetail, boardDelete, boardUpdate, downloadFile } from "../api/auth";

export default function BoardDetail(){
    const navigate = useNavigate();
    const {id: b_idx} = useParams();
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const response = await getBoardDetail(b_idx);
                if(response.data.success){
                    setBoard(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error("게시판 상세내역을 불러오는 중 오류 발생:", error);
                setError("게시판 상세내역을 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();

    }, [b_idx]);

    /* 게시판 삭제 */
    const handleDelete = async () => {
        const pwd = prompt("게시글을 삭제하려면 비밀번호를 입력하세요.");

        if (pwd) { // 사용자가 비밀번호를 입력하고 '확인'을 누른 경우
            try {
                const response = await boardDelete({ b_idx, pwd });
                if(response.data.success){
                    alert("게시판이 삭제되었습니다.");
                    navigate("/boardlist");
                } else {
                    alert(response.data.message || "삭제 중 오류가 발생했습니다.");
                }
            } catch (error) {
                console.error("게시판 삭제 중 오류 발생:", error);
                alert("게시판 삭제 중 오류가 발생했습니다.");
            }
        }
    }

    /* 게시판 수정 */
    const handleUpdate = () => {
        navigate(`/boardupdate/${b_idx}`, {
            state: {
                boardData: board
            }
        });
    }

    // 로딩 중일 때
    if (loading) {
        return (
            <div className="board-detail-container">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    // 에러가 있을 때
    if (error) {
        return (
            <div className="board-detail-container">
                <div className="error">에러: {error}</div>
            </div>
        );
    }

    // board 데이터가 없을 때
    if (!board) {
        return (
            <div className="board-detail-container">
                <div className="error">게시글을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return(
        <div className="board-detail-container">
            <h2 className="board-detail-title">게시판 상세내역</h2>
            <div className="board-detail-content">
                <div className="detail-item">
                    <span className="detail-label">번호</span>
                    <span className="detail-value">{b_idx}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">작성자</span>
                    <span className="detail-value">{board.writer}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">제목</span>
                    <span className="detail-value">{board.title}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">내용</span>
                    <span className="detail-value">{board.content}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">조회수</span>
                    <span className="detail-value">{board.hit}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">작성일</span>
                    <span className="detail-value">{board.regdate}</span>
                </div>
                <div className="buttons">
                    <button className="back-button" onClick={() => navigate("/boardlist")}>목록으로 돌아가기</button>
                    <button className="delete-button" onClick={handleDelete}>게시판 삭제</button>
                    <button className="update-button" onClick={handleUpdate}>게시판 수정</button>
                </div>
            </div>
        </div>
    )
}
