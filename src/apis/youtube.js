// Axios connection to retrieve info on different videos.
import axios from 'axios';

//pleace your YouTube API key here:
const API_KEY = "YOUR API-KEY";
const CHANNEL_ID= 'UCL03ygcTgIbe36o2Z7sReuQ';
export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params:{
        channelId: CHANNEL_ID,
        part: 'snippet',
        maxResults: 50,
        key: API_KEY
    }
});