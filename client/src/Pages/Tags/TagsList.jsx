import React from "react";

const TagsList = ({ tag }) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h5 className="inline-block mt-2 mb-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
        {tag.tagName}
      </h5>
      <p className="text-sm text-gray-800 leading-5">{tag.tagDesc}</p>
    </div>
  );
};

export default TagsList;
