import React from 'react';
import './Leaderboards.scss';

const Leaderboards = () => {
    return (
        <div className="leaderboards-container">
            <h1>Top Grossing Players</h1>
            <p>Peak of the Hill!</p>

            {/* Podium for top 3 (empty placeholders) */}
            <div className="podium">
                <div className="podium-place second-place">
                    <div className="avatar-placeholder"></div>
                    <span className="place">2nd Place</span>
                    <span className="name"><strong>---</strong></span>
                    <span className="score">---</span>
                </div>

                <div className="podium-place first-place">
                    <div className="avatar-placeholder"></div>
                    <span className="place">1st Place</span>
                    <span className="name"><strong>---</strong></span>
                    <span className="score">---</span>
                </div>

                <div className="podium-place third-place">
                    <div className="avatar-placeholder"></div>
                    <span className="place">3rd Place</span>
                    <span className="name"><strong>---</strong></span>
                    <span className="score">---</span>
                </div>
            </div>

            {/* Empty leaderboard table structure */}
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Participant</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Add rows dynamically later when data is available */}
                    <tr><td>1</td><td>---</td><td>---</td></tr>
                    <tr><td>2</td><td>---</td><td>---</td></tr>
                    <tr><td>3</td><td>---</td><td>---</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboards;
