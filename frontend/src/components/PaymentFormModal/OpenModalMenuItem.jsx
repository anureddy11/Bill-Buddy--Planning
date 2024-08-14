import { useModal } from '../../context/Modal';
import './PaymentFormModal.css'; // Assuming this is the CSS file being used

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the button that opens the modal
  onItemClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <div onClick={onClick} className="open-modal-menu-item">
      <span className="menu-item-text">{itemText}</span>
    </div>
  );
}

export default OpenModalMenuItem;
