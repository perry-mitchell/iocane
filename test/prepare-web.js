// This file is NOT included in web tests, but creates a file that is!

const path = require("path");
const fs = require("fs");
const { createSession } = require("../dist/index.node.js");

const SAMPLE_PASS = "x83nf9.02?1 s";
const SAMPLE_TEXT = "Hello!\nThis is some sample text.\n\t-> \r\nūęö ";

const payload = {};

Promise.resolve()
    .then(() =>
        createSession()
            .use("cbc")
            .encrypt(SAMPLE_TEXT, SAMPLE_PASS)
    )
    .then(enc => {
        payload.cbc1 = {
            plain: SAMPLE_TEXT,
            encrypted: enc,
            password: SAMPLE_PASS
        };
    })
    .then(() =>
        createSession()
            .use("gcm")
            .encrypt(SAMPLE_TEXT, SAMPLE_PASS)
    )
    .then(enc => {
        payload.gcm1 = {
            plain: SAMPLE_TEXT,
            encrypted: enc,
            password: SAMPLE_PASS
        };
    })
    .then(() => {
        const output = `window.nodeSample = ${JSON.stringify(payload)};`;
        fs.writeFileSync(path.resolve(__dirname, "./web/node-sample.js"), output, "utf8");
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
