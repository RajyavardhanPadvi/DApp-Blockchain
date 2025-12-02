/**
 * Deploy script that writes the deployed address + ABI into /app/deployments/Voting.json
 * so other services (backend) can pick it up via the shared docker volume.
 *
 * Assumes there's a Docker volume mounted at /app/deployments (compose already had that).
 */
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(/* constructor args if any */);
  await voting.deployed();

  console.log("Voting contract deployed to:", voting.address);

  // Ensure deployments directory exists
  const outDir = "/app/deployments";
  try { fs.mkdirSync(outDir, { recursive: true }); } catch (e) {}

  // Read artifact to get ABI
  const artifact = await artifacts.readArtifact("Voting"); // returns object with abi
  const out = {
    address: voting.address,
    abi: artifact.abi,
    deployedAt: new Date().toISOString()
  };

  const outPath = path.join(outDir, "Voting.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), { encoding: "utf8" });
  console.log("Wrote deployment file to", outPath);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Deploy failed:", err);
    process.exit(1);
  });
