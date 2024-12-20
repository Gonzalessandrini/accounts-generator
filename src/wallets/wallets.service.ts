import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './wallets.schema';
import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async createWallet(network: 'mainnet' | 'testnet') {

    const bitcoinNetwork = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

    const mnemonic = bip39.generateMnemonic();

    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, bitcoinNetwork);
    const keyPair = root.derivePath("m/44'/0'/0'/0/0");

    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: bitcoinNetwork,
    });

    const wallet = new this.walletModel({
      address,
      mnemonic,
      network,
    });

    return wallet.save();
  }

  async findAll() {
    return this.walletModel.find().exec();
  }

  async findOne(id: string) {
    return this.walletModel.findById(id).exec();
  }

  async update(id: string, updateWalletDto: Partial<Wallet>) {
    return this.walletModel.findByIdAndUpdate(id, updateWalletDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.walletModel.findByIdAndDelete(id).exec();
  }
}
