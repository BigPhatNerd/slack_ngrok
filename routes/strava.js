const router = require("express").Router();
const { User, Strava, Session, FinishedWorkout, OAuth } = require("../models");
const passport = require("../config/authentication");
const { slack, strava, url } = require("../lib/keys");
const axios = require("axios");
const config = { "Content-Type": "application/json" };
const hook = slack.webHook;
const open = require("open");
const stravaToken = strava.accessToken;
const { refreshToken } = require("../controller/strava-controller");
const stravaAuth = require("../config/authentication");
const passUser = require("../config/middleware/passUser");
const urlString =
    process.env.NODE_ENV === "production" ? url.production : url.development;
const webAddress = "https://www.strava.com/api/v3/athlete";
const puppeteer = require("puppeteer");
const {
    stravaHook,
    testSlackBlock,
} = require("../slack-templates/strava-templates");
const post = { text: "booga booga" };
const { getMiles } = require('../utils/strava')

router.get("/find", async (req, res) => {
    const findUser = await User.findOne({ email: req.query.email });
    res.json(findUser);
});

//deauthorize strava by removing access and refresh tokens
router.put("/deauth/:stravaId", async (req, res) => {
    const stravaId = req.params.stravaId;
    const update = {
        stravaAccessToken: "",
        stravaRefreshToken: "",
        authorizeStrava: false,
    };
    let user = await User.findOneAndUpdate(stravaId, update, {
        new: false,
    });

    const { team_id, api_app_id } = user;

    res.json(user);
});

//Create route for STRAVA webhook to go to Slack

router.post("/webhook", async (req, res) => {
    try {
        console.log("req in strava webhook: ", req.body);
        const { aspect_type, object_id, owner_id, object_type } = req.body;
        if (aspect_type === "delete") {
            console.log(`${owner_id} deleted an activity`);
            return;
        }
        //Refresh User's token:
        const accessToken = await refreshToken(owner_id);
        //GET the data of the activity from Strava
        const stravaData = await axios.get(
            `https://www.strava.com/api/v3/activities/${object_id}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        console.log("About to map through the Strava data")
     
        //Destructure informationreturned from stravaData:
        const {
            type,
            athlete,
            distance,
            elapsed_time,
            start_date,
            average_temp,
            average_speed,
            max_speed,
            map,
        } = stravaData;
        //This is where I calculate the mileage.

        const stravaBody = {
            type: type,
            distance: distance,
            seconds: elapsed_time,
            stravaId: owner_id,
            miles: getMiles(distance)
        };
        console.log("stravaData: ", stravaData);
        const finishedWorkouts = await FinishedWorkout.create(stravaBody);
        const addFinishedWorkout = await User.findOneAndUpdate(
            { stravaId: owner_id },
            { $push: { finishedWorkouts: finishedWorkouts } },
            { new: true }
        );
        //Save the information to mongoose by searching for stravaId
        console.log("addFinished workout: ", addFinishedWorkout);
        console.log(
            "Take the user and search OAuth based on addFinishedWorkout.team_id...or whatever"
        );
        const body = {
            type: type,
            owner_id: athlete.id,
            distance: distance,
            elapsed_time: elapsed_time,
            start_date: start_date,
            average_temp: average_temp,
            average_speed: average_speed,
            max_speed: max_speed,
            stravaMap: map.summary_polyline,
        };
        console.log({ stravaData });
        Strava.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { stravaId: owner_id },
                    { $addToSet: { stravaWorkouts: _id } },
                    { new: true }
                );
            })
            .then((activityData) => {
                if (!stravaData) {
                    res.status(404).json({
                        message: "No user found with that id!",
                    });
                    return;
                }

                const { name, stravaAvatar } = activityData;
                //Trying to find the webhook from the users team_id but not sure If I am calling it right
                OAuth.findOne({ team_id: addFinishedWorkout.team_id }).then(
                    (response) => {
                        console.log({ response });
                        //I think that stravaHook would be where I could map through however many workouts were added.
                        axios.post(
                            response.webhook,
                            stravaHook(stravaData, name, stravaAvatar),
                            config
                        );
                    }
                );
            });

        res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Adds support for GET requests to STRAVA webhook
router.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = "STRAVA";
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            //Responds with the challenge token from the request
            console.log("WEBHOOK RECEIVED");
            res.json({ "hub.challenge": challenge });
        } else {
            res.sendStatus(403);
        }
    }
});

router.route("/loginfromslack").post(async (req, res) => {
    try {
        //First I need to get the user requesting the login from slack and store it.
        const { team_id, user_id, user_name, api_app_id } = req.body;
        req.session.userId = user_id;
        const deleteSessions = await Session.deleteMany({});
        const createSession = await Session.create({
            userId: user_id,
            team_id: team_id,
            api_app_id: api_app_id,
        });
        const createUser = await User.findOneAndUpdate(
            { user_id: user_id },
            { $set: { team_id: team_id, user_name: user_name } },
            { upsert: true, new: true }
        );
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${urlString}/strava/login`);
        await browser.close();
        return createUser;
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get(
    "/login",
    passport.authenticate("strava", {
        scope: "activity:read_all",
    })
);

router.get("/redirect", passport.authenticate("strava"), async (req, res) => {
    const session = await Session.find({});
    const { team_id, api_app_id } = session[0];
    res.redirect(`${urlString}/auth`);
    return;
});

module.exports = router;
