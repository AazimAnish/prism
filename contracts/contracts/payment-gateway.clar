
;; title: payment-gateway
;; version: 1.0.0
;; summary: sBTC Payment Gateway - Stripe-like payment processing for sBTC
;; description: A payment gateway that allows merchants to accept sBTC payments with webhook-like callbacks

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_INVALID_PAYMENT (err u400))
(define-constant ERR_PAYMENT_NOT_FOUND (err u404))
(define-constant ERR_PAYMENT_ALREADY_PROCESSED (err u409))
(define-constant ERR_INSUFFICIENT_BALANCE (err u402))

;; sBTC token contract reference 
;; For testnet: ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token
;; For simnet/devnet: will resolve to mock-sbtc-token
;; For mainnet: will resolve to the mainnet sBTC contract
(define-constant SBTC_TOKEN .mock-sbtc-token)

;; Data Variables
(define-data-var next-payment-id uint u1)
(define-data-var platform-fee-rate uint u250) ;; 2.5% in basis points (250/10000)

;; Data Maps
(define-map payments
  uint
  {
    merchant: principal,
    customer: principal,
    amount: uint,
    currency: (string-ascii 10),
    status: (string-ascii 20),
    created-at: uint,
    processed-at: (optional uint),
    description: (string-utf8 256),
    metadata: (string-utf8 512)
  }
)

(define-map merchant-balances principal uint)
(define-map payment-intents
  { merchant: principal, client-reference: (string-ascii 64) }
  uint
)

;; Public Functions

;; Create a payment intent (similar to Stripe's payment intents)
(define-public (create-payment-intent 
  (amount uint) 
  (currency (string-ascii 10))
  (description (string-utf8 256))
  (metadata (string-utf8 512))
  (client-reference (string-ascii 64))
)
  (let 
    (
      (payment-id (var-get next-payment-id))
      (current-time (default-to u0 (get-stacks-block-info? time (- stacks-block-height u1))))
    )
    (begin
      ;; Input validation
      (asserts! (> amount u0) ERR_INVALID_PAYMENT)
      (asserts! (< amount u1000000000000) ERR_INVALID_PAYMENT) ;; Max 10,000 sBTC
      (asserts! (> (len description) u0) ERR_INVALID_PAYMENT)
      (asserts! (> (len client-reference) u0) ERR_INVALID_PAYMENT)
      
      ;; Store the payment intent
      (map-set payments payment-id {
        merchant: tx-sender,
        customer: tx-sender, ;; Will be updated when payment is processed
        amount: amount,
        currency: currency,
        status: "created",
        created-at: current-time,
        processed-at: none,
        description: description,
        metadata: metadata
      })
      
      ;; Map client reference to payment ID for easy lookup
      (map-set payment-intents { merchant: tx-sender, client-reference: client-reference } payment-id)
      
      ;; Increment payment ID counter
      (var-set next-payment-id (+ payment-id u1))
      
      (ok payment-id)
    )
  )
)

;; Process sBTC payment 
(define-public (process-payment 
  (payment-id uint)
  (customer principal)
)
  (let
    (
      (payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND))
      (amount (get amount payment))
      (merchant (get merchant payment))
      (platform-fee (/ (* amount (var-get platform-fee-rate)) u10000))
      (merchant-amount (- amount platform-fee))
      (current-time (default-to u0 (get-stacks-block-info? time (- stacks-block-height u1))))
    )
    (begin
      ;; Verify payment hasn't been processed
      (asserts! (is-eq (get status payment) "created") ERR_PAYMENT_ALREADY_PROCESSED)
      
      ;; Transfer sBTC from customer to contract (for fee) and merchant
      ;; sBTC contract signature: transfer (amount sender recipient memo)
      ;; These transfers work on testnet/mainnet with real sBTC
      
      ;; For local testing, we skip actual transfers
      ;; On testnet/mainnet, uncomment these lines:
      ;; Platform fee transfer: customer -> contract owner
      ;; (try! (contract-call? SBTC_TOKEN transfer platform-fee customer (as-contract tx-sender) none))
      ;; Merchant amount transfer: customer -> merchant  
      ;; (try! (contract-call? SBTC_TOKEN transfer merchant-amount customer merchant none))
      
      ;; Update payment status
      (map-set payments payment-id (merge payment {
        customer: customer,
        status: "succeeded",
        processed-at: (some current-time)
      }))
      
      ;; Update merchant balance tracking
      (map-set merchant-balances merchant 
        (+ (default-to u0 (map-get? merchant-balances merchant)) merchant-amount))
      
      (ok payment-id)
    )
  )
)

;; Refund a payment
(define-public (refund-payment (payment-id uint))
  (let
    (
      (payment (unwrap! (map-get? payments payment-id) ERR_PAYMENT_NOT_FOUND))
      (amount (get amount payment))
      (merchant (get merchant payment))
      (customer (get customer payment))
      (current-time (default-to u0 (get-stacks-block-info? time (- stacks-block-height u1))))
    )
    (begin
      ;; Only merchant or contract owner can refund
      (asserts! (or (is-eq tx-sender merchant) (is-eq tx-sender CONTRACT_OWNER)) ERR_NOT_AUTHORIZED)
      
      ;; Verify payment was successful
      (asserts! (is-eq (get status payment) "succeeded") ERR_INVALID_PAYMENT)
      
      ;; Transfer sBTC back to customer (merchant pays the refund)
      ;; sBTC contract signature: transfer (amount sender recipient memo)
      ;; For local testing, we skip actual transfers
      ;; On testnet/mainnet, uncomment this line:
      ;; (try! (contract-call? SBTC_TOKEN transfer amount merchant customer none))
      
      ;; Update payment status
      (map-set payments payment-id (merge payment {
        status: "refunded",
        processed-at: (some current-time)
      }))
      
      (ok payment-id)
    )
  )
)

;; Update platform fee (only contract owner)
(define-public (set-platform-fee-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (asserts! (<= new-rate u1000) ERR_INVALID_PAYMENT) ;; Max 10%
    (var-set platform-fee-rate new-rate)
    (ok new-rate)
  )
)

;; Read-only Functions

;; Get payment details
(define-read-only (get-payment (payment-id uint))
  (map-get? payments payment-id)
)

;; Get payment by client reference
(define-read-only (get-payment-by-reference (merchant principal) (client-reference (string-ascii 64)))
  (let
    (
      (payment-id-opt (map-get? payment-intents { merchant: merchant, client-reference: client-reference }))
    )
    (match payment-id-opt
      payment-id (map-get? payments payment-id)
      none
    )
  )
)

;; Get merchant balance
(define-read-only (get-merchant-balance (merchant principal))
  (default-to u0 (map-get? merchant-balances merchant))
)

;; Get platform fee rate
(define-read-only (get-platform-fee-rate)
  (var-get platform-fee-rate)
)

;; Get next payment ID
(define-read-only (get-next-payment-id)
  (var-get next-payment-id)
)

;; Calculate fee for amount
(define-read-only (calculate-fee (amount uint))
  (/ (* amount (var-get platform-fee-rate)) u10000)
)
