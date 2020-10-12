const express = require("express");
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3001;


//creating unique ids
let amountOfNotes = 0;
const formatId = "a";

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));


//routes 
//render script
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//display script
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        return res.json(JSON.parse(data))
    });
})

//post new
app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;

        let objectList = JSON.parse(data);
        let newNote = req.body

        newNote.id = (formatId + amountOfNotes);
        amountOfNotes += 1;

        objectList.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(arrayOfObjects), "utf8", (err) => {
            if (err) throw err;
            console.log('New db file')
            return res.json(objectList)
        })
    });
});

//delete selected
app.delete("/api/notes/:id", (req, res) => {
    const chosen = req.params.id;
    console.log(chosen);

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;

        let objectList = JSON.parse(data);
        let spliceLocation;


        for (let i = 0; i < objectList.length; i++) {
            if (chosen === objectList[i].id) {
                deleteIt = i;
                console.log(deleteIt)
            }
        };

        objectList.splice(deleteIt, 1);

        fs.writeFile("./db/db.json", JSON.stringify(arrayOfObjects), "utf8", (err) => {
            if (err) throw err;
            return res.json(objectList)
        })
    });
});


