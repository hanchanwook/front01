import { useEffect, useState } from "react";
import "../styles/guestbook.css";
import { getGuestBookList } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function GuestBook(){

    const [error, setError] = useState(null);
    const [guestBooks, setGuestBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchGuestBooks = async()=>{
            try {
                const response = await getGuestBookList();
                console.log(response.data);
                if(response.data.success){
                    setGuestBooks(response.data.data);
                } else{
                    setError(response.data.message);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);                
            }
        }
        fetchGuestBooks();
    }, [])

    if (error) return <div>에러 발생: {error}</div>;

    return(
        <div className="guestbook-container">
            <h1>방명록</h1>
            <div className="guestbook-list">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>이름</th>
                            <th>제목</th>
                            <th>이메일</th>
                            <th>날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guestBooks.map((book, index) => (
                            <tr 
                                key={index + 1}
                                onClick={() => navigate(`/bookdetail/${book.gb_idx}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{index + 1}</td>
                                <td>{book.gb_name}</td>
                                <td>{book.gb_subject}</td>
                                <td>{book.gb_email}</td>
                                <td>{book.gb_regdate}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">
                                <button onClick={() => navigate("/guestbookwrite")} className="guestbook-write-button">글쓰기</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}