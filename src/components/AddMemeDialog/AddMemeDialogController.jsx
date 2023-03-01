import React, { useCallback, useState } from 'react';

import { saveMemeOnSubDeckSlot } from '../../services/database';
import { indexSubDeckMeme } from '../../services/functions';

import AddMemeDialog from './AddMemeDialog';
import MemeLibraryDialog from '../MemeLibraryDialog';
import NameMemeDialog from '../NameMemeDialog';
import OnlySubDialog from '../OnlySubDialog';
import UploadingMemeDialog from '../UploadingMemeDialog';

const AddMemeDialogController = ({ open, onClose, uid, streamerUid, indexToAddMeme }) => {
    const [fileToUpload, setFileToUpload] = useState(null);
    // const [uploadedMemeData, setUploadedMemeData] = useState(null);
    const [uploadedMemeData, setUploadedMemeData] = useState({
        height: 1080,
        url: "https://firebasestorage.googleapis.com/v0/b/qapplaapp.appspot.com/o/DecksMemes%2Fy2mate.com%20-%20The%20most%20accurate%20it%20is%20Wednesday%20my%20dudes%20in%20lego%20ever_1080p.mp4?alt=media&token=6ef85dcd-bf55-450c-bb6e-1c71529a32e7",
        width: 1920
    });
    const [openUploadingMemeDialog, setOpenUploadingMemeDialog] = useState(false);
    const [openNameMemeDialog, setOpenNameMemeDialog] = useState(true);
    const [openMemeLibDialog, setOpenMemeLibDialog] = useState(false);
    const [memeLibraryStartTab, setMemeLibraryStartTab] = useState(0);

    const toDeck = () => {
        setOpenMemeLibDialog(false);
        onClose();
    }

    const onSuccessfulUpload = (url) => {
        setUploadedMemeData({
            url,
            width: fileToUpload.width,
            height: fileToUpload.height
        });

        setOpenNameMemeDialog(true);
    }

    const onNameAdded = async (name) => {
        const indexMemeResponse = await indexSubDeckMeme(
            uid,
            streamerUid,
            name,
            uploadedMemeData.url,
            uploadedMemeData.width,
            uploadedMemeData.height
        );

        if (indexMemeResponse && indexMemeResponse.data && indexMemeResponse.data.id) {
            await saveMemeOnSubDeckSlot(uid, streamerUid, indexToAddMeme, {
                id: indexMemeResponse.data.id,
                name,
                ...uploadedMemeData,
                type: 'customVideo'
            });
        }

        onClose();
        setOpenUploadingMemeDialog(false);
        setOpenNameMemeDialog(false);
        setOpenMemeLibDialog(false);
    }

    const onMemeUploaded = useCallback(async (files, rejectedFiles) => {
        if (rejectedFiles[0] && rejectedFiles[0].errors && rejectedFiles[0].errors[0] && rejectedFiles[0].errors[0].code) {
            switch (rejectedFiles[0].errors[0].code) {
                case 'file-too-large':
                    // 8mb exceeded
                    break;
                case 'file-invalid-type':
                    // Invalid type
                    break;
                default:
                    break;
            }
        }

        if (files && files[0]) {
            const file = files[0];
            try {
                // Create a video
                const video = document.createElement('video');
                video.autoplay = false;

                // Preload their metadata
                video.preload = 'metadata';

                // When metadata is ready
                video.onloadedmetadata = () => {

                    //Check length of the video
                    if (video.duration <= 8) {
                        setFileToUpload({
                            file,
                            width: video.videoWidth,
                            height: video.videoHeight
                        });
                        setOpenUploadingMemeDialog(true);
                    } else {
                        console.log('Don`t upload meme');
                    }
                };

                video.src = URL.createObjectURL(file);
            } catch (e) {
                console.log(e);
            }
        }

    }, [uid, streamerUid]);

    console.log(uploadedMemeData);
    return (
        <>
        <AddMemeDialog openDialog={open}
            onClose={onClose}
            onMemeUploaded={onMemeUploaded}
            handleDeckButtonReplace={() => {}}
            replacing={false}
            setLibraryTab={(libraryIndex) => setMemeLibraryStartTab(libraryIndex)}
            setOpenMemeLibDialog={setOpenMemeLibDialog} />
        <UploadingMemeDialog open={openUploadingMemeDialog}
            onClose={() => setOpenUploadingMemeDialog(false)}
            fileToUpload={fileToUpload}
            onSuccessfulUpload={onSuccessfulUpload} />
        {uploadedMemeData &&
            <NameMemeDialog open={openNameMemeDialog}
                onClose={() => setOpenNameMemeDialog(false)}
                toDeck={toDeck}
                memeData={uploadedMemeData}
                onAddName={onNameAdded} />
        }
        <MemeLibraryDialog open={openMemeLibDialog}
            memeLibraryStartTab={memeLibraryStartTab}
            onClose={() => setOpenMemeLibDialog(false)}
            toDeck={toDeck} />
        <OnlySubDialog open={false} />
        </>
    );
}

export default AddMemeDialogController;