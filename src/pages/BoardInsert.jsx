import "../styles/boardinsert.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { boardInsert } from "../api/auth";

export default function BoardInsert(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        title: "",
        writer: "",
        pwd: "",
        content: "",
        file: null
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
        
        if (!form.title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!form.writer.trim()) {
            alert("작성자를 입력해주세요.");
            return;
        }
        
        if (!form.pwd.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (form.pwd.length < 4) {
            alert("비밀번호는 최소 4자 이상 입력해주세요.");
            return;
        }

        if (!form.content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            
            const boardData = {
                title: form.title,
                writer: form.writer,
                pwd: form.pwd,
                content: form.content,
                b_f_name: form.file ? form.file.name : null,
                hit: 0
            };
            formData.append('board', new Blob([JSON.stringify(boardData)], {
                type: 'application/json'
            }));
            
            if (form.file) {
                formData.append('file', form.file);
            }

            const response = await boardInsert(formData);
            
            if (response.data.success) {
                alert("게시글이 성공적으로 작성되었습니다.");
                navigate("/boardlist");
            } else {
                setError(response.data.message || "게시글 작성에 실패했습니다.");
            }
        } catch (error) {
            console.error("게시글 작성 중 오류 발생:", error);
            setError("게시글 작성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까? 작성 중인 내용이 사라집니다.")) {
            navigate("/boardlist");
        }
    };

    return(
        <div className="board-insert-container">
            <div className="board-insert-header">
                <h2 className="board-insert-title">게시판 작성</h2>
                <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={handleCancel}
                >
                    취소
                </button>
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form className="board-insert-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        value={form.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="제목을 입력하세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="writer" className="form-label">작성자</label>
                    <input 
                        type="text" 
                        id="writer" 
                        name="writer" 
                        value={form.writer}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="작성자를 입력하세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="pwd" className="form-label">비밀번호</label>
                    <input 
                        type="password" 
                        id="pwd" 
                        name="pwd" 
                        value={form.pwd}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="비밀번호를 입력하세요"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content" className="form-label">내용</label>
                    <textarea 
                        id="content" 
                        name="content" 
                        value={form.content}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="내용을 입력하세요"
                        rows="10"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="file" className="form-label">첨부파일</label>
                    <input 
                        type="file" 
                        id="file" 
                        name="file" 
                        onChange={handleChange}
                        className="form-file"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <div className="file-info">
                        {form.file && (
                            <span className="selected-file">
                                선택된 파일: {form.file.name}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? "작성 중..." : "작성하기"}
                    </button>
                </div>
            </form>
        </div>
    );
}