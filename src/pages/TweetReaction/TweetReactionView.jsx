import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Box, Button, CircularProgress, ClickAwayListener, IconButton, TextField, Typography, TooltipClasses, tooltipClasses } from '@mui/material';
import { Tooltip as MuiTooltip } from '@mui/material';
import Tooltip from 'react-power-tooltip';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as Interactions } from './../../assets/Icons/Interactions.svg';
import { ReactComponent as Gif } from './../../assets/Icons/GIF.svg';
import { ReactComponent as Meme } from './../../assets/Icons/Memes.svg';
import { ReactComponent as Sticker } from './../../assets/Icons/Sticker.svg';
import { ReactComponent as PlusCircle } from './../../assets/Icons/PlusCircle.svg';
import { ReactComponent as Close } from './../../assets/Icons/Close.svg';
import { ReactComponent as CheckCircle } from './../../assets/Icons/CheckCircle.svg';
import { ReactComponent as GiphyText } from './../../assets/Icons/GiphyText.svg';
import { ReactComponent as TTSVoice } from './../../assets/Icons/VolumeUp.svg';
import { ReactComponent as Bits } from './../../assets/Icons/Bits.svg';
import { ReactComponent as Arrow } from './../../assets/Icons/Arrow.svg';
import { ReactComponent as EditCircle } from './../../assets/Icons/EditCircle.svg';
import { ReactComponent as Next } from './../../assets/Icons/Next.svg';
import { ReactComponent as Wallet } from './../../assets/Icons/Wallet.svg';
import { ReactComponent as Menu } from './../../assets/Icons/Menu.svg';
import { ReactComponent as CloseMenu } from './../../assets/Icons/CloseMenu.svg';
import { ReactComponent as ExternalLinkWhite } from './../../assets/Icons/ExternalLinkWhite.svg';
import { CUSTOM_TTS_VOICE, EMOTE, GIPHY_GIFS, GIPHY_STICKERS, GIPHY_TEXT, MEMES, ZAP } from '../../constants';
const allMediaOptionsTypes = [
    GIPHY_GIFS,
    GIPHY_STICKERS,
    MEMES,
    EMOTE,
    GIPHY_TEXT,
    CUSTOM_TTS_VOICE
];

// Create mediaOptionsData
let mediaOptionsData = {
    [GIPHY_GIFS]: {
        Icon: Gif,
        label: i18n.t('TweetReactionView.gifs'),
        level: 1
    },
    [GIPHY_STICKERS]: {
        Icon: Sticker,
        label: i18n.t('TweetReactionView.stickers'),
        level: 1
    },
    [MEMES]: {
        Icon: Meme,
        label: i18n.t('TweetReactionView.memes'),
        level: 1
    },
    [EMOTE]: {
        label: i18n.t('TweetReactionView.emotes'),
        level: 3
    },
    [GIPHY_TEXT]: {
        Icon: GiphyText,
        label: i18n.t('TweetReactionView.text3D'),
        level: 2
    },
    [CUSTOM_TTS_VOICE]: {
        Icon: TTSVoice,
        label: i18n.t('TweetReactionView.botVoice'),
        level: 2
    }
};

// // Update mediaOptionsData if language changes
i18n.on('languageChanged', () => {
    mediaOptionsData = {
        [GIPHY_GIFS]: {
            Icon: Gif,
            label: i18n.t('TweetReactionView.gifs'),
            level: 1
        },
        [GIPHY_STICKERS]: {
            Icon: Sticker,
            label: i18n.t('TweetReactionView.stickers'),
            level: 1
        },
        [MEMES]: {
            Icon: Meme,
            label: i18n.t('TweetReactionView.memes'),
            level: 1
        },
        [EMOTE]: {
            label: i18n.t('TweetReactionView.emotes'),
            level: 3
        },
        [GIPHY_TEXT]: {
            Icon: GiphyText,
            label: i18n.t('TweetReactionView.text3D'),
            level: 2
        },
        [CUSTOM_TTS_VOICE]: {
            Icon: TTSVoice,
            label: i18n.t('TweetReactionView.botVoice'),
            level: 2
        }
    };
});

