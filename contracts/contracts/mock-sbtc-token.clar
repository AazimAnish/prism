;; title: mock-sbtc-token
;; version: 1.0.0
;; summary: Mock sBTC Token - SIP-010 compliant token for testing
;; description: A mock implementation of sBTC token following SIP-010 standard for local development and testing

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

;; SIP-010 Data
(define-fungible-token sbtc)
(define-data-var token-name (string-ascii 32) "sBTC")
(define-data-var token-symbol (string-ascii 10) "sBTC")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u8)

;; SIP-010 Standard Functions

;; Get the name of the token
(define-read-only (get-name)
  (ok (var-get token-name))
)

;; Get the symbol of the token
(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

;; Get the number of decimals
(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance sbtc who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply sbtc))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; Check if sender is tx-sender or has been authorized
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    ;; Check for valid amount
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    ;; Check sufficient balance
    (asserts! (>= (ft-get-balance sbtc sender) amount) ERR_INSUFFICIENT_BALANCE)
    
    ;; Execute the transfer
    (try! (ft-transfer? sbtc amount sender recipient))
    
    ;; Print transfer event for easier debugging
    (print { 
      type: "transfer", 
      amount: amount, 
      sender: sender, 
      recipient: recipient, 
      memo: memo 
    })
    
    (ok true)
  )
)

;; Mint tokens (only contract owner for testing)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    
    (try! (ft-mint? sbtc amount recipient))
    
    (print { 
      type: "mint", 
      amount: amount, 
      recipient: recipient 
    })
    
    (ok true)
  )
)

;; Burn tokens
(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (>= (ft-get-balance sbtc sender) amount) ERR_INSUFFICIENT_BALANCE)
    
    (try! (ft-burn? sbtc amount sender))
    
    (print { 
      type: "burn", 
      amount: amount, 
      sender: sender 
    })
    
    (ok true)
  )
)

;; Initialize balances for testing wallets
(define-private (initialize-balance (wallet principal) (amount uint))
  (begin
    (try! (ft-mint? sbtc amount wallet))
    (print { 
      type: "initialize", 
      wallet: wallet, 
      amount: amount 
    })
    (ok true)
  )
)

;; Initialize test wallets with sBTC for development
;; This matches common Clarinet test wallet addresses
(begin
  ;; Wallet 1: 10 sBTC (1,000,000,000 satoshis)
  (unwrap-panic (initialize-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM u1000000000))
  ;; Wallet 2: 10 sBTC
  (unwrap-panic (initialize-balance 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 u1000000000))
  ;; Wallet 3: 10 sBTC
  (unwrap-panic (initialize-balance 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG u1000000000))
  ;; User provided test wallet: 10 sBTC
  (unwrap-panic (initialize-balance 'ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR u1000000000))
  ;; Contract owner: 100 sBTC for platform operations
  (unwrap-panic (initialize-balance CONTRACT_OWNER u10000000000))
)