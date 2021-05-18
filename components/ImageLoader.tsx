import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

export default function ImageLoader(params) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = (e) => {
    // Get the file and file type
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Make reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Start the upload
    const task = ref.put(file);

    // Listen to updated to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct: any = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => ref.getDownloadURL())
      .then((url) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div>
      {/* If uploading */}
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {/* If not uploading */}
      {!uploading && (
        <>
          <label className="btn">
            Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {/* If we have recieved a img url display it! */}
      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