const excludingOptions = {
    [GIPHY_GIFS]: {
        [GIPHY_STICKERS]: true,
        [MEMES]: true
    },
    [GIPHY_STICKERS]: {
        [GIPHY_GIFS]: true,
        [MEMES]: true
    },
    [MEMES]: {
        [GIPHY_GIFS]: true,
        [GIPHY_STICKERS]: true
    },
};

const Container = styled(Box)({
    paddingTop: '56px',
    height: '100vh',
    width: '100%',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
});

const ContentContainer = styled(Box)({
    paddingLeft: '24px',
    paddingRight: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
});

const TTSContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column'
});

const UserMessageContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center'
});

const AvatarImage = styled(Avatar)({
    height: '56px',
    width: '56px'
});

const MessageContainer = styled(Box)({
    marginLeft: '16px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
});

const MessageInput = styled(TextField)({
    padding: 0,
    border: 'none'
});

const OptionalLabel = styled(Typography)({
    marginTop: '4px',
    color: '#7BB0FF',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '19px'
});

const Custom3DTextContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center'
});

const Edit3DTextButton = styled(IconButton)({
});

const Remove3DTextButton = styled(IconButton)({
});

const SelectedMediaContainer = styled(Box)({
    width: 'fit-content',
    paddingLeft: '72px',
    display: 'flex',
    flex: 1,
    position: 'relative',
    marginTop: '16px'
});

const SelectedMediaImage = styled(Box)((props) => ({
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '100%',
    objectFit: 'contain',
    maxHeight: '250px',
    aspectRatio: `${props.aspectratio} / 1`,
    borderRadius: '20px'
}));

const CloseIconButton = styled(IconButton)({
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.253621)',
    padding: 0
});

const ActionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
});

const PricesButton = styled(Button)({
    background: '#1C1E64',
    padding: '12px 24px',
    borderRadius: '14px',
    fontSize: '20px',
    fontWeight: '800',
    lineHeight: '24.2px',
    textTransform: 'none',
    color: '#FFF',
    '&:hover': {
        background: '#1C1E64',
        opacity: .8
    }
});

const SendButton = styled(Button)({
    display: 'flex',
    background: '#00FFDD',
    padding: '12px 24px',
    borderRadius: '100px',
    boxShadow: '0px 5px 30px -12.4441px rgba(0, 255, 221, 0.2)',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: 'normal',
    textTransform: 'none',
    boxSizing: 'border-box',
    color: '#0D1021',
    '&:hover': {
        background: '#00FFDD',
        opacity: .8
    }
});

const MediaSelectionContainer = styled(Box)({
    marginTop: '16px',
    background: '#141539',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between'
});

const MediaOptionsContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    padding: '8px 0px'
});

const MediaOptionButton = styled(IconButton)({
    padding: 0,
    position: 'relative'
});

const TooltipText = styled(Typography)({
    fontSize: '16px',
    fontWeight: '800',
    color: '#FFF'
});

const HighlightedText = styled('span')({
    color: '#00FFDD'
});

const TooltipButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '0 !important',
    paddingBottom: '24px !important'
});

const TooltipButton = styled(Button)({
    alignSelf: 'flex-end',
    backgroundColor: '#141735 !important',
    padding: '12px 24px !important',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '100px',
    textTransform: 'none'
});

const TipButton = styled(Button)({
    boxSizing: 'border-box',
    borderRadius: '100px',
    padding: '12px 24px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 'normal',
    textTransform: 'none',
    '&:hover': {
        opacity: .9
    }
});

const TipContainer = styled(Box)({
    display: 'flex',
    gap: '8px',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
    alignItems: 'flex-end',
});

const ChooseTipButton = styled(Button)({
    width: '24%',
    boxSizing: 'border-box',
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 10px 15px rgba(13, 16, 33, 0.75)',
    borderRadius: '25px',
    padding: '4px',
    background: 'linear-gradient(135deg, #3C00FF 0.31%, #AA00F8 100.31%)',
});

const ChooseTipButtonInnerContainer = styled(Box)({
    display: 'flex',
    flex: 1,
    height: '100%',
    flexGrow: 1,
    borderRadius: '24px',
    justifyContent: 'center',
    alignItems: 'center',
});

const ChooseTipButtonText = styled('p')({
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '29px',
    letterSpacing: '0px',
    textAlign: 'center',
    margin: 0,
    marginLeft: '2px',
});

