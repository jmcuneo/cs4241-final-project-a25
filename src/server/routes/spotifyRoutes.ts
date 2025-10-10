import querystring from "node:querystring";
import axios from "axios";
import {Router} from "express";
import crypto from "node:crypto";
import dotenv from "dotenv";

const router = Router();

dotenv.config();

const client_id = "cb8bfc95d6e344a89d9f9033d8e440c0"
const redirect_uri = "http://127.0.0.1:5173/api/callback"
const client_secret = process.env.CLIENT_SECRET;

if (!client_secret) {
    throw new Error("Missing CLIENT_SECRET environment variable");
}

// Function to generate a random string for state parameter
const generateRandomString = (length: number) => {
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    const hexString = randomBytes.toString('hex');
    return hexString.slice(0, length);
}


// Route to initiate Spotify login
router.get('/login', (_req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-read-recently-played';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
})

// Route to handle Spotify callback (return)
router.get('/callback', function (req, res) {

    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const form = {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
    };
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };


        axios.post(authOptions.url, querystring.stringify(form), {headers: authOptions.headers})
            .then(response => {
                if (response.status === 200) {

                    const access_token = response.data.access_token,
                        refresh_token = response.data.refresh_token;

                    const options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        json: true
                    };

                    // use access token to access the Spotify Web API
                    axios.get(options.url, {headers: options.headers}).then(response => {
                        console.log(response.data);
                    });

                    // pass token and redirect to /heat to make requests
                    res.redirect('http://127.0.0.1:5173/heat#' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));
                } else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            })
            .catch(error => {
                res.send(error);
            });
    }
});

// Route to refresh Spotify access token
router.post('/refresh_token', function (req, res) {
    // requesting access token from refresh token
    const refresh_token = req.body.refresh_token;
    const form = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    };

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))},
        form: form,
        json: true
    };

    axios.post(authOptions.url, querystring.stringify(form), {headers: authOptions.headers})
        .then(response => {
            if (response.status === 200) {
                const access_token = response.data.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        })
        .catch(error => {
            res.send(error);
        });
});

export default router;
