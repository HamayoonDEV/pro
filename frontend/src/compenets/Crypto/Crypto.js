import React from "react";
import styles from "./Crypto.module.css";
import { useState, useEffect } from "react";
import { getCrypto } from "../../api/external";

const Crypto = () => {
  const [crypto, setCrypto] = useState([]);

  useEffect(() => {
    (async function fetchCrypto() {
      try {
        const response = await getCrypto();
        setCrypto(response);
      } catch (error) {
        return error;
      }
    })();
  });
  return (
    <div className={styles.crypto}>
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>coin</td>
            <td>symbol</td>
            <td>price</td>
            <td>24%</td>
          </tr>
        </thead>
        <tbody>
          {crypto.map((coin) => (
            <tr>
              <td>{coin.market_cap_rank}</td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>{coin.current_price}</td>
              <td>{coin.price_change_percentage_24h}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crypto;
