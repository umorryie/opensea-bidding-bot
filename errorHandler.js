export class BidError extends Error {
    constructor(message) {
        super();
        this.name = "Bidding error";
        this.message = message;
    }
}

export const validateData = (
    walletAddress,
    walletPrivateKey,
    openSeaApiKey,
    providerUrl,
    slug,
    offerPrice
) => {
    if (!walletAddress) {
        throw new BidError("Missing wallet address");
    }

    if (!walletPrivateKey) {
        throw new BidError("Missing wallet key");
    }

    if (!openSeaApiKey) {
        throw new BidError("Missing opensea api key");
    }

    if (!providerUrl) {
        throw new BidError("Missing rovider url");
    }

    if (!slug) {
        throw new BidError("Missing collection slug");
    }

    if (!offerPrice) {
        throw new BidError("Missing offer price");
    }
};