const NoTipButton = styled(Button)({
    margin: '0px auto',
    background: '#3B4BF9',
    borderRadius: '100px',
    padding: '12px 24px',
    fontSize: '20px',
    fontWeight: '600',
    alignItems: 'center',
    lineHeight: 'normal',
    textTransform: 'none',
    color: '#FFF',
    '&:hover': {
        background: '#3B4BF9',
        opacity: .9
    }
});

const NoTipIcon = styled(Box)({
    display: 'flex',
    transform: 'rotate(45deg)',
    marginRight: '4px',
});

const PillsList = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    maxWidth: '100%',
    marginRight: '64px',
    '&::-webkit-scrollbar': {
        display: 'none'
    }
});

const Pill = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3px',
    flex: '0 0 auto',
    width: 'fit-content',
    background: 'linear-gradient(227.05deg, #FFD3FB 9.95%, #F5FFCB 48.86%, #9FFFDD 90.28%)',
    borderRadius: '1000px',
    marginTop: '28px',
});

const PillInnerContainer = styled(Box)({
    display: 'flex',
    flex: 1,
    padding: '7.5px 13px',
    borderRadius: '1000px',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#141539',
});

const PillText = styled('p')({
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '24px',
    letterSpacing: '0px',
    textAlign: 'left',
    margin: '0',

    background: 'linear-gradient(227.05deg, #FFD3FB 9.95%, #F5FFCB 48.86%, #9FFFDD 90.28%), #FFFFFF',
    webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
});

const RemoveButtonContainer = styled(Box)({
    display: 'flex',
    marginLeft: '8px',
    maxWidth: '24px',
    maxHeight: '24px',
    marginTop: '-16px',
});

const PillIconContainer = styled(Box)({
    marginTop: '-6px',
    marginRight: '16px',
    maxWidth: '16px',
    maxHeight: '16px',
});

const QaplaTooltipZero = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '215px',
        height: '90px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        top: '4px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '-140px !important',
        top: '-6px !important',
        width: '25px',
        height: '15px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipOne = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '215px',
        height: '90px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        bottom: '-16px',
        left: '24px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '-170px !important',
        bottom: '-6px !important',
        width: '25px',
        height: '15px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipTwo = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '315px',
        height: '130px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        bottom: '12px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '0px !important',
        bottom: '-8px !important',
        width: '25px',
        height: '18px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipThree = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '295px',
        height: '130px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        bottom: '24px',
        left: '-40px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '-30px !important',
        bottom: '-8px !important',
        width: '25px',
        height: '18px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipFour = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '215px',
        height: '90px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        bottom: '10px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '8px !important',
        bottom: '-6px !important',
        width: '25px',
        height: '15px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipFive = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        width: '215px',
        height: '130px',
        padding: '22px 16px',
        borderRadius: '15px',
        display: 'flex',
        top: '10px',
        right: '-16px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        left: '-8px !important',
        top: '-6px !important',
        width: '25px',
        height: '15px',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '4px',
        },
    },
}));

const QaplaTooltipDoneButton = styled(Button)({
    backgroundColor: '#141735',
    position: 'absolute',
    right: '12px',
    bottom: '12px',
    textTransform: 'none',
    borderRadius: '50px',
    color: '#fff',
    fontSize: '17px',
    fontWeight: '700',
    lineHeight: '20px',
    padding: '8px 20px',
    '&:hover': {
        backgroundColor: '#141735',
        opacity: '1',
    },
});

const QaplaTooltipText = styled(Typography)({
    color: '#fff',
    fontSize: '17px',
    fontWeight: '600',
    lineHeight: '22px',
    maxWidth: '196px',
    whiteSpace: 'pre-wrap',
});

const QaplaTooltipTextTwo = styled(Typography)({
    color: '#fff',
    fontSize: '17px',
    fontWeight: '600',
    lineHeight: '22px',
    maxWidth: '246px',
    whiteSpace: 'pre-wrap',
});

const QaplaToooltipTextHighlight = styled('span')({
    color: '#00FFDD',
});

const WalletContainer = styled(Box)({
    display: 'flex',
    marginRight: 'auto',
    marginLeft: '16px',
    alignSelf: 'center',
});

const WalletText = styled('p')({
    margin: '0px',
    marginLeft: '8px',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '20px',
});

const MenuButtonContainer = styled(Box)({
    display: 'flex',
    alignSelf: 'flex-start',
    height: '24px',
});

