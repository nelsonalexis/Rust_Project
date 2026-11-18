import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}





export interface Rental {
  arbitrator_1: string;
  arbitrator_2: string;
  arbitrator_3: string;
  claim_amount: i128;
  claim_evidence_hash: Buffer;
  deposit_amount: i128;
  final_evidence_hash: Buffer;
  initial_evidence_hash: Buffer;
  owner: string;
  owner_return_approved: boolean;
  owner_start_approved: boolean;
  rental_id: u64;
  renter: string;
  renter_return_approved: boolean;
  renter_start_approved: boolean;
  status: RentalStatus;
  token: string;
  undisputed_released: i128;
  vote_1: i128;
  vote_2: i128;
  vote_3: i128;
  voted_1: boolean;
  voted_2: boolean;
  voted_3: boolean;
}

export const EscrowError = {
  1: {message:"InvalidDeposit"},
  2: {message:"SameParties"},
  3: {message:"DuplicateArbitrators"},
  4: {message:"DuplicateRental"},
  5: {message:"InvalidStatus"},
  6: {message:"NotAccepted"},
  7: {message:"NotFunded"},
  8: {message:"CannotCancel"},
  9: {message:"NotActive"},
  10: {message:"ReturnNotReported"},
  11: {message:"ReturnNotConfirmed"},
  12: {message:"InvalidClaimAmount"},
  13: {message:"DuplicateClaim"},
  14: {message:"NoClaim"},
  15: {message:"NoDispute"},
  16: {message:"InvalidVote"},
  17: {message:"AlreadyVoted"},
  18: {message:"NotArbitrator"},
  19: {message:"InvalidAward"},
  20: {message:"RentalNotFound"}
}

export type RentalStatus = {tag: "Created", values: void} | {tag: "Accepted", values: void} | {tag: "Funded", values: void} | {tag: "Active", values: void} | {tag: "ReturnReported", values: void} | {tag: "VehicleReturned", values: void} | {tag: "Claim", values: void} | {tag: "Disputed", values: void} | {tag: "Resolved", values: void} | {tag: "Cancelled", values: void};

