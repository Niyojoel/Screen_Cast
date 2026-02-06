'use client'
import { useGlobalContext } from '@/lib/hooks/useGlobalContext';
import {ActionButton, Alert, FullView, Logo} from '.';

const Modal = () => {
  const {modalOpen, modalContent, exitModal, closeModal} = useGlobalContext();

  const {closeIcon, isOpen} = modalOpen

  if(!isOpen) return null;

  return modalContent.body && (
    <>
    <main className="modal">
      <FullView/>
      <div className="modal-overlay" onClick={closeModal}/>
      <section className='modal-content'>
        <div className="dialog-box">
          <div className="header-constraint">
            <div className='header-bg'/>
          </div>
          <figure className='dialog-header'>
              <Logo inactive />
              <button className='modal-home-btn' onClick={exitModal}>
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