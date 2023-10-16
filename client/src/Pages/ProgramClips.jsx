import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from "../hooks/useFetch";
import LoadingSpinner from '../components/LoadingSpinner';
import ClipCard from '../components/ClipCard';

const ProgramClips = () => {
  const { programId } = useParams();

  const { data: clips, loading, error } = useFetch(`https://localhost:7018/Programs/${programId}/clips`);
  const renderClips = clips?.Clips?.map((clip) => {
    // let { Id: id, Title: title, Description: description, AudioUrl: audioUrl, ImageUrl: imgUrl, DurationSeconds: duration, PublishedUtc: published, favorite } = clip; 
    return (
      <ClipCard
        key={clip?.Id}
        id={clip?.Id}
        title={clip?.Title}
        desc={clip?.Description}
        audioUrl={clip?.AudioUrl}
        duration={clip?.DurationSeconds}
        published={clip?.PublishedUtc}
        programId = {clip?.ProgramId}
        favorite = {clip?.Favorite}
      />
    );
  });
  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <div>Error loading Clips</div>}
      {
        <>
          <div className="clipImgWrapper">
            {/* { <img src={clips.Clips[0].ImageUrl} alt='image' /> }  */}
          </div>
          <div className='clipsContianer container'>
            {renderClips}
          </div>
        </>
      }

    </>
  )
}
export default ProgramClips