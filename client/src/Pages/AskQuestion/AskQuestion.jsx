import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { askQuestion } from "../../actions/question";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const User = useSelector((state) => state.currentUserReducer);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      if (questionTitle && questionBody && questionTags) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody,
              questionTags,
              userPosted: User.result.name,
            },
            navigate
          )
        );
      } else alert("Please enter all the fields");
    } else alert("Login to ask question");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-10 px-5">
        <h1 className="text-3xl font-semibold py-10">Ask a public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="p-5 bg-white rounded shadow">
            <label htmlFor="ask-ques-title" className="block mb-5">
              <h4 className="text-lg font-medium">Title</h4>
              <p className="text-sm mb-2">
                Be specific and imagine you’re asking a question to another person
              </p>
              <input
                type="text"
                id="ask-ques-title"
                className="w-full p-2 border rounded"
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              />
            </label>
            <label htmlFor="ask-ques-body" className="block mb-5">
              <h4 className="text-lg font-medium">Body</h4>
              <p className="text-sm mb-2">
                Include all the information someone would need to answer your question
              </p>
              <textarea
                id="ask-ques-body"
                className="w-full p-2 border rounded resize-none"
                onChange={(e) => setQuestionBody(e.target.value)}
                cols="30"
                rows="10"
                onKeyPress={handleEnter}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags" className="block mb-5">
              <h4 className="text-lg font-medium">Tags</h4>
              <p className="text-sm mb-2">
                Add up to 5 tags to describe what your question is about
              </p>
              <input
                type="text"
                id="ask-ques-tags"
                className="w-full p-2 border rounded"
                onChange={(e) => setQuestionTags(e.target.value.split(" "))}
                placeholder="e.g. (xml typescript wordpress)"
              />
            </label>
          </div>
          <input
            type="submit"
            value="Review your question"
            className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition duration-300"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
