export default function Button({text, onClick}){
    return(
        <button onClick={onClick} style={{padding:"10px", cursor:"pointer", margin}}>{text}</button>
    )
}