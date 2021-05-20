import React from 'react'
import { Link } from 'react-router-dom'
import PrintButton from './PrintButton'

export const Modal = ({ id, title, className='', children }) => (
  <div className={'conv-modal '+className} id={id} tabIndex={-1}>
    <div className='modal-dialog'>
      <div>
        <div className='conv-modal-header'>
          <h5>{title}</h5>
          <button type='button' data-dismiss='modal'>&times;</button>
        </div>
        <div className='conv-modal-body'>
          {children}
        </div>
      </div>
    </div>
  </div>
)

const ImageModal = ({ id, title, className, url }) => {
  let child
  if (!url) {
    child = (
      <div className='conv-image-modal conv-image-modal-loading'>{'...generating image'}</div>
    )
  } else {
    child = (
      <div className='conv-image-modal conv-image-modal-loaded'>
        <div>
          <a href={url} target='_blank' rel='noopener noreferrer'>
            <img className='img-fluid' src={`${url}?ts=${Date.now()}`} />
          </a>
        </div>
        <div>
          <a className='text-secondary' href={url} target='_blank' rel='noopener noreferrer'>Click to view the original image.</a>
        </div>
        <div>
          <PrintButton url={url} />
        </div>
      </div>
    )
  }
  return (
    <Modal {...{ id, title, className }}>
      {child}
    </Modal>
  )
}

export const ImageLinkModal = ({
  id,
  title,
  className,
  url
}) => {
  if (!url || url === 'None') { return <span>No Image</span> }
  return (
    <React.Fragment>
      <Link to={`show-${id}`} data-toggle='modal' data-target={'#' + id}>
        Click to view
      </Link>
      <ImageModal {...{ id, title, className, url }} />
    </React.Fragment>
  )
}
