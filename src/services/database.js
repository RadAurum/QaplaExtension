import {
    child,
    // eslint-disable-next-line
    DataSnapshot,
    equalTo,
    get,
    orderByChild,
    push,
    query,
    update,
    onValue,
    set,
    increment,
    off
} from 'firebase/database';
import { database } from './firebase';

import { getCurrentLanguage } from '../i18n';
import { BITS } from '../constants';

/**
 * Gets a reference for the specified locatoin on database
 * @param {string} databaseChild Child for reference
 * @returns The specified child location.
 */
function createChild(databaseChild) {
    return child(database, databaseChild);
}

//////////////////////
// Qapla Users
//////////////////////

/**
 * Returns the found uid´s linked to the given Twitch Id (it returns an object of objects but we know that
 * the relationship between uid and Twitch Id is 1:1)
 * @param {string} twitchId Twitch identifier
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
 export async function getUserProfileWithTwitchId(twitchId) {
    const usersChild = createChild('/Users');

    return await get(query(usersChild, orderByChild('twitchId'), equalTo(twitchId)));
}

/**
 * Creates the basic Qapla profile for the given user
 * @param {string} uid User identifier
 * @param {string} email Email
 * @param {string} userName Qapla username
 * @param {string} photoUrl Qapla photo url
 * @param {string} twitchId Twitch identifier
 * @param {string} twitchUsername Twitch username
 */
 export async function createUserProfile(uid, email, userName, photoUrl, twitchId, twitchUsername) {
    let city = userName.toUpperCase();

    const profileObj = {
        bio: '',
        city,
        credits: 0,
        email,
        id: uid,
        level: 0,
        status: false,
        token: '',
        userName,
        isUserLoggedOut: false,
        photoUrl,
        twitchId,
        twitchUsername,
        language: getCurrentLanguage()
    };

    const userChild = createChild(`/Users/${uid}`);

    await update(userChild, profileObj);
}

/**
 * Update the given fields on the user profile
 * @param {string} uid User identifier
 * @param {object} dateToUpdate Data to update
 * @param {object} dateToUpdate.email Email
 * @param {object} dateToUpdate.userName Qapla username
 * @param {object} dateToUpdate.photoUrl Qapla photo url
 * @param {object} dateToUpdate.twitchUsername Twitch username
 */
 export async function updateUserProfile(uid, dateToUpdate) {
    const userChild = createChild(`/Users/${uid}`);

    await update(userChild, dateToUpdate);
}

/**
 * Listen the profile of the given user
 * @param {string} uid User identifier
 * @param {function} callback Handler for database values
 */
export async function listenToUserProfile(uid, callback) {
    const userProfile = createChild(`/Users/${uid}`);

    return onValue(query(userProfile), callback);
}

/**
 * Removes any "on" listener attached to the profile of the given user
 * @param {string} uid User identifier
 */
export async function unlistenUserProfile(uid) {
    const userProfile = createChild(`/Users/${uid}`);

    return off(userProfile);
}

//////////////////////
// User Streamer
//////////////////////

