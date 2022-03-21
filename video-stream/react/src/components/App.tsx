import React, { useEffect, useState } from 'react';
import { Hls, Player, Video } from '@vime/react';
import backgroundImage from '../assets/background.png';
import './App.css';
import '@vime/core/themes/default.css';

const VideoPlayerContainer: React.FC<{ title: string }> = ({ title, children }) => {
    return (
        <div className="container">
            <h1 className="title">{title}</h1>
            <div className="player-container">
                <Player controls autoplay={false}>
                    {children}
                </Player>
            </div>
        </div>
    );
};

const HOST = 'http://192.168.90.40:3001';

/**
 * Video player: https://vimejs.com/components/providers/video
 */
export const App = () => {
    return (
        <>
            <VideoPlayerContainer title="Segments">
                <Hls version="latest" >
                    <source data-src={`${HOST}/segments-list`} type="application/x-mpegURL" />
                </Hls>
            </VideoPlayerContainer>

        </>
    );
};
