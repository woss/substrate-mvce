#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::codec::{Decode, Encode};
use frame_support::debug::native;
use frame_support::{decl_error, decl_event, decl_module, decl_storage, ensure, StorageMap};
use sp_runtime::{traits::Hash, RuntimeDebug};
use sp_std::{clone::Clone, default::Default, vec, vec::Vec};
use system::ensure_signed;

/// The pallet's configuration trait.
pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This pallet's storage items.
decl_storage! {
  // It is important to update your storage name so that your pallet's
  // storage items are isolated from other pallets.

  trait Store for Module<T: Trait> as PoEModule
  {

    Rules get(rule):  map hasher(blake2_128_concat) T::Hash => (Vec<u8>, Vec<u8>, T::AccountId, T::BlockNumber);
    RulesNew:  map hasher(blake2_128_concat) T::Hash => (Vec<u8>, Rule, T::AccountId, T::BlockNumber);
  }
}

/// List of equipment that needs rules generated
#[derive(Encode, Decode, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(Debug))]
enum ForWhat {
    /// general hash of a payload
    Generic = 0,
    /// Any photo
    Photo = 1,
    /// Any camera, not a smartphone
    Camera = 2,
    /// Any Lens
    Lens = 3,
    /// Any Smartphone
    SmartPhone = 4,
}

impl Default for ForWhat {
    fn default() -> Self {
        ForWhat::Photo
    }
}

/// Operations that will be performed
#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
struct Operation {
    op: Vec<u8>,
    desc: Vec<u8>,
    hash_algo: Vec<u8>,
    hash_bits: u32,
    encode_algo: Vec<u8>,
    prefix: Vec<u8>,
    ops: Vec<Operation>, // you can  use the ops to build more complex operations
}

impl Default for Operation {
    fn default() -> Self {
        Operation {
            op: b"".to_vec(),
            desc: b"".to_vec(),
            hash_algo: b"blake2b".to_vec(),
            hash_bits: 256,
            encode_algo: b"hex".to_vec(),
            prefix: b"0x".to_vec(),
            ops: vec![],
        }
    }
}

/// Rule which must be applied to the PoE
#[derive(Encode, Decode, Clone, PartialEq, RuntimeDebug)]
// #[cfg_attr(feature = "std", derive(Debug))]
pub struct Rule {
    description: Vec<u8>,
    for_what: ForWhat,
    version: u32,
    creator: Vec<u8>,
    build_params: Operation,
    ops: Vec<Operation>,
    parent: Vec<u8>,
    // optional_number: Option<u32>,
}

impl Default for Rule {
    fn default() -> Self {
        Rule {
            version: 0,
            description: b"".to_vec(),
            creator: b"".to_vec(),
            for_what: ForWhat::default(),
            parent: b"".to_vec(),
            ops: vec![],
            build_params: Operation {
                desc: b"Special func".to_vec(),
                op: b"create_payload".to_vec(),
                hash_algo: b"blake2b".to_vec(),
                hash_bits: 256,
                encode_algo: b"hex".to_vec(),
                prefix: b"0x".to_vec(),
                ops: vec![],
            },
        }
    }
}

/// Default values for this runtime
#[derive(Encode, Decode, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
struct DefaultValues {
    hash_algo: Vec<u8>,
    hash_bits: u32,
    encoding_algo: Vec<u8>,
    encoding_prefix: Vec<u8>,
}

// The pallet's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {

        /// Default values for the poe, like encoding scheme and hashing functions
        const defaults: DefaultValues = DefaultValues{
          hash_algo : b"blake2b".to_vec(),
          hash_bits : 256,
          encoding_algo : b"hex".to_vec(),
          encoding_prefix : b"0x".to_vec(),
        };

        // Initializing errors
        // this includes information about your errors in the node's metadata.
        // it is needed only if you are using errors in your pallet
        type Error = Error<T>;

        // Initializing events
        // this is needed only if you are using events in your pallet
        fn deposit_event() = default;

        /// create rule with decoding
        fn create_rule ( origin, rule_id: Vec<u8>, payload: Vec<u8>) {
            let sender = ensure_signed(origin)?;
            let rule_id_hash = rule_id.using_encoded(<T as system::Trait>::Hashing::hash);

            // DEBUG
            // native::info!("My rule_id: {:?} {:?}", &rule_id_hash, parse_json(&mut &payload[..]));

            ensure!(!Rules::<T>::contains_key(&rule_id_hash), Error::<T>::RuleAlreadyCreated);

            // Call the `system` pallet to get the current block number
            let current_block = <system::Module<T>>::block_number();
            // SAVE
            Rules::<T>::insert(&rule_id_hash, (rule_id.clone(), payload, sender.clone(), current_block));

            // deposit the event
            Self::deposit_event(RawEvent::RuleCreated(sender, rule_id));
        }

        fn create_rule_new ( origin, rule_id: Vec<u8>, payload: Rule) {
            let sender = ensure_signed(origin)?;

          // can we work together, please rust??
          let rule_id_hash = rule_id.using_encoded(<T as system::Trait>::Hashing::hash);

          // DEBUG
          // native::info!("My rule_id: {:?} {:?}", &rule_id_hash, parse_json(&mut &payload[..]));

          ensure!(!Rules::<T>::contains_key(&rule_id_hash), Error::<T>::RuleAlreadyCreated);

          // Call the `system` pallet to get the current block number
          let current_block = <system::Module<T>>::block_number();
          // SAVE
          RulesNew::<T>::insert(&rule_id_hash, (rule_id.clone(), payload, sender.clone(), current_block));

          // deposit the event
          Self::deposit_event(RawEvent::RuleCreated(sender, rule_id));

        }

    }
}

// The pallet's errors
decl_error! {
    pub enum Error for Module<T: Trait> {
        /// Rule already exists
        RuleAlreadyCreated,
        /// Rule doesn't exits, create one.
        NoSuchRule
    }
}

// The pallet's events
decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        /// Event emitted when a rule is created.
        RuleCreated(AccountId, Vec<u8>),
    }
);

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;
