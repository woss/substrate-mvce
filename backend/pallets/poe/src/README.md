## Custom type definition

Polkadot Js app

```json
{
  "ForWhat": {
    "_enum": ["Generic", "Photo", "Camera", "Lens", "SmartPhone"]
  },

  "Operation": {
    "op": "Vec<u8>",
    "desc": "Vec<u8>",
    "hash_algo": "Vec<u8>",
    "encode_algo": "Vec<u8>",
    "prefix": "Vec<u8>",
    "ops": "Vec<Operation>"
  },
  "Rule": {
    "description": "Vec<u8>",
    "created_at": "Vec<u8>",
    "creator": "Vec<u8>",
    "version": "Vec<u8>",
    "for_what": "Vec<u8>",
    "ops": "Vec<Operation>",
    "lastOp": "Operation",
    "parent": "Vec<u8>"
  }
}
```

other JS app that is not polkadotjs

```json
[
  {
    "ForWhat": {
      "_enum": ["Photo", "Camera", "Lens", "SmartPhone"]
    }
  },
  {
    "Operation": {
      "op": "Vec<u8>",
      "desc": "Vec<u8>",
      "hash_algo": "Vec<u8>",
      "encode_algo": "Vec<u8>",
      "prefix": "Vec<u8>",
      "ops": "Vec<Operation>"
    }
  },
  {
    "FormatPayload": {
      "op": "create_payload",
      "desc": "special op",
      "hash_algo": "blake2-256",
      "encode_algo": "hex",
      "prefix": "0x",
      "ops": "Vec<Operation>"
    }
  },
  {
    "Rule": {
      "description": "Vec<u8>",
      "created_at": "Vec<u8>",
      "creator": "Vec<u8>",
      "version": "u32",
      "for_what": "ForWhat",
      "ops": "Vec<Operation>",
      "format": "FormatPayload",
      "parent": "Vec<u8>"
    }
  }
]
```

# NOTES

the decoding works but it fails to parse the thing because the structure is in
json form and i'm trying to decode the `Rule` struct. find a way, see how others are doing

write the small script in `wiki` `code` part that automatically saves the poe.
