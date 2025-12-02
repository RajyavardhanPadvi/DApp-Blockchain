import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [voterStatus, setVoterStatus] = useState(null);
  const [election, setElection] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const candRes = await fetch(API + '/candidates');
      const candData = await candRes.json();
      
      const accRes = await fetch(API + '/accounts');
      const accData = await accRes.json();
      
      const elecRes = await fetch(API + '/election');
      const elecData = await elecRes.json();
      
      setCandidates(candData);
      setAccounts(accData);
      setElection(elecData);
      
      if (!selectedAccount && accData.length > 1) {
        setSelectedAccount(accData[1]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setTimeout(fetchData, 3000);
    }
  };

  const fetchVoterStatus = async () => {
    if (!selectedAccount) return;
    try {
      const res = await fetch(API + '/voter/' + selectedAccount.address);
      const data = await res.json();
      setVoterStatus(data);
    } catch (err) {
      console.error('Voter status error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVoterStatus();
  }, [selectedAccount]);

  const handleVote = async (candidateId) => {
    if (!selectedAccount) {
      setMessage('Please select an account');
      return;
    }

    try {
      setMessage('Casting vote...');
      const res = await fetch(API + '/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidateId,
          privateKey: selectedAccount.privateKey
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage('Vote cast successfully!');
        await fetchData();
        await fetchVoterStatus();
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Connecting to Blockchain...</h2>
          <p>Please wait while the system initializes</p>
        </div>
      </div>
    );
  }

  const totalVotes = candidates.reduce(function(sum, c) { return sum + c.voteCount; }, 0);

  return (
    <div className="container">
      <header className="header">
        <h1>Decentralized Voting System</h1>
        <div className="election-info">
          <span className={election && election.isActive ? 'status active' : 'status ended'}>
            {election && election.isActive ? 'Active' : 'Ended'}
          </span>
          <span>Total Votes: {totalVotes}</span>
        </div>
      </header>

      {message && (
        <div className={message.includes('Error') ? 'message error' : 'message success'}>
          {message}
          <button onClick={() => setMessage('')}>X</button>
        </div>
      )}

      <div className="account-section">
        <h3>Select Your Account</h3>
        <select
          value={selectedAccount ? selectedAccount.address : ''}
          onChange={(e) => {
            const acc = accounts.find(function(a) { return a.address === e.target.value; });
            setSelectedAccount(acc);
          }}
        >
          {accounts.map(function(acc) {
            return (
              <option key={acc.address} value={acc.address}>
                {acc.role} - {acc.address.substring(0, 10)}...{acc.address.substring(acc.address.length - 6)}
              </option>
            );
          })}
        </select>
        
        {voterStatus && (
          <div className="voter-status">
            <span>Registered: {voterStatus.isRegistered ? 'Yes' : 'No'}</span>
            <span>Voted: {voterStatus.hasVoted ? 'Yes' : 'No'}</span>
            {voterStatus.hasVoted && (
              <span>Voted for: Candidate #{voterStatus.votedCandidateId}</span>
            )}
          </div>
        )}
      </div>

      <div className="candidates-section">
        <h2>Candidates</h2>
        <div className="candidates-grid">
          {candidates.map(function(candidate) {
            return (
              <div 
                key={candidate.id} 
                className={voterStatus && voterStatus.votedCandidateId === candidate.id ? 'candidate-card voted' : 'candidate-card'}
              >
                <div className="candidate-id">#{candidate.id}</div>
                <h3>{candidate.name}</h3>
                <p className="party">{candidate.party}</p>
                <div className="votes">{candidate.voteCount} votes</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: (totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0) + '%' }}
                  ></div>
                </div>
                
                {voterStatus && voterStatus.votedCandidateId === candidate.id ? (
                  <div className="voted-badge">Your Vote</div>
                ) : (
                  <button
                    className="vote-btn"
                    onClick={() => handleVote(candidate.id)}
                    disabled={!voterStatus || !voterStatus.isRegistered || voterStatus.hasVoted || !election || !election.isActive}
                  >
                    Vote
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="results-section">
        <h2>Live Results</h2>
        <div className="results">
          {candidates
            .slice()
            .sort(function(a, b) { return b.voteCount - a.voteCount; })
            .map(function(candidate, index) {
              var percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
              return (
                <div key={candidate.id} className="result-row">
                  <span className="rank">{index === 0 && candidate.voteCount > 0 ? 'Winner' : '#' + (index + 1)}</span>
                  <span className="name">{candidate.name}</span>
                  <span className="party-small">{candidate.party}</span>
                  <div className="result-bar-container">
                    <div 
                      className="result-bar" 
                      style={{ width: (percentage > 0 ? percentage : 2) + '%' }}
                    >
                      {percentage}%
                    </div>
                  </div>
                  <span className="vote-count">{candidate.voteCount}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
