import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './wallets.schema';
import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async createWallet(network: 'mainnet' | 'testnet') {

    const bitcoinNetwork = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

    const ECPair = ECPairFactory.ECPairFactory(ecc);

    const keyPair = ECPair.makeRandom({ network: bitcoinNetwork });

    const pubkeyBuffer = Buffer.from(keyPair.publicKey);

    const { address } = bitcoin.payments.p2pkh({
      pubkey: pubkeyBuffer,
      network: bitcoinNetwork,
    });

    const wallet = new this.walletModel({
      address,
      privateKey: keyPair.toWIF(),
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
