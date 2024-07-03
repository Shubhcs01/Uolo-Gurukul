import './KebabModal.css';
import Trash from '../../assets/trash.png';

const KebabModal = ({user, handleDelete}) => {
    return <div className="kebab-modal" onClick={()=>handleDelete(user._id)}>
        <img src={Trash} alt="trashIcon"/>
        <p>Delete...</p>
    </div>
}

export default KebabModal;