const MenuHintText = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
    marginRight: '8px',
    marginLeft: '-5ch',
});

const MenuPopUp = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#141539',
        // width: '250px',
        // height: '196px',
        padding: '24px',
        borderRadius: '20px',
        display: 'flex',
        top: '0px',
    },
}));

const AvatartTipOnMenu = styled(({ className, ...props }) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#3B4BF9',
        maxWidth: '200px',
        // height: '196px',
        padding: '15px',
        paddingRight: '30px',
        borderRadius: '20px',
        display: 'flex',
        right: '25px',
        boxSizing: 'border-box',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#3B4BF9',
        right: '-6px !important',
        width: '15px !important',
        height: '25px !important',
        // top: '-20px !important',
        '&::before': {
            color: '#3B4BF9',
            borderRadius: '5px',
        },
    },
}));

const MenuOptionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
});

const MenuOption = styled(Box)({
    display: 'flex',
    cursor: 'pointer',
});

const MenuOptionEmoji = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
    marginRight: '8px',
});

const MenuOptionText = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
});

const MediaOptionSelectedIcon = () => {
    return (
        <CheckCircle style={{
            position: 'absolute',
            top: -4,
            right: -8
        }} />
    );
}

const MediaOption = ({ index, type, disabled = false, excluded = false, onClick, isSelected, emoteUrl, tooltipText, tooltipHighlightedText, tooltipButtonText, reactionCost, reactionType, onTooltipClick }) => {
    const mediaOptionData = mediaOptionsData[type];
    const [showTooltip, setShowTooltip] = useState(false);

    // emoteUrl === undefined means we are trying to get the emote
    if (type === EMOTE && emoteUrl === undefined) {
        return (
            <CircularProgress size={32} />
        );
    }

    // emoteUrl === null means we could not find emotes
    if (type === EMOTE && emoteUrl === null) {
        return null;
    }

    return (
        <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <MediaOptionButton onClick={() => !disabled && !excluded ? onClick(type) : setShowTooltip(true)}
                style={{
                    opacity: (!disabled && !excluded) || showTooltip ? 1 : .2
                }}>
                <Tooltip show={showTooltip}
                    hoverBackground='#3B4BF9'
                    hoverColor='#FFF'
                    position='top center'
                    backgroundColor='#3B4BF9'
                    color='#FFF'
                    alert='rgb(0, 255, 221)'
                    padding='16px 24px 32px 16px'
                    arrowAlign={index === 0 || index === 1 || index === 2 ? 'start' : (index > 2 && 'center')}
                    textBoxWidth='350px'
                    borderRadius='15px'>
                    <TooltipText>
                        {tooltipText}
                        <HighlightedText>
                            {tooltipHighlightedText}
                        </HighlightedText>
                    </TooltipText>
                    <TooltipButtonContainer>
                        <TooltipButton endIcon={<Arrow style={{ marginTop: '6px' }} />}
                            onClick={() => onTooltipClick(mediaOptionsData[type].level, type)}>
                            {tooltipButtonText}
                            {reactionCost ?
                                <>
                                    <HighlightedText style={{
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        display: 'flex',
                                        marginLeft: '8px',
                                        marginRight: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '32px'
                                    }}>
                                        {reactionCost.toLocaleString()}
                                    </HighlightedText>
                                    {reactionType === ZAP ?
                                        <Interactions style={{
                                            height: '16px',
                                            width: '16px'
                                        }} />
                                        :
                                        <Bits style={{
                                            height: '16px',
                                            width: '16px'
                                        }} />
                                    }
                                </>
                                :
                                null
                            }
                        </TooltipButton>
                    </TooltipButtonContainer>
                </Tooltip>
                {isSelected &&
                    <MediaOptionSelectedIcon />
                }
                {type === EMOTE ?
                    emoteUrl ?
                        <img src={emoteUrl ? emoteUrl : null}
                            style={{ height: 32, width: 32 }}
                            alt='Selected Emote' />
                        :
                        null
                    :
                    <mediaOptionData.Icon height={32} width={32} />
                }
            </MediaOptionButton>
        </ClickAwayListener>
    );
}

