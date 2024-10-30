import axios from "axios";
import React from "react";
import Modal from "react-modal";
import { saveAs } from 'file-saver'; 
import * as XLSX from 'xlsx'; 
import jsPDF from 'jspdf'; 
import './TripApp.css';
import PnrModal from './PnrModal'; 
import Swal from "sweetalert2"; 





Modal.setAppElement('#root');

function App() {
  const [useFastAPI, setUseFastAPI] = React.useState(true); // Varsayılan olarak FastAPI kullan
  const [value, setValue] = React.useState("");
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [trips, setTrips] = React.useState([]);
  const [filteredTrips, setFilteredTrips] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState(null);
  const [gender, setGender] = React.useState("");
  const [selectedSeat, setSelectedSeat] = React.useState(null); // Seçilen koltuk
  const [ticketData,setTicketData] = React.useState(null); // Bilet verileri
  const [isModalOpen, setIsModalOpen] = React.useState(false); // Modal durumu  
  const [pnr, setPnr] = React.useState("");
  const [error, setError] = React.useState(""); // Hata mesajı
  const [isOpenPnr, setIsOpenPnr] = React.useState(false); // Açık/kapatma durumu
  const [email, setEmail] = React.useState('');
  const [activeTab, setActiveTab] = React.useState("purchase"); // Başlangıçta "purchase" sekmesi aktif

  const handleApiSwitch = () => {
    // API'yi değiştir
    setUseFastAPI((prev) => !prev);
    
    // Mevcut form verilerini sıfırla
    setName("");
    setSurname("");
    setGender("");
    setSelectedTrip(null);
    setSelectedSeat(null);
    setTicketData(null);
    setFilteredTrips([]); 
    setTrips([]); 
    setError(""); 
    setIsModalOpen(false); 
    setIsOpenPnr(false); 
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async () => {
    try {
        if(useFastAPI){
          await axios.delete(`http://127.0.0.1:8000/deleteTicket`,{params: { pnr }});
          setTicketData(null); // Silindikten sonra ticketData'yı sıfırla
          setError(""); 
        }
        else if(!useFastAPI){
          await axios.delete(`http://127.0.0.1:8080/api/tickets/deleteTicket`,{params: { pnr }});
          setTicketData(null);
          setError(""); 
        }
    } catch (err) {
        setError("Bilet silinirken bir hata oluştu."); 
        console.error(err); 
    }
  };
  function fetchTrips() {

    const url = useFastAPI 
    ? "http://127.0.0.1:8000/trips" // FastAPI
    : "http://127.0.0.1:8080/api/trips";// Springboot API
    axios.get(url)
      .then((response) => {
        console.log("Seferler:", response.data);
        setTrips(response.data);
        setFilteredTrips(response.data);
      })
      .catch((error) => {
        console.error("Seferler alınırken hata:", error);
      });
  }

  function fetchSeats() {
    if (useFastAPI) {
        axios.get("http://127.0.0.1:8000/seats")
            .then((response) => {
                console.log("FastAPI Koltuklar:", response.data);
                setTrips(response.data); 
                setFilteredTrips(response.data); 
            })
            .catch((error) => {
                console.error("Koltuk haritası alınırken hata:", error);
            });
    } else {
        axios.get("http://127.0.0.1:8080/api/seats")
            .then((response) => {
                console.log("Spring Boot Koltuklar:", response.data);
                setTrips(response.data); // Sefer verilerini state'e kaydet
                setFilteredTrips(response.data); 
            })
            .catch((error) => {
                console.error("Koltuk haritası alınırken hata:", error);
            });
    }
}
  const handleNameChange = (e) => {
    setName(e.target.value); // İsmi güncelle
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value); // Soyismi güncelle
  };

  function handleFilter(e) {
    const searchValue = e.target.value.toLowerCase();
    setValue(searchValue);
  
    const filtered = trips.filter((trip) => {
      // FastAPI ve Spring Boot'taki alan adlarını kontrol ediyoruz
      const toLocation = trip.to_location 
        ? trip.to_location.toLowerCase() 
        : trip.toLocation 
        ? trip.toLocation.toLowerCase() 
        : "";
  
      const fromLocation = trip.from_location 
        ? trip.from_location.toLowerCase() 
        : trip.fromLocation 
        ? trip.fromLocation.toLowerCase() 
        : "";
  
      return toLocation.includes(searchValue) || fromLocation.includes(searchValue);
    });
  
    setFilteredTrips(filtered);
  }
  
  function selectTrip(trip) {
    setSelectedTrip(trip);
    setSelectedSeat(null); // Yeni sefer seçildiğinde koltuğu sıfırla
    setGender(""); // Cinsiyeti sıfırla
  }
  function generateCustomID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const handleSearch = async () => {
    try {
      debugger;
      if(useFastAPI){
      const response = await axios.get(`http://127.0.0.1:8000/ticketPnr`, { params: { pnr } });
      setTicketData(response.data);
      setError("");  // Önceki hataları temizle
      setIsOpenPnr(true); // Modalı aç
      }
      else if(!useFastAPI){
      const response = await axios.get(`http://127.0.0.1:8080/api/tickets/ticketPnr`, {
        params: { pnr }
      });
      setTicketData(response.data);
      setError("");  // Önceki hataları temizle
      setIsOpenPnr(true); // Modalı aç
      }
    } catch (err) {
      setTicketData(null); // Veri yoksa ticketData'yı temizle
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Bilet bulunamadı veya geçersiz PNR kodu.",
        confirmButtonText: "Tamam",
      });
    }
  };

  function purchaseTicket() { // Varsayılan olarak FastAPI
    if (!selectedTrip || !gender || selectedSeat === null) return;
    debugger;
    if(useFastAPI){
      const ticketData = {
        trip_id: selectedTrip.id,
        eMail: email,
        seat_count: selectedSeat,
        tripDate: selectedTrip.trip_date,
        depTime: selectedTrip.departure_time,
        arrTime: selectedTrip.arrival_time,
        fromLoc: selectedTrip.from_location,
        toLoc: selectedTrip.to_location,
        gender: gender,
        price: selectedTrip.price,
        pnr: generateCustomID(),
        name: name,
        surname: surname,
        status: "active"
      };
      axios.post("http://127.0.0.1:8000/BuyTicket", ticketData)
      .then((response) => {
        console.log("Bilet satın alındı:", response);
        setTicketData(ticketData);
        setIsModalOpen(true);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: `Bilet satın alınırken bir hata oluştu: ${error.message}`,
          confirmButtonText: "Tamam",
        });   
      });
    }
    else if(!useFastAPI){
      console.log(selectedSeat);
      console.log(selectedTrip);
      const ticketData = {
        trip_id: selectedTrip.id,
        eMail: email,
        seat_count: selectedSeat,
        tripDate: selectedTrip.trip_date,
        depTime: selectedTrip.departureTime,
        arrTime: selectedTrip.arrivalTime,
        fromLoc: selectedTrip.fromLocation,
        toLoc: selectedTrip.toLocation,
        gender:gender,
        price: selectedTrip.price,
        pnr: generateCustomID(),
        name:name,
        surname:surname,
        status:"active"
      };
      console.log(ticketData);
      axios.post("http://127.0.0.1:8080/api/tickets/PurchaseTicket", ticketData)
      .then((response) => {
        console.log("Bilet satın alındı:", response);
        debugger;
        setTicketData(ticketData);
        setIsModalOpen(true);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: `Bilet satın alınırken bir hata oluştu: ${error.message}`,
          confirmButtonText: "Tamam",
        });   
      });
      console.log(ticketData.pnr + " TICKETDATA");
    }
  }
  
