const express = require("express");
const { request } = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mongoDB = require("mongodb");
const passport = require("passport");
const connectMongoDBSession = require("connect-mongodb-session");
const serverless = require("serverless-http");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sharp = require("sharp");
const path = require("path");
const WebSocket = require("ws");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const users = require("./models/users.js");
const Event = require("./models/events.js");
const { addUserRsvp } = require("./database.js");
const app = express();
const CLIENT_HOME_URL = "https://demo.evently.wiki/Dashboard";
dotenv.config();
const port = process.env.PORT || 3000;
const url = process.env.DATABASE_URL || "empty";
const secretKey = process.env.SESSION_SECRET || "empty";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.REGION_NAME,
});

//used to store file image in memory

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3RandomImgName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
//upload single image, parameter is name of image your uploading

//connect to mongodb in order to interact with db
mongoose
  .connect(url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

//create mongodb store to store sessions in the sessions collection

// const MongoDBStore = connectMongoDBSession(session);
// const store = new MongoDBStore({
//   uri: url,
//   collection: "sessions",
// });

//function that passport will use to authenticate user
//get the email field in order to get the user in the db
//check if passwords match if so serialize user
//else return false

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        if (!email) {
          done(null, false);
        }
        const user = await users.findOne({ email: email });
        if (!user) {
          done(null, false);
        } else {
          const hash = user.password;
          if (user.email == email && (await bcrypt.compare(password, hash))) {
            done(null, user);
          } else {
            done(null, false);
          }
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

// Admin-specific Passport strategy
passport.use(
  "admin",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await users.findOne({ email: email });
        if (!user || !user.isAdmin) {
          console.log("User is not admin");
          return done(null, false, { message: "Access denied" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
          console.log("Invalid credentials");
          return done(null, false, { message: "Invalid credentials" });
        }
        console.log(user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//functions to serialize and deserialize user info in session for later use

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  users
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

//function that creates a session using a secret key,
//stores the session in mongodb and set experiaton date for cookie
//secure true means cookies are only transmitted through http
//https only true means cookie cant be accessed in client side
//same site strict to prevent csrf attacks

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      mongoUrl: url,
      stringify: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://6cf7-67-173-180-92.ngrok-free.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: secretKey,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//generate a keypair synchronously  using crypto generatekeypari sync using rsa algo
//create a 2048 bit size key
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,

  //format the output of the public and private key
  //cipher to encrypt private key and passphrase for decryption of the private key
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
  },
});

const verifyQrData = (qrData) => {
  const { signature, ...dataWithoutSignature } = qrData;

  // Load public key
  const loadPublicKey = crypto.createPublicKey({
    key: publicKey,
    format: "pem",
  });

  // Verify the signature
  const verify = crypto.createVerify("sha256");
  verify.update(JSON.stringify(dataWithoutSignature));
  verify.end();
  return verify.verify(loadPublicKey, signature, "base64");
};

function makeid() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  for (let i = 0; i < 16; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  counter += 1;

  return result;
}

//route that checks if user is authenticated if so
//create url and store in users document so user can fetch and see profile picture

app.get("/api/dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    const reqUser = req.user;
    const userId = reqUser.id;
    const user = await users.findById(userId);
    if (user.imageName) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: user.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      user.profileImgUrl = url;
      await user.save();
    }
    // Fetch all events from the database
    const events = await Event.find();
    const rsvpEvents = user.rsvps;
    // console.log(events);

    res.status(200).json({
      data: user?.profileImgUrl,
      username: user.username,
      events: events,
      rsvpEvents: rsvpEvents,
    });
  } else {
    // res.redirect("/UserLogin");
    res.status(404).json({ error: "Authentication Error" });
  }
});
//when user sends credientals use passport strategy
//if true sends success message
//else send error message

app.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  // const event = await Event.findById(id);
  console.log(id);
  // console.log(event);
  // res.status(200).json(event);
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

app.get("/login-failure", (req, res) => {
  res.status(404).json({ error: "Incorrect Login Credentials" });
});

app.get("/login-success", (req, res) => {
  res.redirect("/");
});
app.post("/google-login", async (req, res) => {
  const { name, email, profileImgUrl } = req.body;
  const user = await users.findOne({ email: email });
  if (user) {
    req.login(user, function (err) {
      if (err) {
        return res.redirect("/login-failure");
      }
      return res.redirect("/login-success");
    });
  } else {
    const newUser = new users({
      username: name,
      email: email,
      password: "",
      imageName: "",
      profileImgUrl: profileImgUrl,
    });
    await newUser.save();
    req.login(newUser, function (err) {
      if (err) {
        return res.redirect("/login-failure");
      }
      return res.redirect("/login-success");
    });
  }
});

app.post("/uploadImg", upload.single("profileImg"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const userId = req.body.userId;
  //resize image to be profile picture size

  const resizedImage = await sharp(req.file.buffer)
    .resize(200, 200, {
      fit: "cover",
      position: "center",
    })
    .toBuffer();

  //params object properties are which bucket to upload,
  //send file buffer data as the body
  //finally send and store image in s3

  const imageName = s3RandomImgName();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageName,
    Body: resizedImage,
    ContentType: req.file?.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
  const user = await users.findById(userId);
  user.imageName = imageName;
  await user.save();
  res.status(200).json({ success: "Success image is stored!" });
});

//post request to add user to the db

