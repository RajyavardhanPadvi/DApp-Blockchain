import React from 'react';

function Header({ election, remainingTime }) {
  if (!election) return null;

  return (
    <header className="header">
      <h1>🗳 {election.name || 'Decentralized Voting System'}</h1>
      <div className="header-info">
        <div className="info-item">
          <span className="info-label">Status</span>
          <span className={status-badge ${election.isActive ? 'active' : 'ended'}}>
            {election.isActive ? '🟢 Active' : '🔴 Ended'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Time Remaining</span>
          <span className="info-value timer">{remainingTime}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Votes</span>
          <span className="info-value">{election.totalVotes}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Candidates</span>
          <span className="info-value">{election.totalCandidates}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Registered Voters</span>
          <span className="info-value">{election.totalVoters}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
