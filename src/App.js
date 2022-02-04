import React from 'react';
import { Route, Routes } from 'react-router-dom'
//import Header from './components/Header';
import CovidVideos from './components/covidVideo';
import OtherVideos from './components/otherVideos';

export default function App (){
    return(
        //SET to Load different components on to the page
        <Routes>
            <Route exact path="/" element={<CovidVideos />} />
            <Route path="/:otherVideos" element={<OtherVideos/>} />
        </Routes>
    );
}
