import path from 'path';
import express from 'express';

const router = express.Router();
//const { exec } = require("child_process");
const { execSync } = require("child_process");
//const { spawn } = require("child_process");

/**
 * Will return a poster image.
 */
router.get('/segments-poster', (request, response) => {
    const resolvedPath = path.resolve('assets/unreal-poster.jpg');
    response.sendFile(resolvedPath);
});

/**
 * This route will return an .m3u8 file with all video file segments info
 * If you don't have any files in /segments folder -> run "generate.mjs" file:
 * it will create a m3u8 list with segmented videos.
 */
router.get('/segments-list', (request, response) => {

    console.log('get output.m3u8');

    execSync("ndncat get /ndn/coba/output.m3u8 --ver none > assets/segments/output.m3u8", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    //response.send(stdout);
    //console.log(stdout);
    //console.log(`output.m3u8 get!`);
    });    

    //const child = spawn('ndncat get-segmented /ndn/coba/output.m3u8 > output.m3u8');
  
    const resolvedPath = path.resolve('assets/segments/output.m3u8');
    response.sendFile(resolvedPath);

});

/**
 * Will return specific video segment, like "file149.ts" from the /segments folder
 */
router.get('/segments/:segment', (request, response) => {
    const { segment } = request.params;

    let info:string = "get "+segment.toString();

    console.log(info);
       
    let req:string = "ndncat get-segmented --ver none /ndn/coba/"+segment.toString()+" > assets/segments/"+segment.toString();
    
    execSync(req, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    //response.send(stdout);
    console.log(`fetched`);
    //console.log(`stdout: ${stdout}`);
    });


    //const child = spawn(req);


    const resolvedPath = path.resolve(`assets/segments/${segment}`);
    response.sendFile(resolvedPath);

});

export default router;
