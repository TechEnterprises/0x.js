// HACK: web3 injects XMLHttpRequest into the global scope and ProviderEngine checks XMLHttpRequest
// to know whether it is running in a browser or node environment. We need it to be undefined since
// we are not running in a browser env.
// Filed issue: https://github.com/ethereum/web3.js/issues/844
(global as any).XMLHttpRequest = undefined;
import ProviderEngine = require('web3-provider-engine');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
import * as Web3 from 'web3';
import {constants} from './constants';

export const web3Factory = {
    create(): Web3 {
        const provider = this.getRpcProvider();
        const web3 = new Web3();
        web3.setProvider(provider);
        return web3;
    },
    getRpcProvider(): Web3.Provider {
        const provider = new ProviderEngine();
        const rpcUrl = `http://${constants.RPC_HOST}:${constants.RPC_PORT}`;
        provider.addProvider(new RpcSubprovider({
            rpcUrl,
        }));
        provider.start();
        return provider;
    },
};
