import React from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './PnrModal.css'; 

const PnrModal = ({ isOpen, onRequestClose, ticketData, downloadExcel, downloadPDF, handleDelete }) => {

  const confirmDelete = (pnr) => {
    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: "Bu işlem geri alınamaz!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'Hayır, iptal et'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(pnr); 
        Swal.fire(
          'Silindi!',
          'Bilet başarıyla silindi.',
          'success'
        );
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Bilet Bilgileri"
      ariaHideApp={false}
      className="modal" 
      overlayClassName="Overlay" 
    >
      <h3>Bilet Bilgileri</h3>
      {ticketData ? (
        <>
          <p><strong>Sefer ID:</strong> {ticketData.trip_id}</p>
          <p><strong>İsim:</strong> {ticketData.name}</p>
          <p><strong>Soyisim:</strong> {ticketData.surname}</p>
          <p><strong>Başlangıç:</strong> {ticketData.fromLoc}</p>
          <p><strong>Varış:</strong> {ticketData.toLoc}</p>
          <p><strong>Fiyat:</strong> {ticketData.price} TL</p>
          <p><strong>Durum:</strong> {ticketData.status}</p>
          
          <button onClick={downloadExcel}>Excel İndir</button>
          <button onClick={downloadPDF}>PDF İndir</button>
          <button onClick={() => confirmDelete(ticketData.pnr)}>Bileti Sil</button></>
      ) : (
        <p>Bilet bulunamadı.</p>
      )}
      <button onClick={onRequestClose}>Kapat</button>
    </Modal>
  );
};

export default PnrModal;
