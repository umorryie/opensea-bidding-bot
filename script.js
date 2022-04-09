import dotenv from "dotenv";
import { validateData } from "./errorHandler.js";
import { OpenseaWrapper } from "./OpenseaWrapper.js";
dotenv.config();

const offerPrice = 12;
const slug = "doodles-official";

const providerUrl = process.env.PROVIDER;
const walletAddress = process.env.WALLET_ADDRESS;
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
const network = process.env.NETWORK || "mainnet";
const openSeaApiKey = process.env.OPENSEA_API_KEY;

validateData(
    walletAddress,
    walletPrivateKey,
    openSeaApiKey,
    providerUrl,
    slug,
    offerPrice
);

const openseaWrapper = new OpenseaWrapper(
    walletPrivateKey,
    providerUrl,
    network,
    openSeaApiKey,
    slug,
    offerPrice,
    walletAddress,
);

openseaWrapper.sendOffers();
