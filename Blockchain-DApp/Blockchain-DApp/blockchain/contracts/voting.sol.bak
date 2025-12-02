// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    // Structures
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 registrationTime;
    }

    struct Election {
        string name;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
    }

    // State variables
    address public admin;
    Election public election;
    uint256 public candidateCount;
    uint256 public voterCount;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;
    address[] public voterAddresses;

    // Events
    event ElectionCreated(string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event VoterRegistered(address indexed voter, uint256 timestamp);
    event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
    event ElectionEnded(uint256 totalVotes, uint256 timestamp);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive() {
        require(election.isActive, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }

    modifier notYetVoted() {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    // Admin Functions
    function createElection(
        string memory _name,
        uint256 _durationInMinutes
    ) public onlyAdmin {
        require(!election.isActive, "An election is already active");
        
        election = Election({
            name: _name,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationInMinutes * 1 minutes),
            isActive: true,
            totalVotes: 0
        });

        emit ElectionCreated(_name, election.startTime, election.endTime);
    }

    function addCandidate(
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            party: _party,
            voteCount: 0,
            exists: true
        });

        emit CandidateAdded(candidateCount, _name, _party);
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter already registered");
        
        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0,
            registrationTime: block.timestamp
        });
        
        voterAddresses.push(_voter);
        voterCount++;

        emit VoterRegistered(_voter, block.timestamp);
    }

    function endElection() public onlyAdmin {
        require(election.isActive, "No active election");
        election.isActive = false;
        emit ElectionEnded(election.totalVotes, block.timestamp);
    }

    // Voter Functions
    function vote(uint256 _candidateId) public electionActive notYetVoted {
        require(candidates[_candidateId].exists, "Candidate does not exist");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;
        election.totalVotes++;

        emit VoteCast(msg.sender, _candidateId, block.timestamp);
    }

    // View Functions
    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        string memory party,
        uint256 voteCount
    ) {
        require(candidates[_candidateId].exists, "Candidate does not exist");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.party, c.voteCount);
    }

    function getAllCandidates() public view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory parties,
        uint256[] memory voteCounts
    ) {
        ids = new uint256[](candidateCount);
        names = new string[](candidateCount);
        parties = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);

        for (uint256 i = 1; i <= candidateCount; i++) {
            ids[i-1] = candidates[i].id;
            names[i-1] = candidates[i].name;
            parties[i-1] = candidates[i].party;
            voteCounts[i-1] = candidates[i].voteCount;
        }

        return (ids, names, parties, voteCounts);
    }

    function getVoterStatus(address _voter) public view returns (
        bool isRegistered,
        bool hasVoted,
        uint256 votedCandidateId
    ) {
        Voter memory v = voters[_voter];
        return (v.isRegistered, v.hasVoted, v.votedCandidateId);
    }

    function getElectionInfo() public view returns (
        string memory name,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes,
        uint256 totalCandidates,
        uint256 totalVoters
    ) {
        return (
            election.name,
            election.startTime,
            election.endTime,
            election.isActive,
            election.totalVotes,
            candidateCount,
            voterCount
        );
    }

    function getWinner() public view returns (
        uint256 winnerId,
        string memory winnerName,
        string memory winnerParty,
        uint256 winnerVotes
    ) {
        require(candidateCount > 0, "No candidates");
        
        uint256 maxVotes = 0;
        uint256 winningId = 0;

        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningId = i;
            }
        }

        if (winningId > 0) {
            Candidate memory winner = candidates[winningId];
            return (winner.id, winner.name, winner.party, winner.voteCount);
        }

        return (0, "", "", 0);
    }

    function getRemainingTime() public view returns (uint256) {
        if (!election.isActive || block.timestamp >= election.endTime) {
            return 0;
        }
        return election.endTime - block.timestamp;
    }
}

