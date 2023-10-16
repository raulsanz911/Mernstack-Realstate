import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProgramClips from "../pages/ProgramClips";
import Programs from "../pages/Programs";
import FavoriteClips from "../Pages/FavoriteClips";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Programs />} />
          <Route path="/program/:programId" element={<ProgramClips />} />
          <Route path="/clips/favorite" element={<FavoriteClips />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;