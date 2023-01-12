import React, { useEffect, useState } from 'react';

import { useTwitch } from '../../hooks/TwitchProvider';
import { useAuth } from '../../hooks/AuthProvider';

import {
    getAvailableExtraTips,
    getReactionPriceDefault,
    getStreamerWithTwitchId,
    listenToUserReactionsCount,
    loadReactionPriceByLevel,
    sendReaction,
    substractChannelPointReaction
} from '../../services/database';
import { getStreamerEmotes } from '../../services/functions';

import { CUSTOM_TTS_VOICE, EMOTE, GIPHY_GIFS, GIPHY_STICKERS, GIPHY_TEXT, MEMES } from '../../constants';

import TweetReactionView from './TweetReactionView';
import GiphyMediaSelectorDialog from '../../components/GiphyMediaSelectorDialog';
import MemeMediaSelectorDialog from '../../components/MemeMediaSelectorDialog';
import ReactionTierSelectorDialog from '../../components/ReactionTierSelectorDialog';
import ChooseBotVoiceDialog from '../../components/ChooseBotVoiceDialog';
import Create3DTextDialog from '../../components/Create3DTextDialog';
import EmoteRainDialog from '../../components/EmoteRainDialog';
import ReactionSentDialog from '../../components/ReactionSentDialog';
import NoReactionsDialog from '../../components/NoReactionsDialog';
import EmptyReactionDialog from '../../components/EmptyReactionDialog';

