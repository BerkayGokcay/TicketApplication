from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from pydantic import BaseModel
from models import BusTrip, Ticket, Base
from datetime import date, time
from fastapi import HTTPException

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class CreateTicket(BaseModel):
    eMail : str
    trip_id: int
    seat_count: int
    tripDate: date
    depTime: time
    arrTime: time
    fromLoc: str
    toLoc: str
    gender: str
    price: float
    name: str
    surname : str
    pnr: str
    status :  str

    class Config:
        arbitrary_types_allowed = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/BuyTicket")
def create_new_ticket(new_ticket: CreateTicket, db: Session = Depends(get_db)):
    print(new_ticket)
    try:
        # Seferi veritabanından bul
        trip = db.query(BusTrip).filter(BusTrip.id == new_ticket.trip_id).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Koltuk indeksini güncelle
        seat_map_list = list(trip.seat_map)
        selected_seat_index = new_ticket.seat_count

        if seat_map_list[selected_seat_index] == '1':
            seat_map_list[selected_seat_index] = '0'  # Koltuğu dolu olarak ayarla
            trip.seat_map = ''.join(seat_map_list)  #  koltuk haritasını birleştir

            # Yeni bilet oluştur
            db_ticket = Ticket(
                eMail=new_ticket.eMail,
                trip_id=new_ticket.trip_id,
                seat_count=new_ticket.seat_count,
                tripDate=new_ticket.tripDate,
                depTime=new_ticket.depTime,
                arrTime=new_ticket.arrTime,
                fromLoc=new_ticket.fromLoc,
                toLoc=new_ticket.toLoc,
                gender=new_ticket.gender,
                price=new_ticket.price,
                pnr = new_ticket.pnr,
                name = new_ticket.name,
                surname = new_ticket.surname,
                status = "active"
            )
            trip.available_seats -= 1
            db.add(db_ticket)
            db.commit()
            subject = "Bilet Satın Alma Onayı"
            text = f"Biletiniz başarıyla satın alındı. PNR Kodu: "+ new_ticket.pnr
            send_email(subject,text,new_ticket.eMail)
            db.refresh(db_ticket)

            return {"message": "Ticket created successfully", "selectedSeat": selected_seat_index}
        else:
            raise HTTPException(status_code=400, detail="Selected seat is already taken")
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/seats")
def show_trips(db: Session = Depends(get_db)):
    trips = db.query(BusTrip).all()
    for trip in trips:
        trip.seat_map = list(trip.seat_map)  # Koltuk haritasını karakterlere böl
    return trips


@app.get("/trips")
def show_trips(db: Session = Depends(get_db)):
    trips = db.query(BusTrip).all()
    return trips
@app.post("/CancelTicket")
def cancel_ticket(pnr: str, db: Session = Depends(get_db)):
    cancelTicket = db.query(Ticket).filter(Ticket.pnr == pnr).first()

    if cancelTicket is None:
        raise HTTPException(status_code=404, detail="Bilet bulunamadı")

    if cancelTicket.status == "cancelled":
        return {"message": f"{cancelTicket.pnr} PNR kodlu bilet zaten iptal edilmiş"}

    cancelTicket.status = "cancelled"
    db.commit()
    return {"message": f"{cancelTicket.pnr} PNR kodlu bilet başarıyla iptal edildi"}

@app.get("/ticketPnr")
def get_ticket_by_pnr(pnr: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.pnr == pnr).first()

    if ticket:
        return ticket
    else:
        raise HTTPException(status_code=404, detail="Ticket not found")

@app.delete("/deleteTicket")
def delete_ticket(pnr: str, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(Ticket.pnr == pnr).first()

    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Bileti sil
    db.delete(ticket)
    db.commit()

    return {"message": f"Ticket with PNR {pnr} has been successfully deleted"}

def send_email(subject: str, body: str, to_email: str):
    from_email = "tripappv1@gmail.com"
    from_password = "wjxp nfig qavi rree"
    print(subject+"\n")
    print(body+"\n")
    print(to_email+"\n")
    try:

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))


        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # TLS'yi başlat
            server.login(from_email, from_password)
            server.send_message(msg)
            print("E-posta gönderildi!")

    except Exception as e:
        print(f"E-posta gönderirken hata oluştu: {e}")
        raise HTTPException(status_code=500, detail="E-posta gönderilemedi.")