export interface Client {
  /**
   * Construct and simulate a vote transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  vote: ({rental_id, arbitrator, vote_amount}: {rental_id: u64, arbitrator: string, vote_amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a cancel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a get_rental transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_rental: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a make_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  make_claim: ({rental_id, amount, evidence_hash}: {rental_id: u64, amount: i128, evidence_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a owner_start transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner_start: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a accept_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  accept_claim: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a renter_start transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renter_start: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a accept_rental transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  accept_rental: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a create_rental transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_rental: ({rental_id, renter, owner, token, deposit_amount, initial_evidence_hash, arbitrator_1, arbitrator_2, arbitrator_3}: {rental_id: u64, renter: string, owner: string, token: string, deposit_amount: i128, initial_evidence_hash: Buffer, arbitrator_1: string, arbitrator_2: string, arbitrator_3: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a dispute_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  dispute_claim: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a report_return transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  report_return: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a contract_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  contract_address: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a release_no_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  release_no_claim: ({rental_id}: {rental_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a owner_confirm_return transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner_confirm_return: ({rental_id, final_evidence_hash}: {rental_id: u64, final_evidence_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

  /**
   * Construct and simulate a renter_confirm_return transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  renter_confirm_return: ({rental_id, final_evidence_hash}: {rental_id: u64, final_evidence_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<Rental>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABlJlbnRhbAAAAAAAGAAAAAAAAAAMYXJiaXRyYXRvcl8xAAAAEwAAAAAAAAAMYXJiaXRyYXRvcl8yAAAAEwAAAAAAAAAMYXJiaXRyYXRvcl8zAAAAEwAAAAAAAAAMY2xhaW1fYW1vdW50AAAACwAAAAAAAAATY2xhaW1fZXZpZGVuY2VfaGFzaAAAAAPuAAAAIAAAAAAAAAAOZGVwb3NpdF9hbW91bnQAAAAAAAsAAAAAAAAAE2ZpbmFsX2V2aWRlbmNlX2hhc2gAAAAD7gAAACAAAAAAAAAAFWluaXRpYWxfZXZpZGVuY2VfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAFW93bmVyX3JldHVybl9hcHByb3ZlZAAAAAAAAAEAAAAAAAAAFG93bmVyX3N0YXJ0X2FwcHJvdmVkAAAAAQAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAAAAAAGcmVudGVyAAAAAAATAAAAAAAAABZyZW50ZXJfcmV0dXJuX2FwcHJvdmVkAAAAAAABAAAAAAAAABVyZW50ZXJfc3RhcnRfYXBwcm92ZWQAAAAAAAABAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAAMUmVudGFsU3RhdHVzAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAAE3VuZGlzcHV0ZWRfcmVsZWFzZWQAAAAACwAAAAAAAAAGdm90ZV8xAAAAAAALAAAAAAAAAAZ2b3RlXzIAAAAAAAsAAAAAAAAABnZvdGVfMwAAAAAACwAAAAAAAAAHdm90ZWRfMQAAAAABAAAAAAAAAAd2b3RlZF8yAAAAAAEAAAAAAAAAB3ZvdGVkXzMAAAAAAQ==",
        "AAAABAAAAAAAAAAAAAAAC0VzY3Jvd0Vycm9yAAAAABQAAAAAAAAADkludmFsaWREZXBvc2l0AAAAAAABAAAAAAAAAAtTYW1lUGFydGllcwAAAAACAAAAAAAAABREdXBsaWNhdGVBcmJpdHJhdG9ycwAAAAMAAAAAAAAAD0R1cGxpY2F0ZVJlbnRhbAAAAAAEAAAAAAAAAA1JbnZhbGlkU3RhdHVzAAAAAAAABQAAAAAAAAALTm90QWNjZXB0ZWQAAAAABgAAAAAAAAAJTm90RnVuZGVkAAAAAAAABwAAAAAAAAAMQ2Fubm90Q2FuY2VsAAAACAAAAAAAAAAJTm90QWN0aXZlAAAAAAAACQAAAAAAAAARUmV0dXJuTm90UmVwb3J0ZWQAAAAAAAAKAAAAAAAAABJSZXR1cm5Ob3RDb25maXJtZWQAAAAAAAsAAAAAAAAAEkludmFsaWRDbGFpbUFtb3VudAAAAAAADAAAAAAAAAAORHVwbGljYXRlQ2xhaW0AAAAAAA0AAAAAAAAAB05vQ2xhaW0AAAAADgAAAAAAAAAJTm9EaXNwdXRlAAAAAAAADwAAAAAAAAALSW52YWxpZFZvdGUAAAAAEAAAAAAAAAAMQWxyZWFkeVZvdGVkAAAAEQAAAAAAAAANTm90QXJiaXRyYXRvcgAAAAAAABIAAAAAAAAADEludmFsaWRBd2FyZAAAABMAAAAAAAAADlJlbnRhbE5vdEZvdW5kAAAAAAAU",
        "AAAAAgAAAAAAAAAAAAAADFJlbnRhbFN0YXR1cwAAAAoAAAAAAAAAAAAAAAdDcmVhdGVkAAAAAAAAAAAAAAAACEFjY2VwdGVkAAAAAAAAAAAAAAAGRnVuZGVkAAAAAAAAAAAAAAAAAAZBY3RpdmUAAAAAAAAAAAAAAAAADlJldHVyblJlcG9ydGVkAAAAAAAAAAAAAAAAAA9WZWhpY2xlUmV0dXJuZWQAAAAAAAAAAAAAAAAFQ2xhaW0AAAAAAAAAAAAAAAAAAAhEaXNwdXRlZAAAAAAAAAAAAAAACFJlc29sdmVkAAAAAAAAAAAAAAAJQ2FuY2VsbGVkAAAA",
        "AAAAAAAAAAAAAAAEdm90ZQAAAAMAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAAAAAAACmFyYml0cmF0b3IAAAAAABMAAAAAAAAAC3ZvdGVfYW1vdW50AAAAAAsAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAAGY2FuY2VsAAAAAAABAAAAAAAAAAlyZW50YWxfaWQAAAAAAAAGAAAAAQAAA+kAAAfQAAAABlJlbnRhbAAAAAAH0AAAAAtFc2Nyb3dFcnJvcgA=",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAABAAAAAAAAAAlyZW50YWxfaWQAAAAAAAAGAAAAAQAAA+kAAAfQAAAABlJlbnRhbAAAAAAH0AAAAAtFc2Nyb3dFcnJvcgA=",
        "AAAAAAAAAAAAAAAKZ2V0X3JlbnRhbAAAAAAAAQAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA",
        "AAAAAAAAAAAAAAAKbWFrZV9jbGFpbQAAAAAAAwAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAA1ldmlkZW5jZV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAALb3duZXJfc3RhcnQAAAAAAQAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA",
        "AAAAAAAAAAAAAAAMYWNjZXB0X2NsYWltAAAAAQAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA",
        "AAAAAAAAAAAAAAAMcmVudGVyX3N0YXJ0AAAAAQAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA",
        "AAAAAAAAAAAAAAANYWNjZXB0X3JlbnRhbAAAAAAAAAEAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAANY3JlYXRlX3JlbnRhbAAAAAAAAAkAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAAAAAAABnJlbnRlcgAAAAAAEwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAADmRlcG9zaXRfYW1vdW50AAAAAAALAAAAAAAAABVpbml0aWFsX2V2aWRlbmNlX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAMYXJiaXRyYXRvcl8xAAAAEwAAAAAAAAAMYXJiaXRyYXRvcl8yAAAAEwAAAAAAAAAMYXJiaXRyYXRvcl8zAAAAEwAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA",
        "AAAAAAAAAAAAAAANZGlzcHV0ZV9jbGFpbQAAAAAAAAEAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAANcmVwb3J0X3JldHVybgAAAAAAAAEAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAAQY29udHJhY3RfYWRkcmVzcwAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAQcmVsZWFzZV9ub19jbGFpbQAAAAEAAAAAAAAACXJlbnRhbF9pZAAAAAAAAAYAAAABAAAD6QAAB9AAAAAGUmVudGFsAAAAAAfQAAAAC0VzY3Jvd0Vycm9yAA==",
        "AAAAAAAAAAAAAAAUb3duZXJfY29uZmlybV9yZXR1cm4AAAACAAAAAAAAAAlyZW50YWxfaWQAAAAAAAAGAAAAAAAAABNmaW5hbF9ldmlkZW5jZV9oYXNoAAAAA+4AAAAgAAAAAQAAA+kAAAfQAAAABlJlbnRhbAAAAAAH0AAAAAtFc2Nyb3dFcnJvcgA=",
        "AAAAAAAAAAAAAAAVcmVudGVyX2NvbmZpcm1fcmV0dXJuAAAAAAAAAgAAAAAAAAAJcmVudGFsX2lkAAAAAAAABgAAAAAAAAATZmluYWxfZXZpZGVuY2VfaGFzaAAAAAPuAAAAIAAAAAEAAAPpAAAH0AAAAAZSZW50YWwAAAAAB9AAAAALRXNjcm93RXJyb3IA" ]),
      options
    )
  }
  public readonly fromJSON = {
    vote: this.txFromJSON<Result<Rental>>,
        cancel: this.txFromJSON<Result<Rental>>,
        deposit: this.txFromJSON<Result<Rental>>,
        get_rental: this.txFromJSON<Result<Rental>>,
        make_claim: this.txFromJSON<Result<Rental>>,
        owner_start: this.txFromJSON<Result<Rental>>,
        accept_claim: this.txFromJSON<Result<Rental>>,
        renter_start: this.txFromJSON<Result<Rental>>,
        accept_rental: this.txFromJSON<Result<Rental>>,
        create_rental: this.txFromJSON<Result<Rental>>,
        dispute_claim: this.txFromJSON<Result<Rental>>,
        report_return: this.txFromJSON<Result<Rental>>,
        contract_address: this.txFromJSON<string>,
        release_no_claim: this.txFromJSON<Result<Rental>>,
        owner_confirm_return: this.txFromJSON<Result<Rental>>,
        renter_confirm_return: this.txFromJSON<Result<Rental>>
  }
}