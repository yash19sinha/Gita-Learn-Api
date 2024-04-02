// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const PORT = process.env.PORT || 4000;
const data = require("./bhagavad_gita.json"); // Load the JSON data
const versesData = require("./verses.json");
const booksData = require("./books.json"); // Load the JSON data for books
const path = require("path");
const filePath = path.join(__dirname, "verseDetails.json");
const audioPath = path.join(__dirname, "audio.json");
const questionsPath = path.join(__dirname, "questions.json");

const verseNumberFilePath = path.join(__dirname, "verseNumber.json");

const introFilePath = path.join(__dirname, "intro.json");

const linkPath = path.join(__dirname, "links.json");
const linkPath1 = path.join(__dirname, "timestamp.json");
const linkPath2 = path.join(__dirname, "podbeans.json");
// const verses = require('./verses.json');

const rawData = fs.readFileSync("bhagavad_gita.json", "utf-8");
const chaptersData = JSON.parse(rawData);

const questionsRawData = fs.readFileSync(questionsPath, "utf-8");
const questionsData = JSON.parse(questionsRawData);

app.use(express.json());

// Use cors middleware to allow requests from the origin where your Next.js app is hosted
app.use(cors());

app.get("/api/sections", (req, res) => {
  fs.readFile(introFilePath, (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const sections = JSON.parse(data);
    res.json(sections);
  });
});


app.get("/api/section/:sectionName", (req, res) => {
  const { sectionName } = req.params;

  fs.readFile(introFilePath, (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const sections = JSON.parse(data);

    if (sections[sectionName]) {
      res.json({ paragraphs: sections[sectionName] });
    } else {
      res.status(404).json({ error: "Section not found" });
    }
  });
});


app.get("/api/verseNumbers", (req, res) => {
  // Read the contents of the verseNumber JSON file
  fs.readFile(verseNumberFilePath, (err, data) => {
    if (err) {
      console.error("Error reading verseNumber JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    // Parse the JSON data and send it as a response
    const verseNumbers = JSON.parse(data);
    res.json(verseNumbers);
  });
});
// Define an API endpoint to retrieve chapter names and descriptions
app.get("/api/chapters", (req, res) => {
  const chapters = data.chapters.map((chapter) => ({
    chapter_number: chapter.chapter_number,
    name: chapter.name,
    description: chapter.description,
  }));
  res.json({ chapters });
});

app.get("/api/verses/:chapterNumber", (req, res) => {
  const { chapterNumber } = req.params;

  // Check if verses data for the specified chapter exists
  if (versesData[chapterNumber]) {
    const verses = versesData[chapterNumber].map((verse) => ({
      verse_number: verse.verse_number,
      text: verse.text,
    }));
    res.json({ verses });
  } else {
    res.status(404).json({ error: "Chapter not found" });
  }
});

// Define an API endpoint to retrieve verse details by chapter-verse identifier
app.get("/api/verse/:chapterVerse", (req, res) => {
  const { chapterVerse } = req.params;

  // Read the JSON file and parse its contents
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading verse details JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const verseDetails = JSON.parse(data);

    // Check if verse details for the specified chapter-verse identifier exist
    if (verseDetails[chapterVerse]) {
      res.json({ verseDetails: verseDetails[chapterVerse] });
    } else {
      res.status(404).json({ error: "Verse not found" });
    }
  });
});

// Add this code to your app.js
app.get("/api/audio/:chapterVerse", (req, res) => {
  const { chapterVerse } = req.params;

  // Read the audio JSON file and parse its contents
  fs.readFile(audioPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading audio JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const audioData = JSON.parse(data);

    // Check if audio data for the specified chapter-verse identifier exists
    if (audioData[chapterVerse]) {
      res.json({ audio: audioData[chapterVerse] });
    } else {
      res.status(404).json({ error: "Audio not found" });
    }
  });
});

// Add this code to your app.js
app.get("/api/links/:chapterVerse", (req, res) => {
  const { chapterVerse } = req.params;

  // Read the audio JSON file and parse its contents
  fs.readFile(linkPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading links JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const linkData = JSON.parse(data);

    // Check if audio data for the specified chapter-verse identifier exists
    if (linkData[chapterVerse]) {
      res.json({ links: linkData[chapterVerse] });
    } else {
      res.status(404).json({ error: "link not found" });
    }
  });
});

app.get("/api/podbeans/:chapterVerse", (req, res) => {
  const { chapterVerse } = req.params;

  // Read the audio JSON file and parse its contents
  fs.readFile(linkPath2, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading links JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const podbeanData = JSON.parse(data);

    // Check if audio data for the specified chapter-verse identifier exists
    if (podbeanData[chapterVerse]) {
      res.json({ podbeans: podbeanData[chapterVerse] });
    } else {
      res.status(404).json({ error: "link not found" });
    }
  });
});

app.get("/api/timestamp/:chapterVerse", (req, res) => {
  const { chapterVerse } = req.params;

  // Read the JSON file and parse its contents
  fs.readFile(linkPath1, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const jsonData = JSON.parse(data);

    // Check if the specified chapter-verse identifier exists in the JSON data
    if (jsonData[chapterVerse]) {
      const {
        "start-time": startTime,
        "end-time": endTime,
        "video-id": videoId,
      } = jsonData[chapterVerse];
      res.json({
        "start-time": startTime,
        "end-time": endTime,
        "video-id": videoId,
      });
    } else {
      res.status(404).json({ error: "Chapter-verse not found" });
    }
  });
});

// app.get('/api/verses', (req, res) => {
//   res.json({ verses });
// });

// Define and initialize currentVerseIndex here
let currentVerseIndex = 0;

app.get("/api/verse-of-the-day", (req, res) => {
  if (currentVerseIndex >= Object.keys(versesData).length) {
    // Reset the verse index if we've reached the end of the data
    currentVerseIndex = 0;
  }

  const verseKey = Object.keys(versesData)[currentVerseIndex];
  const verse = versesData[verseKey];
  currentVerseIndex++;

  if (verse) {
    res.json({ verse }); // Include the entire 'verse' object in the response
  } else {
    res.status(404).json({ error: "Verse not found" });
  }
});

app.get("/api/chapters/:bookId", (req, res) => {
  const { bookId } = req.params;

  // Filter chapters based on the selected book's ID
  const bookChapters = chaptersData.chapters.filter(
    (chapter) => chapter.bookId === Number(bookId)
  );

  if (bookChapters.length === 0) {
    res
      .status(404)
      .json({ error: "Chapters not found for the specified book" });
  } else {
    res.json({ chapters: bookChapters });
  }
});

app.get("/api/books", (req, res) => {
  res.json({ books: booksData });
});

app.get("/api/questions/:verseId", (req, res) => {
  const verseId = req.params.verseId;

  // Check if the requested verseId exists in the questions data
  if (questionsData.hasOwnProperty(verseId)) {
    res.json({ questions: questionsData[verseId] });
  } else {
    res.status(404).json({ error: "Verse not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