/**
 * Returns the found streamers linked to the given Twitch Id (it returns an object of objects but we know that
 * the relationship between uid and Twitch Id is 1:1)
 * @param {string} streamerId Streamer Twitch Id
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getStreamerWithTwitchId(streamerId) {
    const userStreamer = createChild(`/UserStreamer`);

    return await get(query(userStreamer, orderByChild('id'), equalTo(streamerId)));
}

//////////////////////
// Qapla Memes
//////////////////////

/**
 * Returns the Qapla library of memes
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
 export async function getQaplaMemesLibrary() {
    const memesLibrary = createChild('/QaplaInteractions/Memes');

    return await get(query(memesLibrary));
}

//////////////////////
// Gifs Libraries
//////////////////////

/**
 * Returns a random gif from the given library
 * @param {string} libraryName Name of the library
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getRandomGifByLibrary(libraryName) {
    const libraryLength = createChild(`/GifsLibraries/${libraryName}/length`);
    const length = await get(query(libraryLength));

    const index = Math.floor(Math.random() * length.val());
    const gif = createChild(`/GifsLibraries/${libraryName}/gifs/${index}`);

    return await get(query(gif));
}

//////////////////////
// Reactions Prices Bits
//////////////////////

/**
 * Listen for the price of the given reaction level and their Sku on the Twitch catalog (if it applies) (this price
 * is the one the streamer selected in their configuration)
 * @param {string} streamerUid Streamer identifier
 * @param {string} reactionLevel Reaction level name (e.g: level1)
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export function listenForStreamerReactionPrice(streamerUid, reactionLevel, callback) {
    const channelPrices = createChild(`/ReactionsPricesLevels/${streamerUid}/${reactionLevel}`);

    return onValue(query(channelPrices), callback);
}

//////////////////////
// Reactions Prices Default
//////////////////////

/**
 * Gets the price of the given reaction level and their Sku on the Twitch catalog (if it applies) this price will be
 * the default, used in cases where the streamer has not selected another price
 * @param {string} reactionLevel Reaction level name (e.g: level1)
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getReactionPriceDefault(reactionLevel) {
    const defaultPrice = createChild(`/ReactionsPricesLevelsDefaults/${reactionLevel}`);

    return await get(query(defaultPrice));
}


//////////////////////
// Reactions Prices Levels Subs
//////////////////////

/**
 * Listen for the price of the given reaction level for subs
 * @param {string} streamerUid Streamer identifier
 * @param {string} reactionLevel Name of reaction level
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export function listenForStreamerReactionPriceForSubs(streamerUid, reactionLevel, callback) {
    const channelPrices = createChild(`/ReactionsPricesLevelsSubs/${streamerUid}/${reactionLevel}`);

    return onValue(query(channelPrices), callback);
}

//////////////////////
// Reactions Prices Levels Subs Defaults
//////////////////////

/**
 * Gets the default price of the given reaction level for subs
 * @param {string} reactionLevel Name of reaction level
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getReactionPriceDefaultForSubs(reactionLevel) {
    const reactionPriceLevelForSubDefault = createChild(`/ReactionsPricesLevelsSubsDefaults/${reactionLevel}`);

    return await get(query(reactionPriceLevelForSubDefault));
}

//////////////////////
// Voice Bot Available Voices
//////////////////////

/**
 * Load all the available voices for the voice bot
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getAvailableBotVoices() {
    const availableVoices = createChild('/VoiceBotAvailableVoices');

    return await get(query(availableVoices));
}

//////////////////////
// Users Reactions Count
//////////////////////

/**
 * Listen and execute a callback every time the reaction count node is updated
 * @param {string} uid User identifier
 * @param {string} streamerUid Steamer identifier
 * @param {function} callback Handler for database values
 */
export function listenToUserReactionsCount(uid, streamerUid, callback) {
    const userReactionsCount = createChild(`/UsersReactionsCount/${uid}/${streamerUid}`);

    return onValue(query(userReactionsCount), callback);
}

/**
 * Substracts one channel point reaction
 * @param {string} uid User identifier
 * @param {string} streamerUid Streamer identifier
 */
export async function substractZaps(uid, streamerUid, zapsCost) {
    const userReactionsCount = createChild(`/UsersReactionsCount/${uid}`);

    await update(userReactionsCount, {
        // Increment a negative amount in order to decrease the number of reactions
        [streamerUid]: increment(-1 * zapsCost)
    });
}

//////////////////////
// Twitch Extension Products
//////////////////////

