import './KebabModal.css';
import Trash from '../../assets/trash2.png';
import { useRef, useEffect } from 'react';

const KebabModal = ({ user, isDialogOpen, handleDelete }) => {
    // const modalRef = useRef(null);

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (modalRef.current && !modalRef.current.contains(event.target)) {
    //             setDialogOpen(!isDialogOpen);
    //         }
    //     }

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [setDialogOpen]);

    if(!isDialogOpen) return null;

    return (
        <div className="kebab-modal" onClick={() => handleDelete(user._id)}>
                <img src={Trash} alt="trashIcon" />
                <p>Delete </p>
        </div>
    );
};

export default KebabModal;