// Excel çıktısı için
  function downloadExcel() {
    if (!ticketData) return;

    const worksheet = XLSX.utils.json_to_sheet([ticketData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ticket Data");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ticket_data.xlsx");
  }
  // PDF çıktısı için
  function downloadPDF() {
    if (!ticketData) return;

    const doc = new jsPDF();
    if(useFastAPI){
    doc.text(`Sefer ID: ${ticketData.trip_id}`, 10, 10);
    }
    else{
      doc.text(`Sefer ID: ${ticketData.tripId}`, 10, 10);
    }
    doc.text(`Koltugunuz: ${selectedSeat + 1}`, 10, 20);
    doc.text(`Isminiz: ${ticketData.name}`, 10, 30);
    doc.text(`Soyisminiz: ${ticketData.surname}`, 10, 40);
    doc.text(`Cinsiyet: ${ticketData.gender}`, 10, 50);
    doc.text(`PNR: ${ticketData.pnr}`, 10, 60);
    doc.text(`Fiyat: ${ticketData.price.toFixed(2)} tl`, 10, 70);
    doc.save("ticket_data.pdf");
  }
 
  React.useEffect(() => {
    fetchSeats();
    fetchTrips();
  }, [useFastAPI]);

  return (
 <div className="background">
      <div className="container">
        <img src="/logo.png" alt="MyTripApp Logo" className="logo" />
        <h1>MyTripApp</h1>
        <div className="api-buttons">
          <button onClick={handleApiSwitch}>
            {useFastAPI ? "Switch to Spring Boot" : "Switch to FastAPI"}
          </button>
        </div>

        <div className="tab-buttons">
          <button onClick={() => handleTabChange("purchase")}>
            Bilet Satın Al
          </button>
          <button onClick={() => handleTabChange("management")}>
            Bilet Yönetimi
          </button>
        </div>

        {/* Bilet Satın Al Sekmesi */}
        {activeTab === "purchase" && (
          <div className="trip-list">
            <strong><label className="yolculuk">Yolculuk nereye?</label></strong>
            <input
              className="search"
              type="text"
              placeholder="Yolculuk nereye hemşerim" 
              value={value}
              onChange={handleFilter}
            />

<h4>MEVCUT SEFERLER</h4>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kalkış Zamanı</th>
            <th>Varış Zamanı</th>
            <th>Nereden</th>
            <th>Nereye</th>
            <th>Boş Koltuklar</th>
            <th>Fiyat</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!useFastAPI ? (
            filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{new Date(trip.trip_date).toLocaleDateString()}</td>
                <td>{new Date(`1970-01-01T${trip.departureTime}`).toLocaleTimeString()}</td>
                <td>{new Date(`1970-01-01T${trip.arrivalTime}`).toLocaleTimeString()}</td>
                <td>{trip.fromLocation}</td>
                <td>{trip.toLocation}</td>
                <td>{trip.availableSeats}</td>
                <td>{trip.price.toFixed(2)} ₺</td>
                <td>
                  <button onClick={() => selectTrip(trip)}>Seç</button>
                </td>
              </tr>
            ))
          ) : null}
          {useFastAPI ?(
            filteredTrips.map((trip) => (
              <tr key={trip.id}>
                <td>{new Date(trip.trip_date).toLocaleDateString()}</td>
                <td>{new Date(`1970-01-01T${trip.departure_time}`).toLocaleTimeString()}</td>
                <td>{new Date(`1970-01-01T${trip.arrival_time}`).toLocaleTimeString()}</td>
                <td>{trip.from_location}</td>
                <td>{trip.to_location}</td>
                <td>{trip.available_seats}</td>
                <td>{trip.price.toFixed(2)} ₺</td>
                <td>
                  <button onClick={() => selectTrip(trip)}>Seç</button>
                </td>
              </tr>
            ))
          ):null}
        </tbody>
      </table>

            {/* Kullanıcı bilgileri ve koltuk seçimi */}
            {selectedTrip && (
              <div>
                {useFastAPI ? (<h2>Seçilen Sefer: {selectedTrip.to_location} - {selectedTrip.from_location}</h2>):<h2>Seçilen Sefer: {selectedTrip.toLocation} - {selectedTrip.fromLocation}</h2>}
                <div>
                  <label>İsminizi Girin: </label>
                  <input type="text" value={name} onChange={handleNameChange} />
                </div>
                <div>
                  <label>Soyisminizi Girin: </label>
                  <input type="text" value={surname} onChange={handleSurnameChange} />
                </div>
                <div>
                  <label>Epostanızı Girin: </label>
                  <input
                    type="text"
                    placeholder="E-posta adresinizi girin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label>Cinsiyet Seçin:</label>
                  <select onChange={(e) => setGender(e.target.value)} value={gender}>
                    <option value="">Cinsiyet seçin</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>
                <label>Koltuk Seçin:</label>
                <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "300px", marginLeft:"120px" }}>
                {(() => {
                  const seatMap = useFastAPI ? selectedTrip.seat_map : selectedTrip.seatMap;
                  
                  console.log("Koltuk Haritası:", seatMap);
                  
                  const seatArray = Array.isArray(seatMap)
                    ? seatMap 
                    : seatMap.split(""); 
                  
                  return seatArray.map((seat, index) => (
                    <button
                      key={index}
                      style={{
                        width: "50px",
                        height: "50px",
                        margin: "5px",
                        backgroundColor:
                          seat === "0"
                            ? "red" // Dolu koltuk
                            : selectedSeat === index
                            ? "green" // Seçilen koltuk
                            : "lightgrey", // Boş koltuk
                        cursor: seat === "0" ? "not-allowed" : "pointer",
                      }}
                      disabled={seat === "0"} // Dolu koltuklar için butonu devre dışı bırak
                      onClick={() => setSelectedSeat(index)} // Koltuk seçimi
                    >
                      {index + 1} 
                    </button>
                  ));
                })()}
                </div>
                <button
                  onClick={purchaseTicket}
                  disabled={!gender || selectedSeat === null}
                >
                  Bilet Satın Al
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bilet Yönetimi Sekmesi */}
        {activeTab === "management" && (
          <div className="pnr">
            <h2>PNR Koduyla Bilet Ara - Bilet İptal Et</h2>
            <input
              className="pnrInput"
              type="text"
              placeholder="PNR Kodu Girin"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
            />
            <button className="pnrButton" onClick={handleSearch}>Ara</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <PnrModal 
              isOpen={isOpenPnr} 
              onRequestClose={() => setIsOpenPnr(false)} 
              ticketData={ticketData}
              downloadExcel={downloadExcel}
              downloadPDF={downloadPDF}
              handleDelete={handleDelete}
            />
          </div>
        )}
        {/* Satın Alınan Bilet Detayları için Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Bilet Bilgileri"
        >
          <h3><strong>Bilet Bilgileri</strong></h3>
          {ticketData && (
            <div>
              <p>
                <strong>Kalkış Yeri: </strong> {ticketData.fromLoc}
              </p>
              <p>
                <strong>Varış Yeri: </strong> {ticketData.toLoc}
              </p>
              <p>
                <strong>Kalkış Zamanı: </strong> {ticketData.depTime}
              </p>
              <p>
                <strong>Varış Zamanı: </strong> {ticketData.arrTime}
              </p>
              <p>
                <strong>Koltuğunuz:</strong> {selectedSeat + 1}
              </p>
              <p>
                <strong>İsminiz:</strong> {ticketData.name}
              </p>
              <p>
                <strong>Soyisminiz:</strong> {ticketData.surname}
              </p>
              <p>
                <strong>E-posta:</strong> {ticketData.eMail}
              </p>
              <p>
                <strong>Cinsiyet:</strong> {ticketData.gender}
              </p>
              <p>
                <strong>Fiyat:</strong> {ticketData.price.toFixed(2)} ₺
              </p>
              <p>
                <strong>PNR:</strong> {ticketData.pnr}
              </p>
              <p>
              <div class="highlight">
                  <strong>Pnr kodunuz mail adresine gönderilmiştir. Bu kodu kaybetmeyiniz.</strong>
              </div>
              </p>
            </div>
          )}
          <button onClick={downloadExcel}>Excel İndir</button>
          <button onClick={downloadPDF}>PDF İndir</button>
          <button onClick={() => setIsModalOpen(false)}>Kapat</button>
        </Modal>
      </div>
    </div>
  );
}

export default App;