const ExtraTipOption = ({ label, onClick, selected }) => {
    return (
        <ChooseTipButton onClick={onClick}>
            <ChooseTipButtonInnerContainer style={{
                backgroundColor: selected ? 'transparent' : '#0D1021',
            }}>
                <Bits />
                <ChooseTipButtonText>
                    {label}
                </ChooseTipButtonText>
            </ChooseTipButtonInnerContainer>
        </ChooseTipButton>
    );
}

const TweetReactionView = ({
    onSend,
    sending,
    numberOfReactions,
    message,
    setMessage,
    currentReactionCost,
    costsPerReactionLevel,
    onMediaOptionClick,
    selectedMedia,
    cleanSelectedMedia,
    mediaSelectorBarOptions,
    custom3DText,
    onRemoveCustom3DText,
    voiceBot,
    emoteRaid,
    reactionLevel,
    tipping,
    toggleTipping,
    extraTip,
    setExtraTip,
    onChangeReactionLevel,
    randomEmoteUrl,
    userImage,
    onUpgradeReaction,
    availableTips
}) => {
    const noEnabledOptions = allMediaOptionsTypes.filter((type) => !mediaSelectorBarOptions.includes(type));
    const [toolTipStep, setTooltipStep] = useState(null);
    const [hoverWallet, setHoverWallet] = useState(false);
    const [hoverMenu, setHoverMenu] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openAvatarTip, setOpenAvatarTip] = useState(false);
    const { t } = useTranslation('translation', { keyPrefix: 'TweetReactionView' });

    const isMediaOptionSelected = (mediaType) => {
        switch (mediaType) {
            case GIPHY_GIFS:
            case GIPHY_STICKERS:
            case MEMES:
                return selectedMedia && selectedMedia.type === mediaType;
            case GIPHY_TEXT:
                return Boolean(custom3DText).valueOf();
            case CUSTOM_TTS_VOICE:
                return Boolean(voiceBot).valueOf();
            case EMOTE:
                return Boolean(emoteRaid).valueOf();
            default:
                return false;
        }
    }

    const noTipButtonHandler = () => {
        toggleTipping();
        setExtraTip(null);
    }

    const setSelectedTip = (tipObject) => {
        toggleTipping();
        setExtraTip(tipObject);
    }

    // Disable the Send button if the cost is not fetched yet or if the reaction is already being sent
    const sendButtonDisabled = currentReactionCost === undefined || sending;

    let pills = [
        voiceBot,
        emoteRaid
    ];

    pills = pills.filter((item) => item).sort((a, b) => {
        return b.timestamp - a.timestamp;
    });

    pills.forEach((item) => {
        item.Icon = mediaOptionsData[item.type].Icon;
    });

    return (
        <Container>
            <ContentContainer>
                <TTSContainer>
                    <UserMessageContainer>
                        <AvatarImage
                            src={userImage} />
                        <MessageContainer>
                            {!custom3DText ?
                                <>
                                    <MessageInput variant='standard'
                                        InputProps={{
                                            disableUnderline: true,
                                            style: {
                                                fontSize: '22px',
                                                fontWeight: '400',
                                                color: '#FFF',
                                                '&::placeholder': {
                                                    color: '#C2C2C2'
                                                },
                                                padding: 0
                                            }
                                        }}
                                        // eslint-disable-next-line
                                        inputProps={{ maxLength: 100 }}
                                        multiline
                                        placeholder={t('typeToCreateTTS')}
                                        fullWidth
                                        autoFocus
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)} />
                                    {!message &&
                                        <QaplaTooltipZero open={toolTipStep === 0} placement="bottom-start" arrow title={
                                            <React.Fragment>
                                                <QaplaTooltipText>Start typing to send a <QaplaToooltipTextHighlight>Text-to-Speech</QaplaToooltipTextHighlight> using your custom avi</QaplaTooltipText>
                                                <Next style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    bottom: '12px',
                                                    cursor: 'pointer',
                                                }} onClick={() => {
                                                    setTooltipStep(toolTipStep + 1);
                                                }} />
                                            </React.Fragment>
                                        } >
                                            <OptionalLabel>
                                                {t('optional')}
                                            </OptionalLabel>
                                        </QaplaTooltipZero>
                                    }
                                </>
                                :
                                <Custom3DTextContainer>
                                    <img src={custom3DText.url}
                                        style={{
                                            width: window.innerWidth * .5,
                                            aspectRatio: custom3DText.width / custom3DText.height
                                        }}
                                        alt={message} />
                                    <Edit3DTextButton onClick={() => onMediaOptionClick(GIPHY_TEXT)}>
                                        <EditCircle />
                                    </Edit3DTextButton>
                                    <Remove3DTextButton onClick={onRemoveCustom3DText}>
                                        <Close style={{
                                            height: 24,
                                            width: 24
                                        }} />
                                    </Remove3DTextButton>
                                </Custom3DTextContainer>
                            }
                        </MessageContainer>
                        <MenuPopUp open={openMenu} placement="bottom-end" title={
                            <React.Fragment>
                                <MenuOptionsContainer>
                                    <MenuOption onClick={() => {
                                        setTooltipStep(0);
                                        setOpenMenu(false);
                                    }} style={{ opacity: openAvatarTip ? 0.6 : 1 }}>
                                        <MenuOptionEmoji>
                                            🦮
                                        </MenuOptionEmoji>
                                        <MenuOptionText>Extension Walkthrough</MenuOptionText>
                                    </MenuOption>
                                    <MenuOption onClick={() => {
                                        window.open('https://web.qapla.gg/hub/how', '_blank');
                                    }} style={{ opacity: openAvatarTip ? 0.6 : 1 }}>
                                        <MenuOptionEmoji>
                                            🎥
                                        </MenuOptionEmoji>
                                        <MenuOptionText>Tutorials</MenuOptionText>
                                        <ExternalLinkWhite style={{ marginLeft: 'auto' }} />
                                    </MenuOption>
                                    <AvatartTipOnMenu open={openAvatarTip} placement="left" arrow title={
                                        <React.Fragment>
                                            <QaplaTooltipText>{`Create your avatar and`} <QaplaToooltipTextHighlight>{`show off your virtual identity`}</QaplaToooltipTextHighlight> {`in all your reactions`}</QaplaTooltipText>
                                        </React.Fragment>
                                    } >
                                        <MenuOption onClick={() => {
                                            window.open('https://web.qapla.gg/hub/avatar', '_blank');
                                        }}>
                                            <MenuOptionEmoji>
                                                👽
                                            </MenuOptionEmoji>
                                            <MenuOptionText>Edit Avatar</MenuOptionText>
                                            <ExternalLinkWhite style={{ marginLeft: 'auto' }} />
                                        </MenuOption>
                                    </AvatartTipOnMenu>
                                    <MenuOption onClick={() => {
                                        window.open('https://www.discord.gg/6GBHn78', '_blank');
                                    }} style={{ opacity: openAvatarTip ? 0.6 : 1 }}>
                                        <MenuOptionEmoji>
                                            💬
                                        </MenuOptionEmoji>
                                        <MenuOptionText>Support</MenuOptionText>
                                        <ExternalLinkWhite style={{ marginLeft: 'auto' }} />
                                    </MenuOption>
                                </MenuOptionsContainer>
                            </React.Fragment>
                        } >
                            <MenuButtonContainer>
                                <MenuHintText style={{
                                    opacity: (hoverMenu || toolTipStep === 5) && !message ? '0.6' : '0.0',
                                }}>
                                    Menu
                                </MenuHintText>
                                <QaplaTooltipFive open={toolTipStep === 5} placement="bottom-start" arrow title={
                                    <React.Fragment>
                                        <QaplaTooltipText>{`You can always re-do this walkthrough.\n\nOr watch our wiki videos on YT`}</QaplaTooltipText>
                                        <QaplaTooltipDoneButton onClick={() => {
                                            setTooltipStep(toolTipStep + 1);
                                        }} >
                                            {`Done`}
                                        </QaplaTooltipDoneButton>
                                    </React.Fragment>
                                } >
                                    <div
                                        onMouseEnter={() => { setHoverMenu(true); }}
                                        onMouseLeave={() => { setHoverMenu(false); }}
                                        onClick={() => { if (toolTipStep === null || toolTipStep > 5) setOpenMenu(!openMenu) }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {openMenu ?
                                            <CloseMenu />
                                            :
                                            <Menu />
                                        }
                                    </div>
                                </QaplaTooltipFive>
                            </MenuButtonContainer>
                        </MenuPopUp>
                    </UserMessageContainer>
                    {pills.length > 0 &&
                        <PillsList>
                            {pills.map((pill) => (
                                <Pill key={pill.type}>
                                    <PillInnerContainer>
                                        <PillIconContainer>
                                            {pill.Icon ?
                                                <pill.Icon style={{
                                                    height: '24px',
                                                    width: '24px'
                                                }} />
                                                :
                                                <img src={pill.url}
                                                    style={{
                                                        height: '24px',
                                                        width: '24px'
                                                    }}
                                                    alt={pill.type} />
                                            }
                                        </PillIconContainer>
                                        <PillText>
                                            {pill.title}
                                        </PillText>
                                        <RemoveButtonContainer onClick={pill.onRemove}>
                                            <Close />
                                        </RemoveButtonContainer>
                                    </PillInnerContainer>
                                </Pill>
                            ))}
                        </PillsList>
                    }
                </TTSContainer>
                <SelectedMediaContainer>
                    {selectedMedia &&
                        <>
                            <SelectedMediaImage component='img'
                                src={selectedMedia.url}
                                aspectratio={selectedMedia.width / selectedMedia.height} />
                            <CloseIconButton onClick={cleanSelectedMedia}>
                                <Close style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px'
                                }} />
                            </CloseIconButton>
                        </>
                    }
                </SelectedMediaContainer>
                {!tipping ?
                    <ActionsContainer>
                        {currentReactionCost &&
                            <>
                                <QaplaTooltipTwo open={toolTipStep === 2} placement="top-start" arrow title={
                                    <React.Fragment>
                                        <QaplaTooltipTextTwo>{`Here you can see the Reaction Tier `}<QaplaToooltipTextHighlight>{`price in Bits or Zaps`}</QaplaToooltipTextHighlight>{`\n\nClick to expand to upgrade or downgrade your reaction`}</QaplaTooltipTextTwo>
                                        <Next style={{
                                            position: 'absolute',
                                            right: '12px',
                                            bottom: '12px',
                                            cursor: 'pointer',
                                        }} onClick={() => {
                                            setTooltipStep(toolTipStep + 1);
                                        }} />
                                    </React.Fragment>
                                } >
                                    <PricesButton startIcon={currentReactionCost.type === ZAP ? <Interactions /> : <Bits />}
                                        onClick={onChangeReactionLevel}>
                                        {currentReactionCost && currentReactionCost.price.toLocaleString()}
                                    </PricesButton>
                                </QaplaTooltipTwo>
                                <QaplaTooltipThree open={toolTipStep === 3} placement="top-start" arrow title={
                                    <React.Fragment>
                                        <QaplaTooltipTextTwo>{`Use your channel points to get Zap channel rewards\n\nHover over the wallet icon to see how many `}<QaplaToooltipTextHighlight>{`Zaps you have`}</QaplaToooltipTextHighlight>{``}</QaplaTooltipTextTwo>
                                        <Next style={{
                                            position: 'absolute',
                                            right: '12px',
                                            bottom: '12px',
                                            cursor: 'pointer',
                                        }} onClick={() => {
                                            setTooltipStep(toolTipStep + 1);
                                        }} />
                                    </React.Fragment>
                                } >
                                    <WalletContainer onMouseEnter={() => { setHoverWallet(true); }} onMouseLeave={() => { setHoverWallet(false); }}>
                                        <Wallet style={{ opacity: hoverWallet || toolTipStep === 3 ? 0.6 : 0.4 }} />
                                        <WalletText style={{
                                            opacity: hoverWallet || toolTipStep === 3 ? 0.6 : 0,
                                        }}>
                                            You have:
                                        </WalletText>
                                        <Interactions style={{
                                            marginLeft: '4px',
                                            opacity: hoverWallet || toolTipStep === 3 ? 1 : 0,
                                        }} />
                                        <WalletText style={{
                                            marginLeft: '4px',
                                            opacity: hoverWallet || toolTipStep === 3 ? 1 : 0,
                                        }}>
                                            0
                                        </WalletText>
                                    </WalletContainer>
                                </QaplaTooltipThree>
                                <SendButton onClick={onSend}
                                    disabled={sendButtonDisabled}>
                                    {t('send')}
                                </SendButton>
                            </>
                        }
                    </ActionsContainer>
                    :
                    <TipContainer>
                        {availableTips.map((tip) => (
                            <ExtraTipOption key={`tip-${tip.twitchSku}`}
                                label={(tip.cost).toLocaleString()}
                                selected={extraTip && tip.cost === extraTip.cost}
                                onClick={() => setSelectedTip(tip)} />
                        ))}
                    </TipContainer>
                }
            </ContentContainer>
            <QaplaTooltipOne open={toolTipStep === 1} placement="top-start" arrow title={
                <React.Fragment>
                    <QaplaTooltipText>Customize your reaction using the <QaplaToooltipTextHighlight>Add-ons</QaplaToooltipTextHighlight> Bar</QaplaTooltipText>
                    <Next style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '12px',
                        cursor: 'pointer',
                    }} onClick={() => {
                        setTooltipStep(toolTipStep + 1);
                    }} />
                </React.Fragment>
            } >
                <MediaSelectionContainer>
                    {!tipping ?
                        <>
                            <MediaOptionsContainer>
                                {mediaSelectorBarOptions.map((mediaType, index) => (
                                    <MediaOption key={mediaType}
                                        index={index}
                                        onClick={(type) => onMediaOptionClick(type)}
                                        type={mediaType}
                                        isSelected={isMediaOptionSelected(mediaType)}
                                        excluded={selectedMedia && excludingOptions[selectedMedia.type] && excludingOptions[selectedMedia.type][mediaType]}
                                        emoteUrl={randomEmoteUrl}
                                        tooltipText={t('youCanOnlyUseOne')}
                                        tooltipHighlightedText={t('excluded')}
                                        tooltipButtonText={t('use', { mediaType: t(mediaType) })}
                                        onTooltipClick={(level, media) => onMediaOptionClick(media)} />
                                ))}
                                {noEnabledOptions.map((mediaType, index) => (
                                    <MediaOption key={mediaType}
                                        index={index + mediaSelectorBarOptions.length}
                                        type={mediaType}
                                        onClick={(type) => onMediaOptionClick(type)}
                                        disabled
                                        emoteUrl={randomEmoteUrl}
                                        tooltipText={t('upgradeToUse')}
                                        tooltipHighlightedText={t(`contentAvailableWhenUpgradeTo${mediaOptionsData[mediaType].level}`)}
                                        tooltipButtonText={`Upgrade Reaction `}
                                        reactionCost={costsPerReactionLevel[mediaOptionsData[mediaType].level - 1] ? costsPerReactionLevel[mediaOptionsData[mediaType].level - 1].price : 0}
                                        reactionType={costsPerReactionLevel[mediaOptionsData[mediaType].level - 1] ? costsPerReactionLevel[mediaOptionsData[mediaType].level - 1].type : 0}
                                        onTooltipClick={onUpgradeReaction} />
                                ))}
                            </MediaOptionsContainer>
                            <QaplaTooltipFour open={toolTipStep === 4} placement="top-end" arrow title={
                                <React.Fragment>
                                    <QaplaTooltipText><QaplaToooltipTextHighlight>{`Send Cheers`}</QaplaToooltipTextHighlight>{` to your streamer adding extra Bits to your Reaction`}</QaplaTooltipText>
                                    <Next style={{
                                        position: 'absolute',
                                        right: '12px',
                                        bottom: '12px',
                                        cursor: 'pointer',
                                    }} onClick={() => {
                                        setTooltipStep(toolTipStep + 1);
                                    }} />
                                </React.Fragment>
                            } >
                                <TipButton startIcon={extraTip ? <EditCircle /> : <PlusCircle />}
                                    endIcon={extraTip ? <Bits /> : null}
                                    onClick={toggleTipping}
                                    style={{
                                        background: extraTip ? 'linear-gradient(118.67deg, #A716EE -6.39%, #2D07FA 101.45%), #141539' : '#3B4BF9',
                                    }}>
                                    {extraTip ?
                                        (extraTip.cost).toLocaleString()
                                        :
                                        'Bits'
                                    }
                                </TipButton>
                            </QaplaTooltipFour>
                        </>
                        :
                        <NoTipButton onClick={noTipButtonHandler}>
                            <NoTipIcon>
                                <PlusCircle />
                            </NoTipIcon>
                            No Bits
                        </NoTipButton>
                    }
                </MediaSelectionContainer>
            </QaplaTooltipOne>
        </Container >
    );
}

export default TweetReactionView;