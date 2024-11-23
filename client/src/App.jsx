import { ethers } from "ethers";
import "./App.css";
import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const contractABI = [];
const contractAddress = process.env.CONTRACT_ADDRESS;

function App () {

  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [mapCentre, setMapCentre] = useState({lat: 0, lng: 0});
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);

  //On connecting wallet 
  const connetWallet =  async ()  => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.web3Povider(wimdow.ethereum);
        await window.ethereum.request({ method: "eth_requstAccounts"});
        const signer = provider.getSigner();
        const address = await signer.address();
        setWalletAddress(address);
        setSigner(signer);
        console.log("wallet connected", address);
      } else {
        alert ("MetaMask not installed!");
      }
    } catch (err) {
      console.error("Error connecting to wallet", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!signer) return;

      try{
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const dataCount = await contract.dataCount();
        let fetchedData = [];

        for (let i = 1; i <= dataCount; i++) {
          const record = await contract.getData(i);
          fetchedData.push({
            humidity: record[0].toString(),
            temperature: record[1].toString(),
            gps: record[2],
            timestamp: new Date(record[3] * 1000).toLocaleString(),
          });
        }

        setData(fetchedData);

        if  (fetchedData.length > 0){
          const gps = fetchedData[fetchedData.length -1].gps.split(",");
          setMapCentre({ lat:parseFloat(gps[0]), lng: parseFloat(gps[1]) });
        }
    } catch (err) {
      console.log ("Error fetching data:". error);
      setError("Error fetching data from blockchain");
    }
  };

  const interval = setInterval(fetchData, 630000); // fetch data every 10.5 minutes
  fetchData();

  return () => clearInterval(interval);
},[signer]);

return (
   <div>
     <h1>FarmBlock monitoring system</h1>

     {/* On coonecting wallet*/}
     {walletAddress ? (
       <button type="button">
       {walletAddress.slice(0,6) + "..." + walletAddress.slice(38,42)}
       </button>
       ) : (
       <button type="button" 
          onClick={connetWallet}
          >
          Connect
        </button>
      )}

     {error ? <p>{error}</p> : null}

     {/* On tracking data*/}
     <table>
       <thead>
          <tr>
           <th>Humidity</th>
           <th>Temperature</th>
           <th>GPS</th>
           <th>Timestamp</th>
          </tr>
        </thead>
       <tbody>
         {data.map((entry, index) => (
           <tr key ={index}>
             <td>{entry.humidity}</td>
             <td>{entry.temperature}</td>
             <td>{entry.gps}</td>
             <td>{entry.timestamp}</td>
            </tr>
          ))}
       </tbody>
      </table>

     {/* On displaying Map*/}
     <Map
     initialViewState={{
       latitude: mapCentre.lat,
       longitude: mapCentre.lng,
       zoom: 12,
      }}
     style = {{ width: "100%", height: "400px"}}
     mapStyle= "mapbox://styles/mapbox/streets-v11"
     mapboxAccessToken= {process.env.MAPBOX_API} 
     >
       <Marker latitude={mapCentre.lat} longitude={mapCentre.lng} />
     </Map>
   </div>
  );
}

export default App;
/*import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractABI = [
  "function getData(uint256 _id) public view returns (uint256, uint256, uint256, string memory)"
];

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const providerUrl = "http://127.0.0.1:8545"; // Local Hardhat Node

  const fetchData = async () => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const data = await contract.getData(1); // Replace with actual data ID
      setSensorData({
        humidity: data[0].toString(),
        temperature: data[1].toString(),
        soilPH: data[2].toString(),
        gps: data[3]
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Sensor Data Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p><strong>Humidity:</strong> {sensorData.humidity}%</p>
          <p><strong>Temperature:</strong> {sensorData.temperature}°C</p>
          <p><strong>Soil pH:</strong> {sensorData.soilPH}</p>
          <p><strong>GPS Coordinates:</strong> {sensorData.gps}</p>
        </div>
      )}
    </div>
  );
}

export default App;*/
/*eth_chainId (2)
net_version
eth_chainId
eth_accounts
hardhat_metadata (20)
eth_accounts
hardhat_metadata (20)
eth_blockNumber
eth_getBlockByNumber
eth_feeHistory
eth_maxPriorityFeePerGas
eth_sendTransaction
  Contract deployment: <UnrecognizedContract>
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x87d96b7aebe36195617618c84944e0ee8dabae4917d57d93cff129508016021c
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            638127 of 30000000
  Block #1:            0xe305823f553df3ca07d24d55532e4b1fee16982ae4b7ffa7374eca020d42bbac*/
