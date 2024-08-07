

export interface MailgunWebhookSignature{
    timestamp: string, // Epoch & Unix Timestamp : Number of seconds passed since January 1, 1970.
    token: string, // Randomly generated string with length of 50.
    signature: string //String with hexadecimal digits generated by an HMAC algorithm
}