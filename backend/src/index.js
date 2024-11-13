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
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const users = require("./models/users.js");

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
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://demo.evently.wiki/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      users.findOne({ googleId: profile.id }, async (err, existingUser) => {
        try {
          if (err) {
            return done(err);
          }
          if (existingUser) {
            return done(null, existingUser);
          } else {
            const newUser = new users({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              profileImgUrl: profile.photos[0].value,
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (e) {
          done(e);
        }
      });
    }
  )
);

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
  origin: "http://localhost:5173",
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
    // console.log(events);

		res
			.status(200)
			.json({ data: user?.profileImgUrl, username: user.username, events: events });
	} else {
    // res.redirect("/UserLogin");
    res.status(404).json({ error: "Authentication Error" });
  }
});
//when user sends credientals use passport strategy
//if true sends success message
//else send error message
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    successRedirect: CLIENT_HOME_URL,
  })
);
app.get("/auth/google/failure", (req, res) => {
  res.status(404).send("<h1>404 - Authentication Failed</h1>");
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
app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/UserLogin");
  } else {
    res.redirect("/Dashboard");
  }
});

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "../build")));

// Handle any other routes and direct them to the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
app.listen(port, () => {
  console.log(`App is running at ${port} `);
});

//line in order to make server serverless and be used on AWS lambda
//fyi it looks like it works on aws just have to add you to the org
//also have to give you credentials
//pretty sure you have to comment this out and uncomment out the app.listen code to test locally

// module.exports.handler = serverless(app);
