import React from "react";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { getNews } from "../../api/external";

const Home = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    (async function fetchNews() {
      try {
        const response = await getNews();
        setNews(response);
      } catch (error) {
        return error;
      }
    })();
  }, []);
  const handleFull = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className={styles.home}>
      <div className={styles.cards}>
        {news.map((New) => (
          <div
            className={styles.card}
            key={New.title}
            onClick={() => handleFull(New.url)}
          >
            <h1>{New.title}</h1>
            <h2>{New.author}</h2>
            <h3>{New.publishedAt}</h3>
            <img src={New.urlToImage} />
            <p>{New.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
