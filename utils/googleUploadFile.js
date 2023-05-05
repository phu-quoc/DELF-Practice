const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});
const that = (module.exports = {
  setFilePublic: async fileId => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const getUrl = await drive.files.get({
        fileId,
        fields: 'webViewLink, webContentLink',
      });

      return getUrl;
    } catch (err) {
      console.error(err);
    }
  },
  uploadFile: async (file, filename, mimetype, folderId) => {
    try {
      console.log(mimetype);
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file);
      const createFile = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: mimetype,
          parents: [folderId],
        },
        media: {
          mimeType: mimetype,
          body: bufferStream,
        },
      });
      const fileId = createFile.data.id;
      return await that.setFilePublic(fileId);
    } catch (err) {
      console.error(err);
    }
  },
  deleteFile: async fileId => {
    try {
      const deleteFile = await drive.files.delete({
        fileId: fileId,
      });
    } catch (err) {
      console.error(err);
    }
  },
});
