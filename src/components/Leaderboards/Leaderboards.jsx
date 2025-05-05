import React, { useEffect, useState } from 'react';
import './Leaderboards.scss';
import { db, auth } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Leaderboards = () => {
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const usersRef = collection(db, 'users');
  
    const leaderboardQuery = query(
      usersRef,
      where("credits", ">=", 0),
      orderBy("credits", "desc")
    );
  
    const unsubscribe = onSnapshot(leaderboardQuery, (querySnapshot) => {
      console.log("🔥 Snapshot triggered. Document count:", querySnapshot.size);
  
      querySnapshot.forEach(doc => {
        console.log("📄 Document ID:", doc.id, "→", doc.data());
      });
  
      const data = querySnapshot.docs.map(doc => {
        const user = doc.data();
      
        const hasDisplayName = Object.prototype.hasOwnProperty.call(user, 'displayName');
        const rawName = hasDisplayName ? String(user.displayName).trim() : '';
        const isUnsafe = rawName.includes('@') || rawName.length === 0;
      
        // ✅ New fallback logic without "Player-"
        const safeName = isUnsafe ? doc.id.slice(0, 4).toUpperCase() : rawName;
      
        return {
          id: doc.id,
          displayName: safeName,
          credits: typeof user.credits === 'number' ? user.credits : 0
        };
      });
  
      console.log("✅ Processed players array:", data);
      setPlayers(data);
    });
  
    return () => unsubscribe();
  }, []);

  const podium = players.slice(0, 3);
  const rest = players.slice(3);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="leaderboards-container">
      <h1>Top Grossing Players</h1>
      <p>Peak of the Hill!</p>

      {/* Podium */}
      <div className="podium">
        {podium.map((player, index) => (
          <div
            key={player.id}
            className={`podium-place ${["first-place", "second-place", "third-place"][index]}`}
          >
            <div className="avatar-placeholder">
              <span className="initials">{getInitials(player.displayName)}</span>
            </div>
            <span className="place">{["1st", "2nd", "3rd"][index]} Place</span>
            <span className="name"><strong>{player.displayName}</strong></span>
            <span className="score">{player.credits} credits</span>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {rest.map((player, index) => (
            <tr
              key={player.id}
              className={currentUser && player.id === currentUser.uid ? 'highlighted-row' : ''}
            >
              <td>{index + 4}</td>
              <td>{player.displayName}</td>
              <td>{player.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
