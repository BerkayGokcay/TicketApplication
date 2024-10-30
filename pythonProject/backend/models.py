from sqlalchemy import Column, Integer, String, Date, Time, Numeric
from database import Base

class BusTrip(Base):
    __tablename__ = 'bus_trips'

    id = Column(Integer, primary_key=True, index=True)
    trip_date = Column(Date, nullable=False)
    departure_time = Column(Time, nullable=False)
    arrival_time = Column(Time, nullable=False)
    from_location = Column(String(255), nullable=False)
    to_location = Column(String(255), nullable=False)
    available_seats = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    seat_map = Column(String, nullable=False)

    def __repr__(self):
        return f"<BusTrip(id={self.id}, trip_date={self.trip_date}, from={self.from_location}, to={self.to_location})>"

class Ticket(Base):
    __tablename__ = 'tickets'

    id = Column(Integer, primary_key=True, index=True)
    eMail = Column(String(255),nullable=False)
    trip_id = Column(Integer, nullable=False)
    seat_count = Column(Integer, nullable=False)
    tripDate = Column(Date, nullable=False)
    depTime = Column(Time, nullable=False)
    arrTime = Column(Time, nullable=False)
    fromLoc =  Column(String(255), nullable=False)
    toLoc = Column(String(255), nullable=False)
    gender = Column(String(255),nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    pnr = Column(String, unique=True, index=True)
    name = Column(String(255),nullable=False)
    surname = Column(String(255),nullable=False)
    status = Column(String(255),nullable=False)
    def __repr__(self):
        return (f"<Ticket(id={self.id},eMail={self.eMail}, trip_id={self.trip_id}, seat_count={self.seat_count}, "
                f"tripDate={self.tripDate}, depTime={self.depTime}, arrTime={self.arrTime}, "
                f"fromLoc={self.fromLoc}, toLoc={self.toLoc}, price={self.price})>, pnr ={self.pnr}, name ={self.name},surname={self.surname}")
