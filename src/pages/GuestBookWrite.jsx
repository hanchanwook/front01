import { useNavigate } from 'react-router-dom';
import '../styles/guestbookwrite.css';
import { useState } from 'react';
import { guestBookWrite } from '../api/auth';

export default function GuestBookWrite(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        gb_name: "",
        gb_email: "",
        gb_subject: "",
        gb_content: "",
        gb_f_name: null
    });


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Create guestbook object
        const guestbookData = {
            gb_name: form.gb_name,
            gb_email: form.gb_email,
            gb_subject: form.gb_subject,
            gb_content: form.gb_content,
    
        };
        
        // Append guestbook data as JSON
        formData.append("guestbook", new Blob([JSON.stringify(guestbookData)], {
            type: "application/json"
        }));
        
        // Append file if exists
        if (form.gb_f_name) {
            formData.append("file", form.gb_f_name);
        }

        try {
            const tokens = JSON.parse(localStorage.getItem("tokens"));
            const accessToken = tokens.accessToken;

            const response = await fetch('/api/guestbook/guestbookwrite', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });
            const result = await response.json();
            if(result.success){
                alert("방명록이 등록되었습니다.");
                navigate("/guestbook");
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("등록 중 오류 발생");
        }
    };



    return(
        <div className="guestbook-write-container">
            <h2>방명록 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름 : </label>
                    <input type="text" name="gb_name" onChange={handleChange} />
                </div>
                <div>
                    <label>이메일 : </label>
                    <input type="email" name="gb_email" onChange={handleChange} />
                </div>
                <div>
                    <label>제목 : </label>
                    <input type="text" name="gb_subject" onChange={handleChange} />
                </div>
                <div>
                    <label>내용 : </label>
                    <textarea name="gb_content" rows="5" cols="50" onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>첨부파일 : </label>
                    <input type="file" name="gb_f_name" onChange={handleChange} />
                </div>
                <button type="submit">등록</button>
            </form>
        </div>
    )
}