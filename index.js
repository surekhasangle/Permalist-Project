import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import { database } from "pg/lib/defaults";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "system",
  port: 5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  try{
    const result = await db.query("SELECT * from items ORDER BY id ASC");
    // console.log(result);
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }
  catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  // console.log(item);
  try{
    // items.push({ title: item });
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  // console.log(req.body);
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;

  try{
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [title, id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  // console.log(req.body);
  const id = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
