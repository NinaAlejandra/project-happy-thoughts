import React, { useEffect, useState } from "react";

import ThoughtForm from "./components/ThoughtsForm";
import ThoughtItem from "./components/ThoughtItem";
import LoadingItem from "./components/LoadingItem";

import { API_URL, LIKES_URL } from "./utils/urls";

export const App = () => {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setThoughts(data))
      .finally(() => setLoading(false));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newThought }),
    };

    fetch(API_URL, options)
      .then((res) => res.json())
      .then((data) => setThoughts([data, ...thoughts]));
  };

  const handleLikesIncrease = (thoughtId) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(LIKES_URL(thoughtId), options)
      .then((res) => res.json())
      .then((data) => {
        const updatedThoughts = thoughts.map((item) => {
          if (item._id === data._id) {
            item.hearts += 1;
            return item;
          } else {
            return item;
          }
        });

        setThoughts(updatedThoughts);
        fetchThoughts();
      });
  };

  return (
    <div className="thought-container">
      {loading && <LoadingItem />}
      <ThoughtForm
        onFormSubmit={handleFormSubmit}
        newThought={newThought}
        setNewThought={setNewThought}
        loading={loading}
        setLoading={setLoading}
      />

      {thoughts.map((thought) => (
        <ThoughtItem
          key={thought._id}
          thought={thought}
          onLikesIncrease={handleLikesIncrease}
        />
      ))}
    </div>
  );
};
