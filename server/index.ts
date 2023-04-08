import express, { json, urlencoded } from "express";
import { MongoClient, ObjectId, WithId } from "mongodb";
import * as dotenv from "dotenv";
import { bookTickets } from "./src/bookingManager";
import cors from "cors";
const app = express();
const port = 3000;

const coach: Seat[][] = [];
for (let i = 0; i < 80; i++) {
  if (i % 7 === 0) {
    coach.push([]);
  }
  coach.at(-1)?.push({ number: i + 1, status: "vacant" });
}

dotenv.config();

const uri = process.env.DATABASE_URI || "";
const client = new MongoClient(uri);

try {
  client.connect();
  console.log("connected to db");
} catch (err) {
  console.error("unable to connect to db");
}

const db = client.db("unstop");

const coaches = db.collection("coaches");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/coach", async (req, res) => {
  // const doc = await coaches.findOne<WithId<{ coach: Seat[][] }>>();

  res.json({ status: "success", id: "33", coach: coach }).status(200);
});

app.post("/book", async (req, res) => {
  if (!req.body || !req.body.seats || !req.body.id) {
    res.json({ message: "bad request" }).status(400);
    return;
  }

  const { seats, id } = req.body;
  const { seatMap, bookedSeats } = bookTickets(seats, coach);
  // const filter = { _id: new ObjectId(id) };
  // const updateDoc = {
  //   $set: {
  //     coach: seatMap,
  //   },
  // };
  // await coaches.updateOne(filter, updateDoc);
  res.json({ status: "success", seatNumbers: bookedSeats, seatMap: seatMap });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
