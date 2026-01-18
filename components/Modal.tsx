
import { useGlobalContext } from '@/lib/hooks/useGlobalContext';
import {ActionButton, Alert, Logo} from '.';
// import { ModalProps } from '..';

// {
//   closeIcon,
//   closeModal,
//   error,
//   setError,
//   footerButtons,
//   contentBody
// }: ModalProps

const Modal = () => {
  const {modal, closeModal, showModalError: setError, modalError: error} = useGlobalContext();

  const {closeIcon, content: contentBody, buttons: footerButtons} = modal

  if(!modal.state) return null;

  return (
    <>
    <main className="modal">
    <div className="modal-overlay" onClick={closeModal}/>
    <Alert error={error} setError={setError} className='modal-error-alert'/>
      <section className='modal-content'>
        <div className="dialog-box">
          <div className="header-constraint">
            <div className='header-bg'/>
          </div>
          <figure className='dialog-header'>
              <Logo inactive />
              <button className='modal-home-btn' onClick={closeModal}>
                {closeIcon}
              </button>
          </figure>
          <article className='dialog-content'>
            <section>
                {contentBody}
            </section>
            {footerButtons && footerButtons.length > 0 && (<div className="dialog-btns">
              {footerButtons.map(btn => (
                <ActionButton
                  key={btn.text}
                  action={btn.action}
                  className= {btn.className}
                  src= {btn?.src}
                  alt= {btn?.alt}
                  text = {btn.text}
                />
              )
              )}
            </div>)}
          </article>
        </div>
      </section>
    </main>
    </>
  )
}

export default Modal