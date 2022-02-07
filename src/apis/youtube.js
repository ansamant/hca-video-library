// Axios connection to retrieve info on different videos.
import axios from "axios";

//pleace your YouTube API key here:
//const API_KEY = "AIzaSyDFQGY6MiP9IkYqG6k374fTbXxC09aS7YY";
const API_KEY = "AIzaSyCBwUJOHAQxfdvTnGkbspz3RCi6tus-yYo";
const CHANNEL_ID = "UCL03ygcTgIbe36o2Z7sReuQ";
export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    channelId: CHANNEL_ID,
    part: "snippet",
    maxResults: 48,
    key: API_KEY,
  },
});
