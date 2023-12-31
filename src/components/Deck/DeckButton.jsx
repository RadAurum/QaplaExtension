import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList, Tabs, Tab } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as CheckDeck } from './../../assets/Icons/CheckDeck.svg';
import { ReactComponent as SelectDeck } from './../../assets/Icons/SelectDeck.svg';
import { ReactComponent as VolumeOff } from './../../assets/Icons/VolumeOff.svg';
import { ReactComponent as VolumeOn } from './../../assets/Icons/VolumeOn.svg';
import { ReactComponent as EditSquare } from './../../assets/Icons/EditSquare.svg';
import { ReactComponent as CircleArrows } from './../../assets/Icons/CircleArrows.svg';
import { ReactComponent as TextIcon } from './../../assets/Icons/Text.svg';
import { ReactComponent as Delete } from './../../assets/Icons/Delete.svg';


const DeckButtonContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '48%',
    height: '156px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
});

const DeckButtonMediaContainer = styled(Box)({
    display: 'flex',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
});

const DeckButtonImgGif = styled('img')({
    width: '100%',
    objectFit: 'cover',
});

const DeckButtonText = styled('input')({
    color: '#fff',
    fontFamily: 'Impact, Inter',
    textTransform: 'uppercase',
    fontSize: '22px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: 'auto auto 12px auto',
    textShadow: '2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    zIndex: 100,
    backgroundColor: '#0000',
    border: 'none',
    textAlign: 'center',
    '&:focus': {
        border: 'none',
        outline: 'none',
        caretColor: '#00FFDD'
    }
});

const HideUntilHoverContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    padding: '12px',
    zIndex: 100,
});

const UserContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    opacity: 0,
});

const UserAvatar = styled('img')({
    display: 'flex',
    backgroundColor: '#f0f',
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    overflow: 'hidden',
});

const UserName = styled(Typography)({
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '17px',
    letterSpacing: '-0.33764705061912537px',
    textShadow: '1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    marginLeft: '4px',
    maxWidth: '20ch',
});

const ButtonsContainer = styled(Box)({
    display: 'flex',
});

const EditPopUp = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#141539',
        padding: '16px',
        borderRadius: '10px',
        display: 'flex',
        // top: '0px',
    },
}));

const EditPopUpOptionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
});

const EditPopUpOption = styled(Box)({
    display: 'flex',
    gap: '4px',
    cursor: 'pointer',
});

const EditPopUpOptionText = styled(Box)({
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '17px',
});

