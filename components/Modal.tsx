
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
            <button onClick={closeModal} style={{padding: "0.5rem", border: "transparent", transition: "200ms ease-in-out"}}>
              {closeIcon}
            </button>
        </figure>
        {dialogContent}
      </div>
    </section>
  )
}

export default Modal