/**
 * Load all the available extra tips
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export function getAvailableExtraTips() {
    const availableExtraTips = createChild('/TwitchExtensionProducts/ExtraTips');

    return get(query(availableExtraTips),);
}

//////////////////////
// Streamers Donations
//////////////////////

/**
 * Store reactions on the database
 * @param {number} bits Cost of the reaction (+ extra tip) in Bits
 * @param {string} uid User identifier
 * @param {string} userName Qapla Username
 * @param {string} twitchUserName Twitch username
 * @param {string} userPhotoURL User photo URL
 * @param {string} streamerUid Streamer identifier
 * @param {string} streamerName Streamer display name
 * @param {object | null} media Media objects
 * @param {string} media.type Type of media ("GIF", "EMOTE" or "MEME", etc.)
 * @param {string} media.url Url of the media
 * @param {string} media.width Width of the media
 * @param {string} media.height Height of the media
 * @param {string} message Message for TTS
 * @param {object | undefined} messageExtraData Extra data for message (voice bot, giphy text)
 * @param {string | undefined} messageExtraData.voiceAPIName Text to speech API voice for the voice bot
 * @param {object | undefined} messageExtraData.giphyText Giphy text object
 * @param {object} emoteRaid Emote raid data
 * @param {("emote")} emoteRaid.type Type of rain (emote is the only valid value right now)
 * @param {Array<string>} emoteRaid.emojis Array of strings with emotes (as urls)
 * @param {number} timestamp Timestamp in milliseconds where the reaction was sent
 * @param {string | undefined} avatarId Avatar identifier
 * @param {object | undefined} avatarBackground Avatar background data
 * @param {number} avatarBackground.angle Avatar gradient angle
 * @param {Array<string>} avatarBackground.colors Array of colors for gradient background
 * @param {string | undefined} avatarAnimationId Avatar animation identifier
 * @param {string} vibe Selected vibe for the reaction
 * @param {boolean} pointsChannelInteractions True if reaction was sent with channel points
 */
export async function sendReaction(bits, uid, userName, twitchUserName, userPhotoURL, streamerUid, streamerName, media, message, messageExtraData, emoteRaid, timestamp, avatarId, avatarBackground, avatarAnimationId, vibe, pointsChannelInteractions) {
    const streamerDonations = createChild(`/StreamersDonations/${streamerUid}`);

    const reactionReference = await push(streamerDonations, {
        avatar: {
            avatarId: avatarId ? avatarId : null,
            avatarBackground: avatarBackground ? avatarBackground : null,
            avatarAnimationId: avatarAnimationId ? avatarAnimationId : null
        },
        /**
         * amountQoins and donationType are filled even if the reaction is sent free with reaction points, our
         * overlay handle it, amountQoins must be 0 if no Bits are present in the reaction
         */
        amountQoins: bits, // Named like this for historical reasons in our database structure
        donationType: BITS, // Flag to identify the reaction was sent with Bits
        media,
        message,
        messageExtraData,
        emojiRain: emoteRaid, // Named like this for historical reasons in our database structure
        timestamp,
        uid,
        twitchUserName,
        userName,
        photoURL: userPhotoURL,
        vibe,
        pointsChannelInteractions, // Flag to identify if the reaction was sent with Channel Points or Bits
        read: false
    });

    const streamerDonationsAdministrative = createChild(`/StreamersDonationAdministrative/${reactionReference.key}`);

    await set(streamerDonationsAdministrative, {
        amountQoins: bits,
        message,
        timestamp,
        uid,
        sent: false,
        twitchUserName,
        userName,
        streamerName,
        pointsChannelInteractions,
        donationType: BITS
    });
}

//////////////////////
// Avatars Animations Overlay
//////////////////////

/**
 * Get the full list of avatars animations
 * @returns {Promise<DataSnapshot>} Resulting DataSnaphsot of the query
 */
export async function getAnimationsData() {
    const animations = child(database, `/AvatarsAnimationsOverlay`);

    return get(query(animations));
}

//////////////////////
// Streamer Alerts Settings
//////////////////////

/**
 * Gets the reactionsEnabled flag from the given streamer
 * @param {string} streamerUid Streamer identifier
 * @returns {Promise<DataSnapshot>} Resulting DataSnaphsot of the query
 */
export async function getAreReactionsEnabledFlag(streamerUid) {
    const reactionsEnabled = child(database, `/StreamerAlertsSettings/${streamerUid}/reactionsEnabled`);

    return get(query(reactionsEnabled));
}