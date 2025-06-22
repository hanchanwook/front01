import "../styles/boardlist.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBoardList } from "../api/auth";

export default function BoardList(){

    const navigate = useNavigate();
    const [boardList,  setBoardList] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // 페이지는 1부터 시작
    const itemsPerPage = 10; // 페이지 당 10개 항목
    
    useEffect(()=>{
        const fetchBoardList = async()=>{
            try {
                const response = await getBoardList();
                console.log(response.data);
                if(response.data.success){
                    // 모든 데이터를 가져와서 최신순으로 뒤집어 저장
                    setBoardList(response.data.data.reverse());
                } else{
                    setError(response.data.message);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }
        fetchBoardList();
    }, []);

    // 페이지네이션 로직
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = boardList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(boardList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (error) return <div>에러 발생: {error}</div>;

    return(
        <div className="board-container">
            <h2 className="board-title">게시판</h2>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>조회수</th>
                        <th>작성일</th>  
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((board, index) => (
                        <tr 
                            key={board.b_idx}
                            onClick={() => navigate(`/boarddetail/${board.b_idx}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{boardList.length - (indexOfFirstItem + index)}</td>
                            <td>{board.writer}</td>
                            <td>{board.title}</td>
                            <td>{board.hit}</td>
                            <td>{board.regdate.substring(0, 10)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'right' }}>
                            <button onClick={() => navigate("/boardinsert")} className="board-write-button">글쓰기</button>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="pagination-container">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                        {pageNumber}
                    </button>
                ))}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    다음
                </button>
            </div>
        </div>
    )
}