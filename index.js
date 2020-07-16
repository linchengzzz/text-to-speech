const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const config = require('./config.json');

const pullStream = sdk.AudioOutputStream.createPullStream();

fs.createWriteStream(config.filename).on('data', arrayBuffer => {
    pullStream.read(arrayBuffer.slice()).then();
}).on('end', _ => {
    pullStream.close();
});

const speechConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.serviceRegion);
const audioConfig = sdk.AudioConfig.fromStreamOutput(pullStream);
const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
const ssml = fs.readFileSync('./ssml.xml', 'utf-8');

synthesizer.speakSsmlAsync(
    ssml,
    result => {
        if (result.errorDetails) {
            console.error(result.errorDetails);
        } else {
            console.log(JSON.stringify(result));
        }
        synthesizer.close();
    },
    err => {
        console.trace("err - " + err);
        synthesizer.close();
    },
    config.filename,
);
