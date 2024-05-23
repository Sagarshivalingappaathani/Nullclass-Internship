import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TagsList from "./TagsList";
import { tagsList } from "./tagList";

const Tags = ({ slideIn, handleSlideIn }) => {
  return (
    <div className="flex">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="flex-grow p-5">
        <h1 className="mt-12 font-normal text-3xl">Tags</h1>
        <p className="mt-3 text-base">
          A tag is a keyword or label that categorizes your question with other,
          similar questions.
        </p>
        <p className="mt-2 text-base">
          Using the right tags makes it easier for others to find and answer
          your question.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tagsList.map((tag, index) => (
            <TagsList tag={tag} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
