
import {Logo} from '.';

const Modal = ({
  dialogContent, 
  closeIcon, 
  closeModal
}: ModalProps) => {
  return (
    <section className="modal">
      <div className="modal-overlay" onClick={closeModal}/>
      <div className="dialog-box">
        <figure>
            <Logo/>
            <button onClick={closeModal}>
              {closeIcon}
            </button>
        </figure>
        {dialogContent}
      </div>
    </section>
  )
}

export default Modal