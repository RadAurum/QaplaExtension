import React, { useState } from 'react';

import TweetReactionView from './TweetReactionView';
import { CUSTOM_TTS_VOICE, EMOTE, GIPHY_GIFS, GIPHY_STICKERS, GIPHY_TEXT, MEMES } from '../../constants';
import GiphyMediaSelectorDialog from '../../components/GiphyMediaSelectorDialog';
import MemeMediaSelectorDialog from '../../components/MemeMediaSelectorDialog';
import ReactionTierSelectorDialog from '../../components/ReactionTierSelectorDialog';
import ChooseBotVoiceDialog from '../../components/ChooseBotVoiceDialog';

const TweetReactionController = () => {
    const [openGiphyDialog, setOpenGiphyDialog] = useState(false);
    const [giphyDialogMediaType, setGiphyDialogMediaType] = useState(GIPHY_GIFS);
    const [openMemeDialog, setOpenMemeDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openReactionLevelModal, setOpenReactionLevelModal] = useState(false);
    const [reactionLevel, setReactionLevel] = useState(1);
    const [selectedTip, setSelectedTip] = useState(null);
    const [tipping, setTipping] = useState(false);
    const [selectedVoiceBot, setSelectedVoiceBot] = useState(null);
    const [openBotVoiceDialog, setOpenBotVoiceDialog] = useState(false);

    const tippingHandler = () => {
        setTipping(!tipping);
    }

    const tipHandler = (num) => {
        setSelectedTip(num);
        setTimeout(() => {
            setTipping(false);
        }, 350)
    }

    const onMediaOptionClick = (mediaType) => {
        console.log(mediaType);
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
            default:
                break;
        }
    }

    const onMediaSelected = (media) => {
        setSelectedMedia(media);
        setOpenGiphyDialog(false);
        setOpenMemeDialog(false);
    }

    const onVoiceSelected = (voice) => {
        setSelectedVoiceBot(voice);
    }

    let availableContent = [];
    let lockedContent = [];
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
            <TweetReactionView
                onMediaOptionClick={onMediaOptionClick}
                selectedMedia={selectedMedia}
                cleanSelectedMedia={() => setSelectedMedia(null)}
                mediaSelectorBarOptions={availableContent}
                lockedContent={lockedContent}
                reactionLevel={1}
                tipping={tipping}
                tippingHandler={tippingHandler}
                selectedTip={selectedTip}
                updateTip={tipHandler}
                onChangeReactionLevel={() => setOpenReactionLevelModal(true)}
                voiceBot={selectedVoiceBot}
                onVoiceSelected={onVoiceSelected}
            />
            {/*
            <TweetReactionScreen onSend={this.onSendReaction}
                sending={this.state.sending}
                qoins={this.state.reactionLevel !== 1}
                currentReactioncost={this.state.costs[this.state.reactionLevel - 1]}
                costsPerReactionLevel={this.state.costs}
                mediaSelectorBarOptions={availableContent}
                numberOfReactions={this.state.numberOfReactions}
                avatarReaction={this.state.avatarReaction}
                custom3DText={this.state.custom3DText}
                onRemoveCustom3DText={() => this.setState({ custom3DText: null })}
                voiceBot={this.state.selectedVoiceBot}
                emoteRaid={this.state.selectedEmote}
                openTutorial={!this.state.tutorialDone}
                onChangeReactionLevel={() => this.setState({ openReactionLevelModal: true })}
                onClosingTutorial={this.onClosingTutorial}
                disableExtraTip={this.state.disableExtraTip}
                message={this.state.message}
                onMessageChanged={(message) => this.setState({ message })}
                onMediaOptionPress={this.onMediaOptionPress}
                randomEmoteUrl={this.state.randomEmoteUrl}
                mediaType={this.state.mediaType}
                selectedMedia={this.state.selectedMedia}
                cleanSelectedMedia={() => this.setState({ selectedMedia: null })}
                extraTip={this.state.extraTip}
                setExtraTip={this.setExtraTip}
                streamerImage={this.state.streamerData.streamerImage}
                streamerUid={this.state.streamerData.streamerUid}
                onCancel={() => this.props.navigation.dismiss()}
                onOpenSearchStreamerModal={() => this.setState({ openSearchStreamerModal: true })}
                onUpgradeReaction={this.onUpgradeReaction} />
         */}
            <GiphyMediaSelectorDialog open={openGiphyDialog}
                onClose={() => setOpenGiphyDialog(false)}
                mediaType={giphyDialogMediaType}
                onMediaSelected={onMediaSelected} />
            <MemeMediaSelectorDialog open={openMemeDialog}
                onClose={() => setOpenMemeDialog(false)}
                onMediaSelected={onMediaSelected} />
            <ReactionTierSelectorDialog open={openReactionLevelModal}
                onClose={() => setOpenReactionLevelModal(false)}
            />
            <ChooseBotVoiceDialog open={openBotVoiceDialog}
                onClose={() => setOpenBotVoiceDialog(false)}
                currentVoice={selectedVoiceBot}
                onVoiceSelected={onVoiceSelected}
            />
        </>
    );
}

export default TweetReactionController;
