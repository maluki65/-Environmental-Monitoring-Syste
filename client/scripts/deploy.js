async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contract with the account:", deployer.address);

    const StoreData = await ethers.getContractFactory("StoreData");
    const storeData = await StoreData.deploy();

    console.log("StoreData contract deployed to:", await storeData.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
