import React, { useState, useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const ClipCard = ({ id, title, desc, audioUrl, duration, published, programId, favorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [favoriteClip, setFavorite] = useState(false); // Add favorite state


  useEffect(() => {
    let isMounted = true;


    if (isMounted)
      setFavorite(favorite);


    return () => {
      isMounted = false;
    };
  }, [id])


  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  library.add(farHeart);


  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


  const markClipAsFavorite = async (clipId) => {
    try {
      const response = await axios.post(`https://localhost:7018/Programs/${programId}/clips/${clipId}/favorite`);
      return response.data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  const handleMarkAsFavorite = async (clipId) => {
    const success = await markClipAsFavorite(clipId);
    if (success) {
      setFavorite(true);
    } else {
      // Handle error
      console.log("error")
    }
  }

  return (
    <>
      <div className="cardPadd Card">
        <div className='clipCardHeader'>
          <h2 className="title">{title}</h2>
          <h1>Test</h1>
          <button className='favBtn' onClick={() => handleMarkAsFavorite(id)}>
            <FontAwesomeIcon icon={['far', 'heart']} color={favoriteClip ? 'red' : 'black'} />
          </button>
        </div>

        <div className='content'>
        <p className='clipDate'>
          <span>{new Date(published).toLocaleDateString("en-US", options)}</span>
          <span>{`${Math.round((duration / 60))} Minutes`}</span>
        </p>

        {isExpanded ? (
          <div className='desc' >{desc}</div>
        ) : (
          <div className='desc'>{`${desc?.slice(0, 100)}...`}</div>
        )}
        {desc?.length > 100 && (
          <button onClick={toggleExpanded}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}

        <audio
          src={audioUrl}
          controls
          autoPlay={isPlaying}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
      </div>
    </>
  )
}

export default ClipCard