const TweetReactionController = () => {
    const [message, setMessage] = useState('');
    const [openGiphyDialog, setOpenGiphyDialog] = useState(false);
    const [giphyDialogMediaType, setGiphyDialogMediaType] = useState(GIPHY_GIFS);
    const [openMemeDialog, setOpenMemeDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openReactionLevelModal, setOpenReactionLevelModal] = useState(false);
    const [reactionLevel, setReactionLevel] = useState(1);
    const [extraTip, setExtraTip] = useState(null);
    const [tipping, setTipping] = useState(false);
    const [selectedVoiceBot, setSelectedVoiceBot] = useState(null);
    const [openBotVoiceDialog, setOpenBotVoiceDialog] = useState(false);
    const [costs, setCosts] = useState([0, undefined, undefined]);
    const [streamerUid, setStreamerUid] = useState(null);
    const [custom3DText, setCustom3DText] = useState(null);
    const [open3DTextDialog, setOpen3DTextDialog] = useState(false);
    const [randomEmoteUrl, setRandomEmoteUrl] = useState(undefined);
    const [emotes, setEmotes] = useState([]);
    const [openEmoteRainDialog, setOpenEmoteRainDialog] = useState(false);
    const [selectedEmote, setSelectedEmote] = useState(null);
    const [numberOfReactions, setNumberOfReactions] = useState(0);
    const [availableTips, setAvailableTips] = useState([]);
    const [sending, setSending] = useState(false);
    const [streamerName, setStreamerName] = useState('');
    const [openSentDialog, setOpenSentDialog] = useState(false);
    const [openNoReactionsDialog, setOpenNoReactionsDialog] = useState(false);
    const [openEmptyReactionDialog, setOpenEmptyReactionDialog] = useState(false);
    const twitch = useTwitch();
    const user = useAuth();

    let reactionPaid = false; // Flag for purchases with Twitch, it does not work using useState but it works this way

    useEffect(() => {
        async function loadTips() {
            const extraTips = await getAvailableExtraTips();

            if (extraTips.exists()) {
                setAvailableTips(extraTips.val());
            }
        }

        loadTips();
    }, []);

    useEffect(() => {
        async function getStreamerUid(streamerId) {
            const streamer = await getStreamerWithTwitchId(streamerId);
            let uid = '';
            let streamerName = '';
            streamer.forEach((streamer) => {
                uid = streamer.key;
                streamerName = streamer.val().displayName
            });
            setStreamerUid(uid);
            setStreamerName(streamerName);
        }

        async function loadPrices() {
            const costs = [0];

            for (let i = 2; i <= 3; i++) {
                const costSnapshot = await loadReactionPriceByLevel(streamerUid, `level${i}`);
                let cost = null;
                if (costSnapshot.exists()) {
                    cost = costSnapshot.val();
                } else {
                    const defaultCost = await getReactionPriceDefault(`level${i}`);
                    cost = defaultCost.val();
                }

                costs.push(cost);
            }

            setCosts(costs);
        }

        async function loadStreamerEmotes() {
            const emotesRequest = await getStreamerEmotes(streamerUid);

            if (emotesRequest && emotesRequest.data) {
                let emotes = emotesRequest.data ? emotesRequest.data : null;
                if (emotes) {

                    /**
                     * Twitch don't allow us to use their global emotes in our extension
                     * See 4.3 on the next url for more information
                     * https://dev.twitch.tv/docs/extensions/guidelines-and-policies#4-content-policy
                     */
                    emotes = emotes.filter((emoteList) => (emoteList.key !== 'global'));

                    setEmotes(emotes);

                    // Find the first array who has more than 0 elements
                    const array = emotes.find((typeOfEmote) => typeOfEmote.data[0].length > 0);
                    if (array) {
                        const randomNumber = Math.floor(Math.random() * array.data[0].length);

                        return setRandomEmoteUrl(array.data[0][randomNumber].images.url_1x);
                    }
                }
            }

            /**
             * If for some reason we reach here, that means we could not find an emote, so we set the
             * randomEmoteUrl as null
             */
            setRandomEmoteUrl(null);
        }

        if (!streamerUid) {
            if (user && user.twitchExtensionData && user.twitchExtensionData.channelId) {
                getStreamerUid(user.twitchExtensionData.channelId);
            }
        } else {
            loadPrices();
            loadStreamerEmotes();
            listenToUserReactionsCount(user.uid, streamerUid, (count) => {
                setNumberOfReactions(count.exists() ? count.val() : 0);
            });
        }
    }, [user, streamerUid]);

    const toggleTipping = () => {
        setTipping(!tipping);
    }

    const setTip = (tipObject) => {
        setExtraTip(tipObject);
        setTipping(false);
    }

    const onMediaOptionClick = (mediaType) => {
        switch (mediaType) {
            case GIPHY_GIFS:
            case GIPHY_STICKERS:
                setGiphyDialogMediaType(mediaType);
                setOpenGiphyDialog(true);
                break;
            case MEMES:
                setOpenMemeDialog(true);
                break;
            case CUSTOM_TTS_VOICE:
                setOpenBotVoiceDialog(true);
                break;
            case GIPHY_TEXT:
                setOpen3DTextDialog(true);
                break;
            case EMOTE:
                setOpenEmoteRainDialog(true);
                break;
            default:
                break;
        }
    }

    const onMediaSelected = (media) => {
        setSelectedMedia(media);
        setOpenGiphyDialog(false);
        setOpenMemeDialog(false);
    }

    const on3DTextSelected = (message, custom3DText) => {
        setMessage(message);
        setCustom3DText(custom3DText);
        setOpen3DTextDialog(false);
    }

    const onVoiceSelected = (selectedVoiceBot) => {
        if (selectedVoiceBot) {
            setSelectedVoiceBot({
                ...selectedVoiceBot,
                title: selectedVoiceBot.key,
                type: CUSTOM_TTS_VOICE,
                onRemove: () => setSelectedVoiceBot(null),
                timestamp: new Date().getTime()
            });
        } else {
            setSelectedVoiceBot(null);
        }
    }

    const onEmoteSelected = (emote) => {
        setSelectedEmote({
            url: emote,
            title: 'Emote Raid',
            type: EMOTE,
            onRemove: () => setSelectedEmote(null),
            timestamp: new Date().getTime()
        });
        setOpenEmoteRainDialog(false);
    }

    const onUpgradeReaction = (reactionLevel, mediaUnlocked) => {
        onMediaOptionClick(mediaUnlocked);
        setReactionLevel(reactionLevel);

        // Remove options not available in the selected tier
        switch (reactionLevel) {
            case 1:
                setSelectedVoiceBot(null);
                setCustom3DText(null);
                setSelectedEmote(null);
                break;
            case 2:
                setSelectedEmote(null);
                break;
            default:
                break;
        }
    }

    const writeReaction = async (bits, channelPointsReaction = false) => {
        let messageExtraData = selectedVoiceBot ?
            {
                voiceAPIName: selectedVoiceBot.voiceAPIName,
                voiceName: selectedVoiceBot.key
            }
            :
            {};

        messageExtraData.giphyText = custom3DText ?
            custom3DText
            :
            {};

        const emoteArray = [];

        if (selectedEmote) {
            emoteArray.push(selectedEmote.url);
        }

        await sendReaction(
            bits,
            user.uid,
            user.userName,
            user.twitchUsername,
            user.photoUrl,
            streamerUid,
            streamerName,
            selectedMedia ?
                {
                    ...selectedMedia
                }
                :
                {},
            message,
            messageExtraData,
            {
                type: EMOTE,
                emojis: emoteArray
            },
            (new Date()).getTime(),
            user.avatarId,
            user.avatarBackground,
            channelPointsReaction
        );

        if (channelPointsReaction) {
            await substractChannelPointReaction(user.uid, streamerUid);
        }

        setOpenSentDialog(true);
    }

    const onSendReaction = () => {
        const sendButtonDisabled = (!message && !selectedMedia);
        if (sendButtonDisabled) {
            return setOpenEmptyReactionDialog(true);
        }

        if (!sending) {
            setSending(true);
            if (reactionLevel !== 1) {
                twitch.bits.onTransactionComplete((transactionObject) => {
                    if (transactionObject.initiator === 'current_user') {
                        // Transaction comes from reaction payment
                        if (!reactionPaid) {
                            reactionPaid = true

                            if (extraTip) {
                                // Reaction paid, charge extra tip now
                                twitch.bits.useBits(extraTip.twitchSku);
                            } else {
                                // Reaction paid and no extra tip, write reaction
                                writeReaction(costs[reactionLevel - 1].price);
                            }
                        } else {
                            // Reaction and extra tip are paid, write reaction
                            writeReaction(costs[reactionLevel - 1].price + extraTip.cost);
                        }
                    }
                });

                twitch.bits.onTransactionCancelled(() => {
                    // If the user already paid the reaction, but he cancel the extra tip
                    if (reactionPaid) {
                        // Send the reaction only with the Bits he actually paid
                        writeReaction(costs[reactionLevel - 1].price);
                    }

                    // In any case, unlock the sending button
                    setSending(false);
                });

                // Listeners are set, start the purchase attempt
                twitch.bits.useBits(costs[reactionLevel - 1].twitchSku);
            } else {
                // Check if user has enough reactions
                if (numberOfReactions >= 1) {
                    if (extraTip) {
                        // Channel point reaction but with extra tip
                        twitch.bits.onTransactionComplete((transactionObject) => {
                            if (transactionObject.initiator === 'current_user') {
                                // Extra tip paid, write reaction
                                writeReaction(extraTip.cost, true);
                            }
                        });

                        twitch.bits.onTransactionCancelled(() => {
                            // If the user cancels the purchase unlock the sending button and show tip menu
                            setSending(false);
                            toggleTipping();
                        });

                        // Listeners are set, start the purchase attempt
                        twitch.bits.useBits(extraTip.twitchSku);
                    } else {
                        // Channel point reaction, don't charge products and write reaction
                        writeReaction(0, true);
                    }
                } else {
                    setOpenNoReactionsDialog(true);
                    setSending(false);
                }
            }
        }
    }

    const resetReaction = () => {
        // Reset all variables
        setMessage('');
        setSelectedMedia(null);
        setExtraTip(null);
        setSelectedVoiceBot(null);
        setCustom3DText(null);
        setSelectedEmote(null);
        setSending(false);
        reactionPaid = false;

        // Close modal
        setOpenSentDialog(false);
    }

    let availableContent = [];
    switch (reactionLevel) {
        case 1:
            availableContent = [
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES
            ];
            break;
        case 2:
            availableContent = [
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
            ];
            break;
        case 3:
            availableContent = [
                EMOTE,
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
            ];
            break;
        default:
            availableContent = [
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
            ];
            break;
    }

    return (
        <>
            <TweetReactionView onSend={onSendReaction}
                sending={sending}
                numberOfReactions={numberOfReactions}
                message={message}
                setMessage={setMessage}
                currentReactionCost={costs[reactionLevel - 1]}
                costsPerReactionLevel={costs}
                onMediaOptionClick={onMediaOptionClick}
                selectedMedia={selectedMedia}
                cleanSelectedMedia={() => setSelectedMedia(null)}
                mediaSelectorBarOptions={availableContent}
                reactionLevel={reactionLevel}
                tipping={tipping}
                toggleTipping={toggleTipping}
                extraTip={extraTip}
                setExtraTip={setTip}
                onChangeReactionLevel={() => setOpenReactionLevelModal(true)}
                voiceBot={selectedVoiceBot}
                custom3DText={custom3DText}
                onRemoveCustom3DText={() => setCustom3DText(null)}
                randomEmoteUrl={randomEmoteUrl}
                userImage={user && user.photoUrl ? user.photoUrl : null}
                emoteRaid={selectedEmote}
                onUpgradeReaction={onUpgradeReaction}
                availableTips={availableTips} />
            <GiphyMediaSelectorDialog open={openGiphyDialog}
                onClose={() => setOpenGiphyDialog(false)}
                mediaType={giphyDialogMediaType}
                onMediaSelected={onMediaSelected} />
            <MemeMediaSelectorDialog open={openMemeDialog}
                onClose={() => setOpenMemeDialog(false)}
                onMediaSelected={onMediaSelected} />
            <ReactionTierSelectorDialog open={openReactionLevelModal}
                onClose={() => setOpenReactionLevelModal(false)}
                costs={costs}
                changeReactionLevel={(level) =>onUpgradeReaction(level, null)} />
            <ChooseBotVoiceDialog open={openBotVoiceDialog}
                onClose={() => setOpenBotVoiceDialog(false)}
                currentVoice={selectedVoiceBot ? selectedVoiceBot.key : null}
                onVoiceSelected={onVoiceSelected} />
            <Create3DTextDialog open={open3DTextDialog}
                onClose={() => setOpen3DTextDialog(false)}
                defaultMessage={message}
                on3DTextSelected={on3DTextSelected} />
            <EmoteRainDialog open={openEmoteRainDialog}
                onClose={() => setOpenEmoteRainDialog(false)}
                emotes={emotes}
                onEmoteSelected={onEmoteSelected} />
            <ReactionSentDialog open={openSentDialog}
                onClose={resetReaction} />
            <NoReactionsDialog open={openNoReactionsDialog}
                onClose={() => setOpenNoReactionsDialog(false)}
                price={costs[1] ? costs[1].price : 0}
                onUpgradeReaction={() => { onUpgradeReaction(2, null); setOpenNoReactionsDialog(false); }} />
            <EmptyReactionDialog open={openEmptyReactionDialog}
                onClose={() => setOpenEmptyReactionDialog(false)} />
        </>
    );
}

export default TweetReactionController;
