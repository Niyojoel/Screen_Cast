'use client'
import { useGlobalContext } from '@/lib/hooks/useGlobalContext';
import {ActionButton, Alert, Logo} from '.';

const Modal = () => {
  const {modalOpen, modalContent, closeModal, showModalError: setError, modalError: error} = useGlobalContext();

  const {closeIcon, isOpen} = modalOpen

  if(!isOpen) return null;

  return modalContent.body && (
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
                {modalContent?.body}
            </section>
            {modalContent?.buttons && modalContent?.buttons.length > 0 && (<div className="dialog-btns">
              {modalContent?.buttons.map(btn => (
                <ActionButton
                  key={btn.text}
                  action={btn.action}
                  className= {btn.className}
                  text = {btn.text}
                >
                  {btn?.icon && btn.icon}
                </ActionButton>
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