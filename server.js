require('dotenv').config({path:'./.env'});
const axios = require('axios'); 
const express = require('express');
const compression= require('compression')
const port = process.env.PORT,
app = express()

const API_URL = `https://www.googleapis.com/youtube/v3/search`;
const API_KEY = process.env.API_KEY;//"AIzaSyDexPeBv0lqnTP9YMl_38y9HXMHDoaIvcg";
const CHANNEL_ID = process.env.CHANNEL_ID; //"UCL03ygcTgIbe36o2Z7sReuQ";


//To improve app performance
app.use(compression())
async function getVideos(queryString, nextToken){
    let returnArg = {};
    if(arguments.length <2){
       
        await axios.get(API_URL,{params:{
            channelId: CHANNEL_ID,
            part: "snippet",
            maxResults: 48,
            key: API_KEY,
            q: queryString
        }}).then((response) =>{
            returnArg = response.data;
        }).catch((error) => {
            console.error(error);
            returnArg = {
                "code": error['response']['status'],
                "message": error['response']['statusText'],
            };
        });
    }
    else{
        await axios.get(API_URL,{params:{
            channelId: CHANNEL_ID,
            part: "snippet",
            maxResults: 48,
            key: API_KEY,
            q: queryString,
            pageToken: nextToken
        }}).then((response) => {
            returnArg = response.data;
        }).catch((error) => {
            console.error(error);
            
            returnArg = {
                "code": error['response']['status'],
                "message": error['response']['statusText'],
            };
        });
    }
    return returnArg;
}

//Get all Covid related videos 
app.get('/api/getCovidVideos', async(req, res) =>{
    //res.setHeader('Content-Type', 'application/json');
    let items = [];
    const query = "COVID-19 Vaccine Podcast";
    let response = await getVideos(query);
    if("code" in response){
       res.status(response["code"]).send(response["message"]);
       res.end();
    }
    else{
        items = response.items;
        while('nextPageToken' in response){
            response = await getVideos(query, response['nextPageToken']);
            if("code" in response){
                
                break;
            }
            else{
                items.push(...response['items']);
            }
            
        }
        if("code" in response){
            res.status(response["code"]).send(response["message"]);
            res.end()
        }else{
            res.json(items);
            res.end();
        }
        
        
    }
    
});
app.get('/api/getOtherVideos', async(req, res) =>{
    let items = [];
    const query = "-COVID -19 -Vaccine -Podcast";
    let response = await getVideos(query);
     if("code" in response){
       res.status(response["code"]).send(response['message'])
       res.end();
    }
    else{
        items = response.items;
        while('nextPageToken' in response){
            response = await getVideos(query, response['nextPageToken']);
             if("code" in response){
                break;
            }
            else{
                items.push(...response['items']);
            }
        }
        if("code" in response){
             res.status(response["code"]).send(response["message"]);
             res.end()
        }
        else{
            res.json(items);
            res.end();
        }
        
    }
});
app.listen(port, () => console.log(`Server started on ${port}`));