app.post("/registerUser", async (req, res) => {
  //get the username, email,password, and confirm password
  //check if they match and if they do add user to db
  const { username, email, password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    res.status(404).json({ error: "passwords dont match" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new users({
      username: username,
      email: email,
      password: hash,
      imageName: "",
      profileImgUrl: "",
    });
    newUser
      .save()
      .then(() => {
        res
          .status(200)
          .json({ success: "Success! User is in db", id: newUser.id });
      })
      .catch((err) => {
        if (err.code == 11000) {
          res.status(404).json({ error: "Username or email already exists" });
        } else {
          res.status(404).json({ error: "Server error" });
        }
      });
  }
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      // Handle error here
      console.log("there is an error");
      res.status(404).json({ error: "Server error" }); // Redirect to error handling page
    } else {
      res.status(200).json({ success: "Success you logged out!" }); // Redirect to home page or login
    }
  });
});

// Admin login route
app.post(
  "/admin-login",
  passport.authenticate("admin", {
    failureRedirect: "/admin-login-failure",
    successRedirect: "/admin-login-success",
  })
);

// Admin login failure route
app.get("/admin-login-failure", (req, res) => {
  res.status(403).json({ error: "Access denied. Admin credentials required." });
});

// Admin login success route
app.get("/admin-login-success", (req, res) => {
  res.redirect("/AdminDashboard");
});

// Admin dashboard route
app.get("/admin-dashboard", async (req, res) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    const events = await Event.find();
    res.status(200).json({ events: events });
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Admin credentials required." });
  }
});

app.get("admin-fetch-events", async (req, res) => {
  scrapeUICEvents();
  res.status(200).json({ success: "Fetch Success!" });
});
app.get("/login-success", (req, res) => {
  res.redirect("/");
});

app.get("/login-success", (req, res) => {
  res.redirect("/");
});

app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/UserLogin");
  } else {
    res.redirect("/Dashboard");
  }
});

app.post("/events/rsvp", async (req, res) => {
  const { eventId, username } = req.body; // Get the event ID and username from the request body
  try {
    // const user = await users.findOne({ username: username });
    const rsvpuser = await users.findOne({ username: username });
    const rsvpevent = await Event.findOne({ _id: eventId });
    // console.log(rsvpuser);
    // console.log(rsvpevent);
    if (rsvpuser.rsvps === undefined) {
      rsvpuser.rsvps = [];
    }

    if (rsvpuser.rsvpsId.includes(eventId)) {
      console.log("Already RSVP'd");

      return res.status(200).json({ error: "Already RSVP'd" });
    } else {
      rsvpuser.rsvpsId.push(eventId);
      rsvpuser.rsvps.push(rsvpevent);
      await rsvpuser.save();
      console.log(rsvpuser);
      return res.status(200).json({ success: "Success! RSVP added" });
    }

    // const test = await Event.findOne({ _id: eventId });
    // console.log(test);
  } catch (err) {
    console.error("Error adding RSVP:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/checkQR", (req, res) => {
  const { msg } = req.body;

  let qrData;
  try {
    qrData = JSON.parse(msg);
  } catch (parseError) {
    console.error("Failed to parse 'msg':", parseError.message);
    res.status(400).json({ error: "Invalid QR Code format" });
    return;
  }

  // Verify the QR code's signature to prevent tampering with data
  const isSignatureValid = verifyQrData(qrData);
  if (!isSignatureValid) {
    console.error("Invalid QR Code signature");
    res.status(403).json({ error: "QR Code signature verification failed" });
    return;
  }

  //  Check the timestamp and use Nan to check if its in valid format
  const serverTimestamp = new Date();
  const qrTime = new Date(qrData.time);

  if (isNaN(qrTime.getTime())) {
    console.error("Invalid 'time' in QR Code");
    res.status(400).json({ error: "Invalid QR Code time format" });
    return;
  }

  //var used to check the time it was sent to server and time it was created

  const timeDifference = serverTimestamp - qrTime;

  // if time the data was sent is greater than the inteval then send invalid qr error

  if (timeDifference > 300) {
    res.status(403).json({ error: "QR Code has expired" });
  } else {
    res.status(200).json({ success: "You are checked in" });
  }
});

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "../build")));

// Handle any other routes and direct them to the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
const server = app.listen(port, () => {
  console.log(`App is running at ${port} `);
});

// WebSocket server
const wss = new WebSocket.Server({ server });
wss.on("connection", function connection(ws) {
  console.log("client has connected");

  //for every 2 seconds generate a qr code and then send it over to the client
  setInterval(async () => {
    let date = new Date();
    date.toISOString().split("T")[0];
    let qrData = {
      time: date,
      id: makeid(),
    };

    //use privateKey and use passphrase in order to decrypt and use private key
    let loadPrivateKey = crypto.createPrivateKey({
      key: privateKey,
      type: "pkcs8",
      format: "pem",
      passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
    });
    let sign = crypto.createSign("sha256");
    sign.update(JSON.stringify(qrData)); //hash the data (cannot be type object so convert to string)
    sign.end();
    let signature = sign.sign(loadPrivateKey, "base64"); //generate the signature
    qrData.signature = signature;

    //decode key back to a buffer and encrypt the data and send it to client
    const key = Buffer.from(process.env.AES_PRIVATE_KEY, "base64");

    ws.send(JSON.stringify({ data: qrData }));
  }, 100);
  ws.on("message", (msg) => {
    const qrData = JSON.parse(msg);
    console.log(`data recieved is: ${qrData}`);
    if (verifyQrData(qrData)) {
      console.log("Signature is valid. QR Data:", qrData);
    } else {
      console.error("Invalid signature. Possible tampering detected.");
    }
  });
});