const DeckButton = ({
    data,
    index,
    volumeDeckButton,
    selectedDeckButtons,
    handleAudioActivation,
    onClick,
    hideInfo,
    showEditButton,
    isGiphyVideo,
    id,
    reordering,
    onReplace,
    onRename,
    onRemove
}) => {

    const [label, setLabel] = useState(data.label);
    const [oldLabel, setOldLabel] = useState('');
    const labelRef = useRef();

    const [hovered, setHovered] = useState(false);
    const [openEditOptions, setOpenEditOptions] = useState(false);
    const [editingLabel, setEditingLabel] = useState(false);

    useEffect(() => {
        setLabel(data.label);
    }, [data])

    const handleEditButtonClick = (event) => {
        console.log('open edit')
        event.stopPropagation();
        setOpenEditOptions(true);
    }

    const handleReplace = (e) => {
        e.stopPropagation();
        onReplace(index, data);
    }

    const handleReplaceStart = (e) => {
        e.stopPropagation();
        setOpenEditOptions(false);
        startReplace(index);
    }

    const handleRename = (e) => {
        e.stopPropagation();
        setEditingLabel(true);
        setOpenEditOptions(false);
        setOldLabel(label);
        setTimeout(() => {
            labelRef.current.focus();
        }, 50);
    }

    const handleRenameOnChange = (e) => {
        setLabel(e.target.value);
    }

    const handleOutClickRename = (e) => {
        setEditingLabel(false);
        onRename(index, label);
    }

    const handleConfirmRename = (e) => {
        if (e.key === 'Escape') {
            setLabel(oldLabel);
            setEditingLabel(false);
            return;
        }
        if (e.key === 'Enter') {
            setEditingLabel(false);
            onRename(index, label);
        }
        console.log(index);
    }

    const handleRemove = (e) => {
        e.stopPropagation();
        setOpenEditOptions(false);
        onRemove(index);
    }

    return (
        <DeckButtonContainer style={{ cursor: reordering ? 'grab' : 'pointer' }} id={`deck-button-${data.id}`}
            onMouseEnter={(event) => {
                if (reordering) return;
                setHovered(true);
                if (hideInfo) return;
                event.currentTarget.children[1].children[0].classList.add('show-on-hover');
                event.currentTarget.children[1].children[1].children[0].classList.add('show-on-hover');
                if (showEditButton) return;
                event.currentTarget.children[1].children[1].children[1].classList.add('show-on-hover');
            }}
            onMouseLeave={(event) => {
                if (reordering) return;
                setHovered(false);
                if (hideInfo) return;
                event.currentTarget.children[1].children[0].classList.remove('show-on-hover');
                event.currentTarget.children[1].children[1].children[0].classList.remove('show-on-hover');
                if (showEditButton) return;
                event.currentTarget.children[1].children[1].children[1].classList.remove('show-on-hover');
            }}
            onClick={(event) => {
                if (reordering) return;
                onClick(data);
                if (hideInfo) return;
            }}>
            <DeckButtonMediaContainer>
                {isGiphyVideo ?
                    giphyVideo ?
                        <Video gif={giphyVideo}
                            width={200}
                            muted={muted}
                            controls
                            hideAttribution
                            hideProgressBar
                            hideMute />
                        :
                        null
                    :
                    <DeckButtonVideo src={data.url}
                        autoPlay
                        loop
                        muted={muted} />
                }
            </DeckButtonMediaContainer>
            {!hideInfo &&
                <HideUntilHoverContainer>
                    <UserContainer>
                        {/* <UserAvatar src={data.uploader.avatarImg} />
                        <UserName>{data.uploader.username}</UserName> */}
                    </UserContainer>
                    {showEditButton ?
                        <EditPopUp open={openEditOptions} placement='bottom-end' onClose={() => setOpenEditOptions(false)} title={
                            <React.Fragment>
                                <EditPopUpOptionsContainer>
                                    <EditPopUpOption onClick={replace}>
                                        <CircleArrows />
                                        <EditPopUpOptionText>{`Replace`}</EditPopUpOptionText>
                                    </EditPopUpOption>
                                    <EditPopUpOption onClick={rename}>
                                        <TextIcon />
                                        <EditPopUpOptionText>{`Rename`}</EditPopUpOptionText>
                                    </EditPopUpOption>
                                    <EditPopUpOption onClick={remove}>
                                        <Delete />
                                        <EditPopUpOptionText style={{ color: '#FF9C9C' }}>{`Remove`}</EditPopUpOptionText>
                                    </EditPopUpOption>
                                </EditPopUpOptionsContainer>
                            </React.Fragment>
                        } >
                            <ButtonsContainer>
                                <EditSquare onClick={handleEditButtonClick}
                                    style={{
                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                        opacity: 0,
                                        cursor: 'pointer',
                                    }} />
                            </ButtonsContainer>
                        </EditPopUp>

                        :
                        <ButtonsContainer>
                            {volumeDeckButton === data ?
                                <VolumeOn style={{ opacity: '1 !important' }} onClick={(e) => setMuted(!muted)} />
                                :
                                <VolumeOff style={{
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                    opacity: 0,
                                }} onClick={(e) => setMuted(!muted)} />
                            }
                            {selectedDeckButtons.find((button) => button.id === data.id) ?
                                <CheckDeck style={{ opacity: 1 }} />
                                :
                                <SelectDeck style={{
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                    opacity: hovered ? 1 : 0,
                                }} />
                            }
                        </ButtonsContainer>
                    }
                </HideUntilHoverContainer>
            }
            <DeckButtonText
                ref={labelRef}
                type='text'
                value={label}
                disabled={!editingLabel}
                onClick={(e) => { if (editingLabel) e.stopPropagation() }}
                style={{
                    cursor: editingLabel ? 'text' : 'pointer'
                }}
                onBlur={onLabelBlur}
                onChange={onLabelChange}
                onKeyDown={onLabelKeyDown}
            />
            <style>{`
                .show-on-hover {
                    opacity: 1 !important;
                }
            `}</style>
        </DeckButtonContainer>
    );
}

export default DeckButton