# Sue

 Simple Unbreakable Encryption

 Live version of Sue can be found on: https://sue.hyperplanesolutions.com/
 
 <h2>What is SUE? </h2>
 <p>
  Imagine the following: It is the year 2035. Quantum computer technology has rendered all forms of encryption obsolete - AES is dead, rip RSA. Our AI overlords rule with an iron grip because nobody can hide their stuff and sentient Teslas drive around ominously looking at everybody's browsing history. How can we rise up - I hear you say. How can opposition organise if we cannot communicate securely? How can humanity survive !?
</p>
 
 
 <h3>Presenting Sue</h3>
 
 <p>
 Sue encrypts your data (UTF-8 text or any file) using a 1 - 1 block of random data (the key).
 This means that for every byte of information you wish to encrypt you need to have a byte of the key to encrypt it with. This is achieved by simply adding up the bits of the data and the bits of the key to make an encrypted product. Decryption is a simple reversal of this process.
</p>

 <h3>What makes it so cool?</h3>
  <p>
  This encryption is mathematically impossible to break. Because of the way it works, there is no success condition for decrypting the data ie. with an appropriate key, the encrypted product could decrypt to literally anything. This makes it impossible to break. 
 </p>
 
  <h3>The price of unbreakability?</h3>
  
 <ol>
  <li>Unlike asymetric encryption, Sue requires the key to be delivered privately and does not have any capability to deliver it securely itself</li>
  <li>The key is massive ie. to decrypt a 10Gb file it is neccessary to have a >10Gb key</li>
  <li>It is neccessary to track the starting index of the key to decrypt multiple payloads encrypted using the same key</li>
</ol>
 
