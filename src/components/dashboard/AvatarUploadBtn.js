import React, { useState,useRef } from 'react'
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalHeader from 'rsuite/lib/Modal/ModalHeader';
import {useModalState} from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import {useProfile} from '../../context/profile.context';
import ProfileAvatar from '../ProfileAvatar';
import { getuserUpdates } from '../../misc/helpers';


const fileInputTypes='.png, .jpeg, .jpg';
const acceptedFilesTypes = ['image/png','image/jpeg','image/pjpg'];
const isvalidFile = (file) => acceptedFilesTypes.includes(file.type);
const getBlob = (canvas) =>{
    return new Promise((resolve,reject) =>{
        canvas.toBlob((blob) =>{
            if (blob){
                resolve(blob);
            }else{
                reject(new Error ('File process error'));
            }
        })
    })
}

const AvatarUploadBtn = () => {
const {isOpen,open,close}=useModalState();

const {profile} = useProfile()
const [img,setImg]=useState(null);
const [isLoading,setIsLoading]=useState(false);
const AvatarEditorRef=useRef();
const onFileInputChange=(ev) =>{
    const currFiles = ev.target.files;
    if(currFiles.length === 1){
       const file = currFiles[0];
       if(isvalidFile(file)){
        setImg(file);
        open();
       } else{
           Alert.warning(`Wrong file type ${file.type}`,4000)
       }
    }
};
const onUploadClick = async() =>{
    const canvas = AvatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
   try {
      const blob= await  getBlob(canvas);
      const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob,{
          cacheControl:`public,max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL()

      const updates= await getuserUpdates(profile.uid,"avatar",downloadUrl,database);



   
    await database.ref().update(updates);
       setIsLoading(false);
       Alert.info('Avatar has been uploaded',4000);
   } catch (err) {
       setIsLoading(false);
       Alert.error(err.message,4000);
       
   }

}


    return (
        <div className="mt-3 text-center">
            <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge" />

            <div>
                <label htmlFor="avatar-upload" 
                className="d-block cursor-pointer padded"
                >
                    Select new avatatr 
                    <input id="avatar-upload"
                     type="file" 
                     className="d-none" 
                     accept={fileInputTypes}
                     onChange={onFileInputChange} 
                     />
                </label>
                <Modal show={isOpen} onHide={close}>
                    <ModalHeader>
                        <Modal.Title>
                            Adjust and upload new avatar
                        </Modal.Title>
                    </ModalHeader>
                    <ModalBody>
                        <div className="d-flex justify-content-center align-items-center h-100">
                        {img && (
                        <AvatarEditor
                        ref={AvatarEditorRef}
                        image={img}
                        width={200}
                        height={200}
                        border={10}
                        borderRadius={100}
                        rotate={0}
                      />
                        
                        )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button block appearance="ghost" onClick={onUploadClick} disabled={isLoading}>
                            Upload new avatar
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn
