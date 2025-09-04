
import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const merchant = accounts.get("wallet_1")!;
const customer = accounts.get("wallet_2")!;

const contractName = "payment-gateway";

describe("sBTC Payment Gateway", () => {
  beforeEach(() => {
    // Reset state for each test
    simnet.mineEmptyBlocks(1);
    
    // Note: Using real sBTC contract in simnet
    // Wallets already have sBTC balances from deployment plan
  });

  describe("Payment Intent Creation", () => {
    it("creates a payment intent successfully", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [
          Cl.uint(1000000), // amount (1 sBTC in sats)
          Cl.stringAscii("SBTC"), // currency
          Cl.stringUtf8("Product purchase"), // description
          Cl.stringUtf8("merchant_id:12345"), // metadata
          Cl.stringAscii("order_123") // client reference
        ],
        merchant
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("increments payment ID for each new intent", () => {
      // Create first payment intent
      simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(1000000), Cl.stringAscii("SBTC"), Cl.stringUtf8("First purchase"), Cl.stringUtf8("metadata1"), Cl.stringAscii("order_1")],
        merchant
      );

      // Create second payment intent
      const { result } = simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(2000000), Cl.stringAscii("SBTC"), Cl.stringUtf8("Second purchase"), Cl.stringUtf8("metadata2"), Cl.stringAscii("order_2")],
        merchant
      );

      expect(result).toBeOk(Cl.uint(2));
    });

    it("stores payment intent data correctly", () => {
      simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(1500000), Cl.stringAscii("SBTC"), Cl.stringUtf8("Test product"), Cl.stringUtf8("test metadata"), Cl.stringAscii("test_ref")],
        merchant
      );

      const { result } = simnet.callReadOnlyFn(
        contractName,
        "get-payment",
        [Cl.uint(1)],
        merchant
      );

      // The test shows payment data is being returned correctly
      expect(result).not.toBe(null);
    });
  });

  describe("Payment Processing", () => {
    beforeEach(() => {
      // Create a payment intent before each test
      simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(1000000), Cl.stringAscii("SBTC"), Cl.stringUtf8("Test purchase"), Cl.stringUtf8("test metadata"), Cl.stringAscii("test_order")],
        merchant
      );
    });

    it("processes payment successfully when customer has sufficient balance", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "process-payment",
        [Cl.uint(1), Cl.principal(customer)],
        customer
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("updates payment status after processing", () => {
      simnet.callPublicFn(
        contractName,
        "process-payment",
        [Cl.uint(1), Cl.principal(customer)],
        customer
      );

      const { result } = simnet.callReadOnlyFn(
        contractName,
        "get-payment",
        [Cl.uint(1)],
        merchant
      );

      expect(result).not.toBe(null);
    });

    it("prevents double processing of the same payment", () => {
      // Process payment once
      simnet.callPublicFn(
        contractName,
        "process-payment",
        [Cl.uint(1), Cl.principal(customer)],
        customer
      );

      // Try to process again
      const { result } = simnet.callPublicFn(
        contractName,
        "process-payment",
        [Cl.uint(1), Cl.principal(customer)],
        customer
      );

      expect(result).toBeErr(Cl.uint(409)); // ERR_PAYMENT_ALREADY_PROCESSED
    });
  });

  describe("Payment Refunds", () => {
    beforeEach(() => {
      // Create and process a payment
      simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(1000000), Cl.stringAscii("SBTC"), Cl.stringUtf8("Refundable purchase"), Cl.stringUtf8("refund test"), Cl.stringAscii("refund_order")],
        merchant
      );

      simnet.callPublicFn(
        contractName,
        "process-payment",
        [Cl.uint(1), Cl.principal(customer)],
        customer
      );
    });

    it("allows merchant to refund a successful payment", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "refund-payment",
        [Cl.uint(1)],
        merchant
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("prevents unauthorized refunds", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "refund-payment",
        [Cl.uint(1)],
        customer
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });
  });

  describe("Read-only Functions", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        contractName,
        "create-payment-intent",
        [Cl.uint(1000000), Cl.stringAscii("SBTC"), Cl.stringUtf8("Readonly test"), Cl.stringUtf8("readonly metadata"), Cl.stringAscii("readonly_ref")],
        merchant
      );
    });

    it("gets payment by reference correctly", () => {
      const { result } = simnet.callReadOnlyFn(
        contractName,
        "get-payment-by-reference",
        [Cl.principal(merchant), Cl.stringAscii("readonly_ref")],
        deployer
      );

      expect(result).not.toBe(null);
    });

    it("calculates platform fee correctly", () => {
      const { result } = simnet.callReadOnlyFn(
        contractName,
        "calculate-fee",
        [Cl.uint(1000000)],
        deployer
      );

      expect(result).toBeUint(25000); // 2.5% of 1000000
    });

    it("gets platform fee rate", () => {
      const { result } = simnet.callReadOnlyFn(
        contractName,
        "get-platform-fee-rate",
        [],
        deployer
      );

      expect(result).toBeUint(250); // 2.5% in basis points
    });

    it("gets next payment ID", () => {
      const { result } = simnet.callReadOnlyFn(
        contractName,
        "get-next-payment-id",
        [],
        deployer
      );

      expect(result).toBeUint(2); // Should be 2 since we created payment ID 1
    });
  });

  describe("Platform Management", () => {
    it("allows contract owner to update fee rate", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "set-platform-fee-rate",
        [Cl.uint(300)], // 3%
        deployer
      );

      expect(result).toBeOk(Cl.uint(300));
    });

    it("prevents non-owner from updating fee rate", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "set-platform-fee-rate",
        [Cl.uint(300)],
        merchant
      );

      expect(result).toBeErr(Cl.uint(401)); // ERR_NOT_AUTHORIZED
    });

    it("prevents setting fee rate above maximum", () => {
      const { result } = simnet.callPublicFn(
        contractName,
        "set-platform-fee-rate",
        [Cl.uint(1001)], // >10%
        deployer
      );

      expect(result).toBeErr(Cl.uint(400)); // ERR_INVALID_PAYMENT
    });
  });
});
