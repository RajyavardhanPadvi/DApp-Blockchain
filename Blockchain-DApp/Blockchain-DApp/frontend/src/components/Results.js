import React from 'react';

function Results({ candidates, election }) {
  const totalVotes = election?.totalVotes || 0;
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const winner = sortedCandidates[0];

  return (
    <div className="results">
      <h2>Election Results</h2>
      
      <div className="results-summary">
        <div className="summary-card">
          <div className="value">{totalVotes}</div>
          <div className="label">Total Votes</div>
        </div>
        <div className="summary-card">
          <div className="value">{candidates.length}</div>
          <div className="label">Candidates</div>
        </div>
        <div className="summary-card">
          <div className="value">{election?.totalVoters || 0}</div>
          <div className="label">Registered Voters</div>
        </div>
        <div className="summary-card">
          <div className="value">
            {totalVotes > 0 ? Math.round((totalVotes / (election?.totalVoters || 1)) * 100) : 0}%
          </div>
          <div className="label">Turnout</div>
        </div>
      </div>

      <div className="results-chart">
        {sortedCandidates.map(candidate => {
          const percentage = totalVotes > 0 
            ? Math.round((candidate.voteCount / totalVotes) * 100) 
            : 0;
          
          return (
            <div key={candidate.id} className="result-bar">
              <div className="result-info">
                <span className="result-name">
                  #{candidate.id} {candidate.name} ({candidate.party})
                </span>
                <span className="result-votes">{candidate.voteCount} votes</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: ${Math.max(percentage, 3)}% }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {winner && winner.voteCount > 0 && (
        <div className="winner-card">
          <h3>🏆 Leading Candidate</h3>
          <div className="winner-name">{winner.name}</div>
          <div className="winner-party">{winner.party}</div>
          <div className="winner-votes">{winner.voteCount} votes</div>
        </div>
      )}
    </div>
  );
}

export default Results;
