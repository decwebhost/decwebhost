let web3 = new Web3(Web3.givenProvider);

// Load the contract using the contract address and ABI
let contractAddress = '0x172dC57FDEb34f3E200d0599f9C70bc4035e9B05';
let contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "deleteData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getData",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "storeData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
let contract = new web3.eth.Contract(contractABI, contractAddress);

// Get the account from the currently connected wallet
let account;

async function getAccount() {
    let accounts = await web3.eth.getAccounts();
    account = accounts[0];
}

getAccount();


// Metamask connection
async function connectMetamask() {
  try {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // Get the selected address
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const selectedAddress = accounts[0];
    console.log('Connected to Metamask with address:', selectedAddress);
    // Update the UI to show the connected address
    document.getElementById('connectButton').style.display = 'none';
    document.getElementById('connectedAddress').innerHTML = `Connected with address: ${selectedAddress}`;
    document.getElementById('connectedAddress').style.display = 'block';
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('load', async () => {
  // Check if Metamask is installed
  if (typeof window.ethereum !== 'undefined') {
    console.log('Metamask is installed!');
    // Show the connect button
    document.getElementById('connectButton').style.display = 'block';
  } else {
    console.log('Metamask is not installed!');
  }
});

function renderFileData() {
    const fileInput = document.getElementById("myFileInput");
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const contents = event.target.result;
        document.getElementById("rendered").innerHTML = encodeURIComponent(contents);
        document.getElementById("result").innerHTML = "File rendered successfully!";
    };
    reader.readAsText(file);
}

// Function to store data in the contract
async function storeData() {
    let name = document.getElementById("nameInput").value;
    let value = document.getElementById("rendered").innerHTML;
    console.log(value);
    await contract.methods.storeData(name, value).send({from: window.ethereum.selectedAddress});
    document.getElementById("result").innerHTML = "Your website hosted! <a href='/view.html?name="+name+"'><button>Explore!</button></a>";
}

// Function to delete data from the contract ONLY FOR ADMINS!
async function deleteData(name) {
    await contract.methods.deleteData(name).send({from: window.ethereum.selectedAddress});
    document.getElementById("result").innerHTML = "Data deleted successfully!";
}

// Function to get data from the contract
async function getData() {
    let name = document.getElementById("nameInput").value;
    let data = await contract.methods.getData(name).call();
    if (data == "NoNe"){
        document.getElementById("result").innerHTML = "You can use this name :)";
        document.getElementById("bhost").innerHTML = '<button onclick="storeData()">Host!</button>';
    } else{
        // document.getElementById("result").innerHTML = decodeURIComponent(data);
        document.getElementById("result").innerHTML = "Name already exist :(";
        document.getElementById("bhost").innerHTML = "";
    }
}
