import opensea from "opensea-js";
import fetch from "node-fetch";
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
import HDWalletProvider from "@truffle/hdwallet-provider";

import { BidError } from "./errorHandler.js";

export class OpenseaWrapper {
    constructor(
        walletPrivateKey,
        providerUrl,
        network,
        openSeaApiKey,
        slug,
        offerPrice,
        walletAddress
    ) {
        const providerEngine = new HDWalletProvider(walletPrivateKey, providerUrl);
        const today = new Date();
        today.setDate(today.getDate() + 7);

        this.walletAddress = walletAddress;
        this.seaport = new OpenSeaPort(providerEngine, {
            networkName: network == "mainnet" ? Network.Main : Network.Rinkeby,
            apiKey: openSeaApiKey,
        });
        this.slug = slug;
        this.openSeaApiKey = openSeaApiKey;
        this.offerPrice = offerPrice;
        this.expirationTime = today.getTime();
        this.cursor = undefined;
    }

    getCollection = async () => {
        try {
            const url = `https://api.opensea.io/api/v1/assets?collection_slug=${this.slug
                }&order_by=pk&order_direction=desc&limit=50${this.cursor ? `&cursor=${this.cursor}` : ""
                }`;
            const headers = {
                Accept: "application/json",
                "X-API-KEY": this.openSeaApiKey,
            };
            const res = await fetch(url, { method: "GET", headers });
            const json = await res.json();

            let assets = [];
            this.cursor = json.next;

            for (const nft of json.assets) {
                assets.push({
                    tokenAddress: nft.asset_contract.address,
                    tokenId: nft.token_id,
                });
            }

            return assets;
        } catch (error) {
            throw new BidError("Error retrieving collection assets");
        }
    };

    makeOffer = async (tokenAddress, tokenId) => {
        try {
            await this.seaport.createBuyOrder({
                asset: {
                    tokenId,
                    tokenAddress,
                },
                accountAddress: this.walletAddress,
                expirationTime: this.expirationTime,
                startAmount: this.offerPrice,
            });

            // Write to mongodb to save successful bid
            console.log(
                `Offered made for tokenAddress:${tokenAddress}, tokenId:${tokenId}.`
            );
        } catch (error) {
            throw new BidError("Error making an offer");
        }
    };

    sendOffers = async () => {
        while (this.cursor !== null) {
            const collection = await this.getCollection();

            for (const asset in collection) {
                await makeOffer(asset.tokenAddress, asset.tokenId);
            }
        }
    };
}
