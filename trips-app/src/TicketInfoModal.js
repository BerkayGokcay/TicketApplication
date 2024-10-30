import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');  
function TicketInfoModal({ ticket, onClose }) {
  return (
    <Modal isOpen={true} onRequestClose={onClose}>
      <h2>İptal Edilen Bilet</h2>
      <p><strong>PNR:</strong> {ticket.pnr}</p>
      <p><strong>Isim:</strong> {ticket.name}</p>
      <p><strong>Soyisim:</strong> {ticket.surname}</p>
      <p><strong>Sefer ID:</strong> {ticket.trip_id}</p>
      <p><strong>Koltuk No:</strong> {ticket.seat_no}</p>
      <p><strong>Fiyat:</strong> {ticket.price} ₺</p>
      <button onClick={onClose}>Kapat</button>
    </Modal>
  );
}

export default TicketInfoModal;
