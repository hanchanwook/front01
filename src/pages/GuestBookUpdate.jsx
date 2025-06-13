import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import '../styles/guestbookupdate.css';
import { guestBookUpdate } from '../api/auth';

export default function GuestBookUpdate(){
    const location = useLocation();
    const { id: gb_idx } = useParams();
    const navigate = useNavigate();
    const bookData = location.state?.bookData;
    
    console.log("useParams로 받은 gb_idx:", gb_idx);

    const [gb_name, setGb_name] = useState(bookData?.gb_name || '');
    const [gb_email, setGb_email] = useState(bookData?.gb_email || '');
    const [gb_subject, setGb_subject] = useState(bookData?.gb_subject || '');
    const [gb_content, setGb_content] = useState(bookData?.gb_content || '');
    const [gb_f_name, setGb_f_name] = useState(bookData?.gb_f_name || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const guestbook = {
            gb_name: gb_name,
            gb_email: gb_email,
            gb_subject: gb_subject,
            gb_content: gb_content,

        };

        
        try {
            console.log(gb_idx);
            // FormData 객체 생성
            const formData = new FormData();
            formData.append('gb_idx', gb_idx);
            formData.append('guestbook', new Blob([JSON.stringify(guestbook)], {
                type: 'application/json'
            }));
            
            // 파일이 새로 선택된 경우에만 append
            if(gb_f_name && gb_f_name instanceof File){
                formData.append('file', gb_f_name);
            }

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await guestBookUpdate(formData);
            if(response.data.success){
                alert('방명록이 수정되었습니다.');
                navigate('/guestbook');
            } else {
                alert(response.data.message || '수정 중 오류가 발생했습니다. ');
            }
        } catch (error) {
            console.error("방명록 수정 중 오류 발생 : ", error);
            alert('방명록 수정 중 오류가 발생했습니다.');
        }
    }

    useEffect(() => {
        if(bookData){
            setGb_name(bookData.gb_name);
            setGb_email(bookData.gb_email);
            setGb_subject(bookData.gb_subject);
            setGb_content(bookData.gb_content);
        }
    }, [bookData]);

    return(
        <div className="guestbook-update-container">
            <h2>방명록 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="book-detail-content">
                    <div className="detail-item">
                        <span className="detail-label">번호</span>
                        <span className="detail-value">{gb_idx}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">작성자</span>
                        <input 
                            type="text" 
                            value={gb_name}
                            onChange={(e) => setGb_name(e.target.value)}
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">제목</span>
                        <input 
                            type="text" 
                            value={gb_subject}
                            onChange={(e) => setGb_subject(e.target.value)}
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">이메일</span>
                        <input 
                            type="email" 
                            value={gb_email}
                            onChange={(e) => setGb_email(e.target.value)}
                        />
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">첨부파일</span>
                        <input 
                            type="file" 
                            onChange={(e) => setGb_f_name(e.target.files[0])}
                        />
                    </div>
                    <div className="detail-content">
                        <textarea 
                            value={gb_content}
                            onChange={(e) => setGb_content(e.target.value)}
                        />
                    </div>
                    <div className="buttons">
                        <button type="button" className="back-button" onClick={() => navigate(`/bookdetail/${gb_idx}`)}>취소</button>
                        <button type="submit" className="update-button">수정하기</button>
                    </div>
                </div>
            </form>
        </div>
    )
}